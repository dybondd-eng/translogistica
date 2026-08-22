import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Boxes, Route, Users, TrendingUp } from "lucide-react";

const IMG = "https://images.unsplash.com/photo-1627309366653-2dedc084cdf1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MHx8fHwxNzg3MzczMTc0fDA&ixlib=rb-4.1.0&q=85";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-20">
        <p className="label-caps text-[#FF5A00]">Sobre Nós</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[1] tracking-tight sm:text-5xl lg:text-6xl">
          Logística construída sobre prazo, cuidado e informação.
        </h1>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="space-y-6 text-base leading-relaxed text-zinc-600">
            <p>
              A <strong className="text-zinc-950">TransLog</strong> é uma transportadora especializada em cargas
              fracionadas e dedicadas, com operação rodoviária integrada e unidades estratégicas nas principais
              rotas do país.
            </p>
            <p>
              Nosso compromisso é simples: cada carga tem um responsável, um prazo e um histórico completo de
              movimentações disponível ao cliente a qualquer momento, direto do nosso portal de rastreamento.
            </p>
            <p>
              Trabalhamos com equipes próprias de coleta e entrega, frota monitorada e processos auditados, o que
              garante previsibilidade para indústrias, distribuidores e e-commerces de todos os portes.
            </p>
            <div className="grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
              {[
                { icon: Boxes, t: "+120 mil", d: "entregas realizadas" },
                { icon: Route, t: "26 estados", d: "atendidos" },
                { icon: Users, t: "480", d: "colaboradores" },
                { icon: TrendingUp, t: "98,4%", d: "entregas no prazo" },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="bg-white p-6">
                  <Icon size={22} className="text-[#FF5A00]" />
                  <p className="mt-4 font-display text-2xl font-black tracking-tight">{t}</p>
                  <p className="text-sm text-zinc-500">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={IMG} alt="Centro de distribuição TransLog" className="h-full max-h-[80vh] w-full object-cover md:max-h-none" />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
