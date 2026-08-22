import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Timeline } from "@/components/Timeline";
import { STATUSES, formatDate, formatDateTime } from "@/lib/api";
import { MapPin } from "lucide-react";

const Row = ({ label, value }) => (
  <div className="border-t border-zinc-200 py-3">
    <p className="label-caps text-zinc-400">{label}</p>
    <p className="mt-1 text-sm text-zinc-900">{value || "-"}</p>
  </div>
);

export const EntregaViewDialog = ({ open, onClose, entrega }) => {
  if (!entrega) return null;
  const idx = STATUSES.indexOf(entrega.status_atual);
  const movs = [...(entrega.movimentacoes || [])].sort((a, b) => (a.data_hora < b.data_hora ? 1 : -1));
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto rounded-sm" data-testid="entrega-view-dialog">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl tracking-widest">{entrega.codigo}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Row label="Destinatário" value={entrega.destinatario_nome} />
            <Row label="Telefone" value={entrega.destinatario_telefone} />
            <Row label="Origem" value={`${entrega.origem_cidade} - ${entrega.origem_estado}`} />
            <Row label="Destino" value={`${entrega.destino_cidade} - ${entrega.destino_estado}`} />
            <Row label="Data de coleta" value={formatDate(entrega.data_coleta)} />
            <Row label="Previsão de entrega" value={formatDate(entrega.previsao_entrega)} />
            <Row label="Status atual" value={entrega.status_atual} />
            <Row label="Localização atual" value={entrega.localizacao_atual} />
            <Row label="Observação" value={entrega.observacao} />
            <Row label="Última atualização" value={formatDateTime(entrega.atualizado_em)} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold tracking-tight">Linha do tempo</h3>
            <div className="mt-5">
              <Timeline etapas={STATUSES} atual={idx < 0 ? 0 : idx} />
            </div>
            <h3 className="mt-8 font-display text-base font-bold tracking-tight">Movimentações</h3>
            <div className="mt-4 space-y-3">
              {movs.map((m, i) => (
                <div key={i} className="border border-zinc-200 p-4">
                  <p className="font-mono text-xs text-zinc-500">{formatDateTime(m.data_hora)}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                    <MapPin size={12} className="text-[#FF5A00]" /> {m.local}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{m.status}</p>
                  {m.observacao && <p className="mt-1 text-xs text-zinc-500">"{m.observacao}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
