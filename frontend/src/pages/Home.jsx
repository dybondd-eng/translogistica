import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Clock, Globe2, Truck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const HERO = "https://images.pexels.com/photos/5410923/pexels-photo-5410923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function Home() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    navigate(`/rastrear/${codigo.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <SiteHeader />

      <section className="relative grain overflow-hidden bg-zinc-950">
        <img src={HERO} alt="Caminhão de carga em rodovia" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-32">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="label-caps text-[#FF5A00]">
            Transportes & Logística
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-3xl font-display text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Sua carga sob controle, do embarque à porta.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-6 max-w-xl text-base text-zinc-300 md:text-lg"
          >
            Digite o código da sua entrega para acompanhar o status do seu pedido.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onSubmit={submit}
            className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
            data-testid="hero-track-form"
          >
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex.: TL20260001BR"
              data-testid="tracking-code-input"
              className="h-16 w-full flex-1 border border-white/20 bg-white/95 px-5 font-mono text-lg uppercase tracking-wider text-zinc-950 outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2 focus:ring-offset-zinc-950"
            />
            <button
              type="submit"
              data-testid="rastrear-button"
              className="flex h-16 items-center justify-center gap-3 bg-[#FF5A00] px-8 font-display text-base font-bold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#E04F00]"
            >
              <Search size={20} /> Rastrear entrega
            </button>
          </motion.form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-px border border-zinc-200 bg-zinc-200 md:grid-cols-3">
          {[
            { icon: Clock, t: "Atualização contínua", d: "Cada movimentação da sua carga é registrada e publicada em segundos." },
            { icon: Globe2, t: "Cobertura nacional", d: "Malha rodoviária integrada com unidades nas cinco regiões do país." },
            { icon: ShieldCheck, t: "Carga protegida", d: "Operação monitorada, embalagem certificada e seguro em todo o trajeto." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="bg-white p-8 md:p-10">
              <Icon size={28} className="text-[#FF5A00]" />
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 md:px-10">
        <div className="grain relative flex flex-col items-start gap-6 overflow-hidden bg-zinc-950 p-8 md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            <h2 className="font-display text-2xl font-black tracking-tight text-white md:text-3xl">
              Precisa de um orçamento de frete?
            </h2>
            <p className="mt-3 text-sm text-zinc-400 md:text-base">Fale com nosso time comercial e receba uma proposta no mesmo dia.</p>
          </div>
          <a
            href="/contato"
            data-testid="cta-contato"
            className="flex items-center gap-3 bg-[#FF5A00] px-8 py-4 font-display font-bold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#E04F00]"
          >
            <Truck size={18} /> Falar com a TransLogistica
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
