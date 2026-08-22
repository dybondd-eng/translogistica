import { Truck, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const SiteFooter = () => (
  <footer className="mt-24 border-t border-zinc-800 bg-zinc-950 text-zinc-400">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 md:px-10">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-[#FF5A00] text-white">
            <Truck size={20} />
          </span>
          <span className="font-display text-lg font-black text-white">
            Trans<span className="text-[#FF5A00]">Log</span>
          </span>
        </div>
        <p className="mt-5 max-w-xs text-sm leading-relaxed">
          Transportes e logística com precisão industrial. Cobertura nacional, rastreamento em tempo real.
        </p>
      </div>
      <div>
        <p className="label-caps text-zinc-500">Contato</p>
        <ul className="mt-5 space-y-3 text-sm">
          <li className="flex items-center gap-3"><Phone size={15} className="text-[#FF5A00]" /> (67) 99208-5655</li>
          <li className="flex items-center gap-3"><Mail size={15} className="text-[#FF5A00]" /> translog67ms@gmail.com</li>
          <li className="flex items-start gap-3"><MapPin size={15} className="mt-1 shrink-0 text-[#FF5A00]" /> R. Danúbio Azul, 88 - Jardim Noroeste, Campo Grande - MS, 79045-232</li>
        </ul>
        <a
          href="https://wa.me/5567992085655"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="footer-whatsapp"
          className="mt-6 inline-flex items-center gap-2 bg-[#25D366] px-5 py-3 label-caps text-zinc-950 transition-all duration-200 hover:-translate-y-[2px]"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>
      <div>
        <p className="label-caps text-zinc-500">Atendimento</p>
        <p className="mt-5 text-sm leading-relaxed">
          Segunda a sexta, 08h às 18h<br />Sábado, 08h às 12h
        </p>
      </div>
    </div>
    <div className="border-t border-zinc-900 px-5 py-6 text-center text-xs md:px-10">
      © {new Date().getFullYear()} TransLog Transportes. Todos os direitos reservados.
    </div>
  </footer>
);
