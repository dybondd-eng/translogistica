import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (res.ok) navigate("/admin");
    else setError(res.error);
  };

  const input = "h-14 w-full border border-zinc-700 bg-zinc-900 px-4 text-white outline-none placeholder:text-zinc-600 focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2 focus:ring-offset-zinc-950";

  return (
    <div className="grain relative flex min-h-screen items-center justify-center bg-zinc-950 px-5 py-16">
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center gap-3" data-testid="login-logo">
          <span className="flex h-10 w-10 items-center justify-center bg-[#FF5A00] text-white">
            <Truck size={22} />
          </span>
          <span className="font-display text-xl font-black text-white">
            Trans<span className="text-[#FF5A00]">Log</span>
          </span>
        </Link>

        <h1 className="mt-10 font-display text-3xl font-black tracking-tight text-white">Área administrativa</h1>
        <p className="mt-3 text-sm text-zinc-400">Acesso restrito à equipe TransLog.</p>

        <form onSubmit={submit} className="mt-8 space-y-4" data-testid="admin-login-form">
          <div>
            <label className="label-caps text-zinc-500">E-mail</label>
            <input
              type="email"
              className={`mt-2 ${input}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="admin-login-email"
              placeholder="admin@translog.com.br"
            />
          </div>
          <div>
            <label className="label-caps text-zinc-500">Senha</label>
            <input
              type="password"
              className={`mt-2 ${input}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="admin-login-password"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="border border-red-900 bg-red-950/60 p-4 text-sm text-red-300" data-testid="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="flex h-14 w-full items-center justify-center gap-3 bg-[#FF5A00] font-display font-bold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#FF7A33] disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />} Entrar
          </button>
        </form>

        <Link to="/" className="mt-8 block text-sm text-zinc-500 hover:text-white" data-testid="back-to-site">
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
