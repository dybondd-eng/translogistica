import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { STATUSES } from "@/lib/api";

const inputCls =
  "h-12 w-full border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2";

const empty = {
  codigo: "",
  destinatario_nome: "",
  destinatario_telefone: "",
  origem_cidade: "",
  origem_estado: "",
  destino_cidade: "",
  destino_estado: "",
  data_coleta: "",
  previsao_entrega: "",
  status_atual: STATUSES[0],
  localizacao_atual: "",
  observacao: "",
  transportadora: "TransLog",
};

export const EntregaFormDialog = ({ open, onClose, onSubmit, entrega }) => {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setForm(entrega ? { ...empty, ...entrega } : empty);
    }
  }, [open, entrega]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const required = [
      ["codigo", "Código da entrega"],
      ["destinatario_nome", "Nome do destinatário"],
      ["origem_cidade", "Cidade de origem"],
      ["origem_estado", "Estado de origem"],
      ["destino_cidade", "Cidade de destino"],
      ["destino_estado", "Estado de destino"],
    ];
    for (const [k, label] of required) {
      if (!String(form[k] || "").trim()) {
        setError(`O campo "${label}" é obrigatório.`);
        return;
      }
    }
    setSaving(true);
    const res = await onSubmit(form);
    setSaving(false);
    if (!res?.ok) setError(res?.error || "Erro ao salvar.");
  };

  const F = ({ label, k, type = "text", testid }) => (
    <div>
      <label className="label-caps text-zinc-400">{label}</label>
      <input type={type} className={`mt-2 ${inputCls}`} value={form[k] || ""} onChange={set(k)} data-testid={testid} />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-sm" data-testid="entrega-form-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-black tracking-tight">
            {entrega ? "Editar entrega" : "Cadastrar nova entrega"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Código da entrega" k="codigo" testid="form-codigo" />
            <F label="Transportadora" k="transportadora" testid="form-transportadora" />
            <F label="Nome do destinatário" k="destinatario_nome" testid="form-destinatario" />
            <F label="Telefone do destinatário" k="destinatario_telefone" testid="form-telefone" />
            <F label="Cidade de origem" k="origem_cidade" testid="form-origem-cidade" />
            <F label="Estado de origem" k="origem_estado" testid="form-origem-estado" />
            <F label="Cidade de destino" k="destino_cidade" testid="form-destino-cidade" />
            <F label="Estado de destino" k="destino_estado" testid="form-destino-estado" />
            <F label="Data de coleta" k="data_coleta" type="date" testid="form-data-coleta" />
            <F label="Previsão de entrega" k="previsao_entrega" type="date" testid="form-previsao" />
            <div>
              <label className="label-caps text-zinc-400">Status atual</label>
              <select
                className={`mt-2 ${inputCls}`}
                value={form.status_atual}
                onChange={set("status_atual")}
                data-testid="form-status"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <F label="Localização atual" k="localizacao_atual" testid="form-localizacao" />
          </div>
          <div>
            <label className="label-caps text-zinc-400">Observação</label>
            <textarea
              rows={3}
              className="mt-2 w-full border border-zinc-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2"
              value={form.observacao || ""}
              onChange={set("observacao")}
              data-testid="form-observacao"
            />
          </div>

          {error && (
            <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700" data-testid="form-error">{error}</p>
          )}

          <DialogFooter className="gap-3">
            <button
              type="button"
              onClick={onClose}
              data-testid="form-cancel"
              className="h-12 border border-zinc-300 px-6 text-sm font-semibold uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              data-testid="form-submit"
              className="h-12 bg-[#FF5A00] px-8 font-display font-bold uppercase tracking-wider text-white transition-colors duration-200 hover:bg-[#E04F00] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar entrega"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const MovimentacaoDialog = ({ open, onClose, onSubmit, entrega }) => {
  const [form, setForm] = useState({ status: STATUSES[0], local: "", observacao: "", previsao_entrega: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && entrega) {
      setError("");
      setForm({
        status: entrega.status_atual || STATUSES[0],
        local: entrega.localizacao_atual || "",
        observacao: "",
        previsao_entrega: entrega.previsao_entrega || "",
      });
    }
  }, [open, entrega]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.local.trim()) {
      setError("Informe a cidade/local da movimentação.");
      return;
    }
    setSaving(true);
    const res = await onSubmit(form);
    setSaving(false);
    if (!res?.ok) setError(res?.error || "Erro ao salvar.");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl rounded-sm" data-testid="movimentacao-dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-black tracking-tight">Atualizar status</DialogTitle>
        </DialogHeader>
        <p className="font-mono text-sm text-zinc-500">{entrega?.codigo}</p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="label-caps text-zinc-400">Novo status</label>
            <select
              className={`mt-2 ${inputCls}`}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              data-testid="mov-status"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-caps text-zinc-400">Cidade / local</label>
            <input
              className={`mt-2 ${inputCls}`}
              value={form.local}
              onChange={(e) => setForm({ ...form, local: e.target.value })}
              data-testid="mov-local"
              placeholder="São Paulo - SP"
            />
          </div>
          <div>
            <label className="label-caps text-zinc-400">Previsão de entrega</label>
            <input
              type="date"
              className={`mt-2 ${inputCls}`}
              value={form.previsao_entrega || ""}
              onChange={(e) => setForm({ ...form, previsao_entrega: e.target.value })}
              data-testid="mov-previsao"
            />
          </div>
          <div>
            <label className="label-caps text-zinc-400">Observação</label>
            <textarea
              rows={3}
              className="mt-2 w-full border border-zinc-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2"
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              data-testid="mov-observacao"
              placeholder="Mercadoria encaminhada para a unidade de destino."
            />
          </div>

          {error && <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700" data-testid="mov-error">{error}</p>}

          <DialogFooter className="gap-3">
            <button type="button" onClick={onClose} data-testid="mov-cancel" className="h-12 border border-zinc-300 px-6 text-sm font-semibold uppercase tracking-wider">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              data-testid="mov-submit"
              className="h-12 bg-[#FF5A00] px-8 font-display font-bold uppercase tracking-wider text-white hover:bg-[#E04F00] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Adicionar movimentação"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
