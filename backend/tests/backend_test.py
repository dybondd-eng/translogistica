"""Backend API tests for TransLog."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://cargo-monitor-76.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@translog.com.br"
ADMIN_PASSWORD = "Translog@2026"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Public ----------
class TestPublic:
    def test_root(self):
        r = requests.get(f"{API}/")
        assert r.status_code == 200

    def test_track_valid(self):
        r = requests.get(f"{API}/track/TL2026001BR")
        assert r.status_code == 200
        data = r.json()
        assert data["codigo"] == "TL2026001BR"
        assert data["status_atual"] == "Em transporte"
        assert len(data["etapas"]) == 6
        assert data["etapa_atual_index"] == 2
        assert len(data["movimentacoes"]) >= 3
        # Name should be masked
        assert "." in data["destinatario_nome"]

    def test_track_lowercase_input(self):
        r = requests.get(f"{API}/track/tl2026001br")
        assert r.status_code == 200

    def test_track_not_found(self):
        r = requests.get(f"{API}/track/ABC123")
        assert r.status_code == 404
        assert "Não encontramos" in r.json()["detail"]

    def test_statuses(self):
        r = requests.get(f"{API}/statuses")
        assert r.status_code == 200
        assert len(r.json()["statuses"]) == 6


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["user"]["role"] == "admin"

    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_admin_endpoint_without_token(self):
        r = requests.get(f"{API}/admin/entregas")
        assert r.status_code == 401

    def test_me(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---------- Admin CRUD ----------
class TestAdmin:
    def test_stats(self, auth_headers):
        r = requests.get(f"{API}/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["total"] >= 4
        assert "Em transporte" in d["por_status"]

    def test_list_entregas(self, auth_headers):
        r = requests.get(f"{API}/admin/entregas", headers=auth_headers)
        assert r.status_code == 200
        assert len(r.json()) >= 4

    def test_search_by_codigo(self, auth_headers):
        r = requests.get(f"{API}/admin/entregas?search=TL2026001", headers=auth_headers)
        assert r.status_code == 200
        arr = r.json()
        assert len(arr) == 1
        assert arr[0]["codigo"] == "TL2026001BR"

    def test_search_by_destinatario(self, auth_headers):
        r = requests.get(f"{API}/admin/entregas?search=maria", headers=auth_headers)
        assert r.status_code == 200
        assert any("Maria" in e["destinatario_nome"] for e in r.json())

    def test_crud_full_flow(self, auth_headers):
        codigo = f"TEST{uuid.uuid4().hex[:8].upper()}BR"
        payload = {
            "codigo": codigo, "destinatario_nome": "TEST User",
            "origem_cidade": "São Paulo", "origem_estado": "SP",
            "destino_cidade": "Rio", "destino_estado": "RJ",
            "status_atual": "Pedido recebido",
        }
        # Create
        r = requests.post(f"{API}/admin/entregas", json=payload, headers=auth_headers)
        assert r.status_code == 201, r.text
        e = r.json()
        eid = e["id"]
        assert e["codigo"] == codigo
        assert len(e["movimentacoes"]) == 1  # auto-created

        # Duplicate -> 409
        r2 = requests.post(f"{API}/admin/entregas", json=payload, headers=auth_headers)
        assert r2.status_code == 409
        assert "Já existe" in r2.json()["detail"]

        # Get
        r3 = requests.get(f"{API}/admin/entregas/{eid}", headers=auth_headers)
        assert r3.status_code == 200

        # Update
        r4 = requests.put(f"{API}/admin/entregas/{eid}", json={"destinatario_nome": "TEST Updated"}, headers=auth_headers)
        assert r4.status_code == 200
        assert r4.json()["destinatario_nome"] == "TEST Updated"

        # Add movimentacao
        mov = {"local": "Campinas - SP", "status": "Em transporte", "observacao": "Testing"}
        r5 = requests.post(f"{API}/admin/entregas/{eid}/movimentacoes", json=mov, headers=auth_headers)
        assert r5.status_code == 200
        d5 = r5.json()
        assert d5["status_atual"] == "Em transporte"
        assert d5["localizacao_atual"] == "Campinas - SP"
        assert len(d5["movimentacoes"]) == 2

        # Public track should reflect
        r6 = requests.get(f"{API}/track/{codigo}")
        assert r6.status_code == 200
        assert r6.json()["status_atual"] == "Em transporte"
        assert len(r6.json()["movimentacoes"]) == 2

        # Delete
        r7 = requests.delete(f"{API}/admin/entregas/{eid}", headers=auth_headers)
        assert r7.status_code == 200

        # Verify deletion
        r8 = requests.get(f"{API}/admin/entregas/{eid}", headers=auth_headers)
        assert r8.status_code == 404

    def test_invalid_status(self, auth_headers):
        payload = {
            "codigo": f"TEST{uuid.uuid4().hex[:6].upper()}", "destinatario_nome": "X",
            "origem_cidade": "SP", "origem_estado": "SP",
            "destino_cidade": "RJ", "destino_estado": "RJ",
            "status_atual": "Status Invalido",
        }
        r = requests.post(f"{API}/admin/entregas", json=payload, headers=auth_headers)
        assert r.status_code == 422
