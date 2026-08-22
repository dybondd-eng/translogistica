import { MessageCircle } from "lucide-react";

export const WhatsAppFloat = () => (
  <a
    href="https://wa.me/5567992085655"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar no WhatsApp"
    data-testid="whatsapp-float"
    className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-zinc-950 shadow-lg shadow-black/25 transition-transform duration-200 hover:-translate-y-[3px] sm:h-16 sm:w-16"
  >
    <MessageCircle size={28} strokeWidth={2.2} />
  </a>
);
