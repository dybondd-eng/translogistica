import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, AlertTriangle, MapPin, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Timeline } from "@/components/Timeline";
import { api, formatApiErrorDetail, formatDate, formatDateTime } from "@/lib/api";

const Field = ({ label, value, mono }) => (
  <div className="border-t border-zinc-200 py-4">
    <p className="label-caps text-zinc-400">{label}</p>
    <p className={`mt-2 text-base text-zinc-900 ${mono ? "font-mono tracking-wider" : ""}`}>{value || "-"}</p>
  </div>
);

export default function Rastreio() {
  const { codigo: codigoParam } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(codigoParam || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const buscar = useCallback(async (codigo) => {
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await api.get(`/track/${encodeURIComponent(codigo)}`);
      setData(res.data);
    } catch (e) {
      setError(formatApiErrorDetail(e.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (codigoParam) {
      setInput(codigoParam);
      buscar(codigoParam);
    }
  }, [codigoParam, buscar]);

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/rastrear/${input.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
        <p className="label-caps text-[#FF5A00]">Rastreamento</p>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          Acompanhe sua entrega
        </h1>
        <p className="mt-4 max-w-xl text-sm text-zinc-500 md:text-base">
          Digite o código da sua entrega para acompanhar o status do seu pedido.
        </p>

        <form onSubmit={submit} className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row" data-testid="track-page-form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex.: TL2026001BR"
            data-testid="tracking-code-input"
            className="h-16 flex-1 border border-zinc-300 bg-white px-5 font-mono text-lg uppercase tracking-wider outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2"
          />
          <button
            type="submit"
            data-testid="rastrear-button"
            className="flex h-16 items-center justify-center gap-3 bg-[#FF5A00] px-8 font-display font-bold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#E04F00]"
          >
            <Search size={20} /> Rastrear
          </button>
        </form>

        {loading && (
          <div className="mt-10 flex items-center gap-3 text-zinc-500" data-testid="tracking-loading">
            <Loader2 className="animate-spin" size={20} /> Consultando entrega...
          </div>
        )}

        {error && !loading && (
          <div className="mt-10 flex items-start gap-4 border border-red-200 bg-red-50 p-6" data-testid="tracking-error">
            <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={22} />
            <p className="text-sm text-red-700 md:text-base">{error}</p>
          </div>
        )}

        {data && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-12" data-testid="tracking-result">
            <div className="grain relative flex flex-col gap-6 overflow-hidden bg-zinc-950 p-8 md:flex-row md:items-end md:justify-between md:p-10">
              <div>
                <p className="label-caps text-zinc-500">Código da entrega</p>
                <p className="mt-2 font-mono text-2xl tracking-widest text-white md:text-3xl" data-testid="result-codigo">
                  {data.codigo}
                </p>
              </div>
              <div className="md:text-right">
                <p className="label-caps text-zinc-500">Status atual</p>
                <p className="mt-2 font-display text-xl font-black tracking-tight text-[#FF5A00] md:text-2xl" data-testid="result-status">
                  {data.status_atual}
                </p>
              </div>
            </div>

            <div className="grid gap-px bg-zinc-200 md:grid-cols-3">
              <div className="bg-white p-8 md:col-span-1">
                <Field label="Destinatário" value={data.destinatario_nome} />
                <Field label="Cidade de origem" value={data.origem} />
                <Field label="Cidade de destino" value={data.destino} />
                <Field label="Transportadora" value={data.transportadora} />
                <Field label="Previsão de entrega" value={formatDate(data.previsao_entrega)} />
                <Field label="Última atualização" value={formatDateTime(data.ultima_atualizacao)} />
                <Field label="Localização atual" value={data.localizacao_atual} />
                <Field label="Informações adicionais" value={data.observacao} />
              </div>

              <div className="bg-white p-8 md:col-span-2">
                <h2 className="font-display text-lg font-bold tracking-tight">Linha do tempo</h2>
                <div className="mt-8">
                  <Timeline etapas={data.etapas} atual={data.etapa_atual_index} />
                </div>

                <h2 className="mt-12 font-display text-lg font-bold tracking-tight">Histórico de movimentações</h2>
                <div className="mt-6 space-y-px bg-zinc-100" data-testid="movimentacoes-list">
                  {[...data.movimentacoes].reverse().map((m, i) => (
                    <div key={i} className="bg-white p-5" data-testid={`movimentacao-${i}`}>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="font-mono text-sm text-zinc-500">{formatDateTime(m.data_hora)}</span>
                        <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                          <MapPin size={13} className="text-[#FF5A00]" /> {m.local}
                        </span>
                      </div>
                      <p className="mt-2 font-display font-bold tracking-tight text-zinc-900">{m.status}</p>
                      {m.observacao && <p className="mt-1 text-sm text-zinc-500">"{m.observacao}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
