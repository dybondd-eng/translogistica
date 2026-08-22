import { motion } from "framer-motion";
import { Check, PackageCheck, Warehouse, Truck, Building2, PackageSearch, Package } from "lucide-react";

const icons = [Package, PackageSearch, Truck, Building2, Warehouse, PackageCheck];

export const Timeline = ({ etapas, atual }) => (
  <div className="relative pl-2" data-testid="tracking-timeline">
    {etapas.map((etapa, i) => {
      const done = i < atual;
      const active = i === atual;
      const Icon = icons[i] || Package;
      return (
        <motion.div
          key={etapa}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="relative flex gap-5 pb-8 last:pb-0"
          data-testid={`timeline-step-${i}`}
        >
          {i < etapas.length - 1 && (
            <span
              className={`absolute left-[19px] top-10 h-full w-[2px] ${
                done ? "bg-[#FF5A00]" : "bg-zinc-200"
              }`}
            />
          )}
          <span
            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border ${
              active
                ? "border-[#FF5A00] bg-[#FF5A00] text-white pulse-ring"
                : done
                ? "border-[#FF5A00] bg-[#FF5A00]/10 text-[#FF5A00]"
                : "border-zinc-200 bg-white text-zinc-300"
            }`}
          >
            {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
          </span>
          <div className="pt-1">
            <p
              className={`font-display text-base font-bold tracking-tight ${
                active ? "text-[#FF5A00]" : done ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              {etapa}
            </p>
            {active && <p className="mt-1 text-sm text-zinc-500">Etapa atual da sua entrega</p>}
          </div>
        </motion.div>
      );
    })}
  </div>
);
