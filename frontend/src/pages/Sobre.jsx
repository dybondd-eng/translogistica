import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Boxes, Route, Users, TrendingUp } from "lucide-react";

const IMG = "https://images.unsplash.com/photo-1627309366653-2dedc084cdf1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MHx8fHwxNzg3MzczMTc0fDA&ixlib=rb-4.1.0&q=85";
const MAPA = "https://static.prod-images.emergentagent.com/jobs/1628a03f-f17f-475b-8e98-a5d3048fdfd3/images/784eb6ccaac0447e59dc6324aa80ddfb01f43b02e41749391e44be4c12b80e6b.jpeg";

const PARCEIROS = [
  {
    nome: "Braspress",
    tipo: "Carga fracionada",
    cor: "#C8102E",
    logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/yqrs3e66_images%20%284%29.png",
  },
  {
    nome: "Jamef",
    tipo: "Rodoviário",
    cor: "#0057B8",
    logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/8vxo50nc_images%20%281%29.png",
  },
  {
    nome: "RTE Rodonaves",
    tipo: "Rodoviário",
    cor: "#E4002B",
    logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/f8qj8o3h_images%20%283%29.png",
  },
  {
    nome: "Jadlog",
    tipo: "Encomendas",
    cor: "#E30613",
    logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/5dnqekt6_jadlog-logo-png_seeklogo-502850.png",
  },
  {
    nome: "Total Express",
    tipo: "E-commerce",
    cor: "#0B3C8C",
    logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/aiddtt8g_images%20%286%29.jpeg",
  },
  {
    nome: "J&T Express",
    tipo: "Encomendas",
    cor: "#D6001C",
    logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/dq6ewzk7_logo_null_qDwL70.jpg",
  },
  {
    nome: "Loggi",
    tipo: "Última milha",
    cor: "#00A5E0",
    logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/4q82rt7d_163acbc128e90ee023caf8481274c10a6d6f1d58.png",
  },
  { nome: "Patrus Transportes", tipo: "Rodoviário", cor: "#0C6C3D", logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/tsmygj0f_NOVA-LOGO-PATRUS.webp" },
  { nome: "Alfa Transportes", tipo: "Rodoviário", cor: "#1B3A6B", logo: "https://customer-assets-wrfwihn1.emergentagent.net/job_cargo-monitor-76/artifacts/ghl2vm7c_images%20%282%29.png" },
];

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
              A <strong className="text-zinc-950">TransLogistica</strong> é uma transportadora especializada em cargas
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
            <img src={IMG} alt="Centro de distribuição TransLogistica" className="h-full max-h-[80vh] w-full object-cover md:max-h-none" />
          </div>
        </div>

        <section className="mt-20 md:mt-28" data-testid="cobertura-nacional">
          <div className="grid gap-px border border-zinc-200 bg-zinc-200 lg:grid-cols-[1fr_1.15fr]">
            <div className="flex items-center justify-center bg-white p-8 md:p-12">
              <img
                src={MAPA}
                alt="Mapa do Brasil com a cobertura de entregas da TransLogistica"
                className="w-full max-w-md object-contain"
                data-testid="mapa-brasil"
              />
            </div>
            <div className="bg-white p-8 md:p-12">
              <p className="label-caps text-[#FF5A00]">Cobertura nacional</p>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight md:text-4xl">
                Atendemos todas as cidades do Brasil.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-600">
                Não importa o destino: da capital ao interior, entregamos em todo o território nacional. Isso é
                possível porque trabalhamos <strong className="text-zinc-950">em parceria com as melhores
                transportadoras do Brasil</strong>, combinando a malha de cada uma para garantir o melhor prazo e o
                melhor custo para a sua carga.
              </p>

              <p className="mt-10 label-caps text-zinc-400">Nossos parceiros</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid="parceiros-list">
                {PARCEIROS.map((p) => (
                  <div
                    key={p.nome}
                    data-testid={`parceiro-${p.nome.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="flex h-24 flex-col items-center justify-center border border-zinc-200 bg-white px-4 text-center transition-all duration-200 hover:-translate-y-[2px] hover:border-zinc-900"
                  >
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={`Logo ${p.nome}`}
                        title={p.nome}
                        className="max-h-16 w-full object-contain"
                      />
                    ) : (
                      <>
                        <span className="font-display text-base font-black leading-none tracking-tight" style={{ color: p.cor }}>
                          {p.nome}
                        </span>
                        <span className="mt-1.5 text-[10px] uppercase tracking-[0.15em] text-zinc-400">{p.tipo}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-zinc-400">
                Marcas citadas pertencem às respectivas empresas parceiras.
              </p>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
