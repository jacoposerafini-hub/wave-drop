import { Instagram, MessageCircle, Mail, ArrowUpRight } from 'lucide-react';

export const metadata = { title: 'Contatti' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-32">
      <div className="stagger flex flex-col gap-4">
        <p className="eyebrow">Contact</p>
        <h1 className="display text-[14vw] leading-[0.9] md:text-[10vw]">
          PARLACI.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
          Ordini, collaborazioni, stampa, o solo per dire ciao. Scegli il canale
          e scrivici.
        </p>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3 md:gap-6">
        <ContactCard
          href="https://wa.me/393000000000"
          icon={<MessageCircle size={24} />}
          label="WhatsApp"
          desc="La via più veloce. Risposta in giornata."
          meta="Risp. media · 2h"
        />
        <ContactCard
          href="https://instagram.com/wavestaff"
          icon={<Instagram size={24} />}
          label="Instagram"
          desc="DM aperti. Le storie di ogni drop."
          meta="@wavestaff"
        />
        <ContactCard
          href="mailto:ciao@wavestaff.it"
          icon={<Mail size={24} />}
          label="Email"
          desc="Per tutto il resto."
          meta="ciao@wavestaff.it"
        />
      </div>

      <div className="mt-20 grid gap-8 border-t border-border pt-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">Sede</p>
          <p className="display text-3xl">Lucca, IT</p>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">P.IVA</p>
          <p className="text-sm font-mono">00000000000</p>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">Orari risposta</p>
          <p className="text-sm text-muted">
            Lun–Ven · 10–19<br />
            Weekend · dopo i drop
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  href,
  icon,
  label,
  desc,
  meta,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  meta: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="group relative card-hover flex flex-col gap-6 p-8"
    >
      <div className="flex items-start justify-between">
        <span className="text-accent transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <ArrowUpRight
          size={18}
          className="text-subtle transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>
      <div>
        <p className="display text-3xl">{label}</p>
        <p className="mt-2 text-sm text-muted">{desc}</p>
      </div>
      <p className="mt-auto break-all font-mono text-[11px] uppercase tracking-widest text-subtle">
        {meta}
      </p>
    </a>
  );
}
