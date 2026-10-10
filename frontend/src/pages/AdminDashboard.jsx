import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Truck, LogOut, Plus, Search, Eye, Pencil, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { api, formatApiErrorDetail, formatDate, STATUSES } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { EntregaFormDialog, MovimentacaoDialog } from "@/components/admin/EntregaDialogs";
import { EntregaViewDialog } from "@/components/admin/EntregaViewDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColor = (s) => {
  if (s === "Entregue") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "Saiu para entrega") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "Pedido recebido") return "bg-zinc-100 text-zinc-600 border-zinc-200";
  return "bg-orange-50 text-[#E04F00] border-orange-200";
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [entregas, setEntregas] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [movTarget, setMovTarget] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const [list, st] = await Promise.all([
        api.get("/admin/entregas", { params: { search: q } }),
        api.get("/admin/stats"),
      ]);
      setEntregas(list.data);
      setStats(st.data);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const cards = useMemo(() => {
    const c = stats?.por_status || {};
    return [
      { label: "Total de entregas", value: stats?.total ?? 0, testid: "card-total" },
      { label: "Aguardando coleta", value: c["Pedido recebido"] ?? 0, testid: "card-aguardando" },
      { label: "Em transporte", value: c["Em transporte"] ?? 0, testid: "card-transporte" },
      { label: "Saiu para entrega", value: c["Saiu para entrega"] ?? 0, testid: "card-saiu" },
      { label: "Entregues", value: c["Entregue"] ?? 0, testid: "card-entregues" },
    ];
  }, [stats]);

  const saveEntrega = async (form) => {
    try {
      if (editing) {
        await api.put(`/admin/entregas/${editing.id}`, form);
        toast.success("Entrega atualizada com sucesso.");
      } else {
        await api.post("/admin/entregas", form);
        toast.success("Entrega cadastrada com sucesso.");
      }
      setFormOpen(false);
      setEditing(null);
      await load(search);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: formatApiErrorDetail(e.response?.data?.detail) };
    }
  };

  const addMovimentacao = async (form) => {
    try {
      await api.post(`/admin/entregas/${movTarget.id}/movimentacoes`, form);
      toast.success("Movimentação adicionada. Já visível para o cliente.");
      setMovTarget(null);
      await load(search);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: formatApiErrorDetail(e.response?.data?.detail) };
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/entregas/${deleting.id}`);
      toast.success("Entrega excluída.");
      setDeleting(null);
      await load(search);
    } catch (e) {
      toast.error(formatApiErrorDetail(e.response?.data?.detail));
    }
  };

  const iconBtn = "flex h-9 w-9 items-center justify-center border border-zinc-200 text-zinc-600 transition-colors duration-200 hover:border-zinc-900 hover:text-zinc-900";

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/5cc1b7129a9bbe83_file_00000000e538820eb41137dcd12a9d0d.webp"
              alt="TransLogistica"
              className="h-10 w-auto bg-white px-2 py-1 object-contain"
            />
            <span className="label-caps text-zinc-500">Painel</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:inline" data-testid="admin-user-email">{user?.email}</span>
            <button
              onClick={logout}
              data-testid="admin-logout"
              className="flex items-center gap-2 border border-zinc-700 px-4 py-2 label-caps text-zinc-300 transition-colors duration-200 hover:border-[#FF5A00] hover:text-[#FF5A00]"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-caps text-[#FF5A00]">Dashboard</p>
            <h1 className="mt-3 font-display text-3xl font-black tracking-tight md:text-4xl">Gestão de entregas</h1>
          </div>
          <button
            onClick={() => { setEditing(null); setFormOpen(true); }}
            data-testid="nova-entrega-button"
            className="flex h-14 items-center gap-3 bg-[#FF5A00] px-7 font-display font-bold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#E04F00]"
          >
            <Plus size={18} /> Nova entrega
          </button>
        </div>

        <div className="mt-8 grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-5" data-testid="stats-cards">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6"
              data-testid={c.testid}
            >
              <p className="label-caps text-zinc-400">{c.label}</p>
              <p className="mt-4 font-display text-4xl font-black tracking-tight">{c.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 border border-zinc-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 p-6">
            <h2 className="font-display text-lg font-bold tracking-tight">Entregas cadastradas</h2>
            <div className="relative w-full sm:w-80">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por código ou destinatário"
                data-testid="admin-search-input"
                className="h-12 w-full border border-zinc-300 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 p-10 text-zinc-500" data-testid="admin-loading">
              <Loader2 className="animate-spin" size={18} /> Carregando entregas...
            </div>
          ) : entregas.length === 0 ? (
            <p className="p-10 text-sm text-zinc-500" data-testid="admin-empty">Nenhuma entrega encontrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm" data-testid="entregas-table">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    {["Código", "Destinatário", "Origem", "Destino", "Status", "Previsão", "Ações"].map((h) => (
                      <th key={h} className="px-5 py-4 label-caps text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entregas.map((e) => (
                    <tr key={e.id} className="border-b border-zinc-100 hover:bg-zinc-50/70" data-testid={`entrega-row-${e.codigo}`}>
                      <td className="px-5 py-4 font-mono text-xs tracking-wider">{e.codigo}</td>
                      <td className="px-5 py-4">{e.destinatario_nome}</td>
                      <td className="px-5 py-4 text-zinc-500">{e.origem_cidade} - {e.origem_estado}</td>
                      <td className="px-5 py-4 text-zinc-500">{e.destino_cidade} - {e.destino_estado}</td>
                      <td className="px-5 py-4">
                        <span className={`border px-2.5 py-1 text-xs font-semibold ${statusColor(e.status_atual)}`}>
                          {e.status_atual}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-500">{formatDate(e.previsao_entrega)}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button title="Visualizar" className={iconBtn} onClick={() => setViewing(e)} data-testid={`view-${e.codigo}`}><Eye size={15} /></button>
                          <button title="Editar" className={iconBtn} onClick={() => { setEditing(e); setFormOpen(true); }} data-testid={`edit-${e.codigo}`}><Pencil size={15} /></button>
                          <button title="Atualizar status" className={iconBtn} onClick={() => setMovTarget(e)} data-testid={`status-${e.codigo}`}><RefreshCw size={15} /></button>
                          <button title="Excluir" className={`${iconBtn} hover:border-red-600 hover:text-red-600`} onClick={() => setDeleting(e)} data-testid={`delete-${e.codigo}`}><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          Status disponíveis: {STATUSES.join(" · ")}
        </p>
      </main>

      <EntregaFormDialog
        open={formOpen}
        entrega={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={saveEntrega}
      />
      <MovimentacaoDialog
        open={!!movTarget}
        entrega={movTarget}
        onClose={() => setMovTarget(null)}
        onSubmit={addMovimentacao}
      />
      <EntregaViewDialog open={!!viewing} entrega={viewing} onClose={() => setViewing(null)} />

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent className="rounded-sm" data-testid="delete-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-black tracking-tight">Excluir entrega?</AlertDialogTitle>
            <AlertDialogDescription>
              A entrega <span className="font-mono">{deleting?.codigo}</span> e todo o seu histórico de movimentações serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-cancel">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} data-testid="delete-confirm" className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
