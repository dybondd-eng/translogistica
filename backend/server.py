from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import bcrypt
import jwt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, EmailStr
from starlette.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

STATUSES = [
    "Pedido recebido",
    "Mercadoria coletada",
    "Em transporte",
    "Chegou à unidade de destino",
    "Saiu para entrega",
    "Entregue",
]


def to_str_id(v):
    if isinstance(v, ObjectId):
        return str(v)
    return v


PyObjectId = Annotated[str, BeforeValidator(to_str_id)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc: dict):
        if not doc:
            return None
        return cls.model_validate(doc)

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True, exclude_none=True)
        data.pop("_id", None)
        return data


# ---------- Models ----------
class Movimentacao(BaseModel):
    data_hora: str
    local: str
    status: str
    observacao: str = ""


class EntregaBase(BaseModel):
    codigo: str
    destinatario_nome: str
    destinatario_telefone: str = ""
    origem_cidade: str
    origem_estado: str
    destino_cidade: str
    destino_estado: str
    data_coleta: str = ""
    previsao_entrega: str = ""
    status_atual: str = STATUSES[0]
    localizacao_atual: str = ""
    observacao: str = ""
    transportadora: str = "TransLog"


class EntregaCreate(EntregaBase):
    movimentacoes: List[Movimentacao] = []


class EntregaUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    codigo: Optional[str] = None
    destinatario_nome: Optional[str] = None
    destinatario_telefone: Optional[str] = None
    origem_cidade: Optional[str] = None
    origem_estado: Optional[str] = None
    destino_cidade: Optional[str] = None
    destino_estado: Optional[str] = None
    data_coleta: Optional[str] = None
    previsao_entrega: Optional[str] = None
    status_atual: Optional[str] = None
    localizacao_atual: Optional[str] = None
    observacao: Optional[str] = None
    transportadora: Optional[str] = None


class Entrega(BaseDocument, EntregaBase):
    movimentacoes: List[Movimentacao] = []
    criado_em: Optional[str] = None
    atualizado_em: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    token = creds.credentials if creds else request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    user["_id"] = str(user["_id"])
    user.pop("password_hash", None)
    return user


app = FastAPI(title="TransLog API")
api = APIRouter(prefix="/api")


# ---------- Public ----------
@api.get("/")
async def root():
    return {"message": "TransLog API"}


@api.get("/statuses")
async def get_statuses():
    return {"statuses": STATUSES}


@api.get("/track/{codigo}")
async def track(codigo: str):
    doc = await db.entregas.find_one({"codigo": codigo.strip().upper()})
    if not doc:
        raise HTTPException(
            status_code=404,
            detail="Não encontramos uma entrega com este código. Verifique o código informado e tente novamente.",
        )
    e = Entrega.from_mongo(doc)
    movs = sorted(e.movimentacoes, key=lambda m: m.data_hora)
    return {
        "codigo": e.codigo,
        "destinatario_nome": mask_name(e.destinatario_nome),
        "origem": f"{e.origem_cidade} - {e.origem_estado}",
        "destino": f"{e.destino_cidade} - {e.destino_estado}",
        "status_atual": e.status_atual,
        "ultima_atualizacao": e.atualizado_em,
        "previsao_entrega": e.previsao_entrega,
        "transportadora": e.transportadora,
        "localizacao_atual": e.localizacao_atual,
        "observacao": e.observacao,
        "etapas": STATUSES,
        "etapa_atual_index": STATUSES.index(e.status_atual) if e.status_atual in STATUSES else 0,
        "movimentacoes": [m.model_dump() for m in movs],
    }


def mask_name(nome: str) -> str:
    parts = [p for p in nome.split() if p]
    if len(parts) <= 1:
        return nome
    return " ".join([parts[0]] + [f"{p[0]}." for p in parts[1:]])


# ---------- Auth ----------
@api.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")
    token = create_access_token(str(user["_id"]), email)
    response.set_cookie("access_token", token, httponly=True, secure=True,
                        samesite="none", max_age=43200, path="/")
    return {"access_token": token, "user": {"email": email, "name": user.get("name"), "role": user.get("role")}}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"email": user["email"], "name": user.get("name"), "role": user.get("role")}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


# ---------- Admin ----------
def oid(entrega_id: str) -> ObjectId:
    try:
        return ObjectId(entrega_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@api.get("/admin/stats")
async def stats(user: dict = Depends(get_current_user)):
    total = await db.entregas.count_documents({})
    counts = {}
    for s in STATUSES:
        counts[s] = await db.entregas.count_documents({"status_atual": s})
    return {"total": total, "por_status": counts}


@api.get("/admin/proximo-codigo")
async def proximo_codigo(user: dict = Depends(get_current_user)):
    prefixo = f"TL{datetime.now(timezone.utc).year}"
    seq = await db.entregas.count_documents({"codigo": {"$regex": f"^{prefixo}"}}) + 1
    while await db.entregas.find_one({"codigo": f"{prefixo}{seq:04d}BR"}):
        seq += 1
    return {"codigo": f"{prefixo}{seq:04d}BR"}


@api.get("/admin/entregas", response_model=List[Entrega], response_model_by_alias=False)
async def list_entregas(search: str = "", user: dict = Depends(get_current_user)):
    query = {}
    if search.strip():
        s = search.strip()
        query = {"$or": [
            {"codigo": {"$regex": s, "$options": "i"}},
            {"destinatario_nome": {"$regex": s, "$options": "i"}},
        ]}
    docs = await db.entregas.find(query).sort("criado_em", -1).to_list(500)
    return [Entrega.from_mongo(d) for d in docs]


@api.get("/admin/entregas/{entrega_id}", response_model=Entrega, response_model_by_alias=False)
async def get_entrega(entrega_id: str, user: dict = Depends(get_current_user)):
    doc = await db.entregas.find_one({"_id": oid(entrega_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    return Entrega.from_mongo(doc)


@api.post("/admin/entregas", response_model=Entrega, response_model_by_alias=False, status_code=201)
async def create_entrega(payload: EntregaCreate, user: dict = Depends(get_current_user)):
    codigo = payload.codigo.strip().upper()
    if not codigo:
        raise HTTPException(status_code=422, detail="Código é obrigatório")
    if payload.status_atual not in STATUSES:
        raise HTTPException(status_code=422, detail="Status inválido")
    if await db.entregas.find_one({"codigo": codigo}):
        raise HTTPException(status_code=409, detail="Já existe uma entrega com este código.")
    entrega = Entrega(**payload.model_dump())
    entrega.codigo = codigo
    entrega.criado_em = now_iso()
    entrega.atualizado_em = now_iso()
    if not entrega.movimentacoes:
        entrega.movimentacoes = [Movimentacao(
            data_hora=now_iso(),
            local=entrega.localizacao_atual or f"{entrega.origem_cidade} - {entrega.origem_estado}",
            status=entrega.status_atual,
            observacao=entrega.observacao or "Entrega registrada no sistema.",
        )]
    res = await db.entregas.insert_one(entrega.to_mongo())
    doc = await db.entregas.find_one({"_id": res.inserted_id})
    return Entrega.from_mongo(doc)


@api.put("/admin/entregas/{entrega_id}", response_model=Entrega, response_model_by_alias=False)
async def update_entrega(entrega_id: str, payload: EntregaUpdate, user: dict = Depends(get_current_user)):
    _id = oid(entrega_id)
    existing = await db.entregas.find_one({"_id": _id})
    if not existing:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    updates = {k: v for k, v in payload.model_dump(exclude_none=True).items()}
    if "codigo" in updates:
        updates["codigo"] = updates["codigo"].strip().upper()
        dup = await db.entregas.find_one({"codigo": updates["codigo"], "_id": {"$ne": _id}})
        if dup:
            raise HTTPException(status_code=409, detail="Já existe uma entrega com este código.")
    if "status_atual" in updates and updates["status_atual"] not in STATUSES:
        raise HTTPException(status_code=422, detail="Status inválido")
    updates["atualizado_em"] = now_iso()
    await db.entregas.update_one({"_id": _id}, {"$set": updates})
    doc = await db.entregas.find_one({"_id": _id})
    return Entrega.from_mongo(doc)


@api.delete("/admin/entregas/{entrega_id}")
async def delete_entrega(entrega_id: str, user: dict = Depends(get_current_user)):
    res = await db.entregas.delete_one({"_id": oid(entrega_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    return {"ok": True}


class MovimentacaoCreate(BaseModel):
    local: str
    status: str
    observacao: str = ""
    data_hora: Optional[str] = None
    previsao_entrega: Optional[str] = None


@api.post("/admin/entregas/{entrega_id}/movimentacoes", response_model=Entrega, response_model_by_alias=False)
async def add_movimentacao(entrega_id: str, payload: MovimentacaoCreate, user: dict = Depends(get_current_user)):
    _id = oid(entrega_id)
    existing = await db.entregas.find_one({"_id": _id})
    if not existing:
        raise HTTPException(status_code=404, detail="Entrega não encontrada")
    if payload.status not in STATUSES:
        raise HTTPException(status_code=422, detail="Status inválido")
    if not payload.local.strip():
        raise HTTPException(status_code=422, detail="Local é obrigatório")
    mov = Movimentacao(
        data_hora=payload.data_hora or now_iso(),
        local=payload.local.strip(),
        status=payload.status,
        observacao=payload.observacao,
    )
    sets = {
        "status_atual": payload.status,
        "localizacao_atual": mov.local,
        "observacao": payload.observacao,
        "atualizado_em": now_iso(),
    }
    if payload.previsao_entrega:
        sets["previsao_entrega"] = payload.previsao_entrega
    await db.entregas.update_one(
        {"_id": _id}, {"$push": {"movimentacoes": mov.model_dump()}, "$set": sets}
    )
    doc = await db.entregas.find_one({"_id": _id})
    return Entrega.from_mongo(doc)


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


async def seed():
    await db.users.create_index("email", unique=True)
    await db.entregas.create_index("codigo", unique=True)
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Administrador",
            "role": "admin",
            "created_at": now_iso(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})

    # Sem entregas de exemplo: a base inicia vazia.


@app.on_event("startup")
async def on_startup():
    await seed()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
