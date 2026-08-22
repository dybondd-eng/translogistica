import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const IMG = "https://images.pexels.com/photos/8867417/pexels-photo-8867417.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function Contato() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      toast.error("Preencha todos os campos para enviar sua mensagem.");
      return;
    }
    toast.success("Mensagem registrada! Nosso time responderá em até 1 dia útil.");
    setForm({ nome: "", email: "", mensagem: "" });
  };

  const input = "h-14 w-full border border-zinc-300 bg-white px-4 outline-none focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2";

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-20">
        <p className="label-caps text-[#FF5A00]">Contato</p>
        <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">Fale com a TransLog</h1>

        <div className="mt-12 grid gap-px bg-zinc-200 lg:grid-cols-2">
          <div className="bg-white p-8 md:p-12">
            <form onSubmit={submit} className="space-y-5" data-testid="contato-form">
              <div>
                <label className="label-caps text-zinc-400">Seu nome</label>
                <input
                  className={`mt-2 ${input}`}
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  data-testid="contato-nome"
                />
              </div>
              <div>
                <label className="label-caps text-zinc-400">E-mail</label>
                <input
                  type="email"
                  className={`mt-2 ${input}`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="contato-email"
                />
              </div>
              <div>
                <label className="label-caps text-zinc-400">Mensagem</label>
                <textarea
                  rows={5}
                  className="mt-2 w-full border border-zinc-300 bg-white p-4 outline-none focus:ring-2 focus:ring-[#FF5A00] focus:ring-offset-2"
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  data-testid="contato-mensagem"
                />
              </div>
              <button
                type="submit"
                data-testid="contato-submit"
                className="h-14 w-full bg-[#FF5A00] font-display font-bold uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-[2px] hover:bg-[#E04F00] sm:w-auto sm:px-10"
              >
                Enviar mensagem
              </button>
            </form>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                { icon: Phone, t: "Central de atendimento", d: "(11) 4002-8922" },
                { icon: Mail, t: "E-mail", d: "contato@translog.com.br" },
                { icon: MapPin, t: "Matriz", d: "Av. das Nações, 1200 - São Paulo/SP" },
                { icon: Clock, t: "Horário", d: "Seg a Sex, 08h - 18h" },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t}>
                  <Icon size={20} className="text-[#FF5A00]" />
                  <p className="mt-3 label-caps text-zinc-400">{t}</p>
                  <p className="mt-1 text-sm text-zinc-900">{d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="min-h-[320px] bg-white">
            <img src={IMG} alt="Atendimento TransLog" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
