import { Instagram, MessageCircle, Mail } from 'lucide-react';

export const metadata = { title: 'Contatti' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-20 md:py-32">
      <p className="pill text-muted">Contact</p>
      <h1 className="display mt-4 text-[14vw] md:text-[10vw] leading-[0.9]">
        PARLACI.
      </h1>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <a href="https://wa.me/393000000000" target="_blank" rel="noreferrer" className="card p-8 hover:border-accent/40 transition-colors group">
          <MessageCircle size={28} className="text-accent transition-transform group-hover:scale-110" />
          <p className="display mt-6 text-3xl">WHATSAPP</p>
          <p className="mt-2 text-sm text-muted">La via più veloce. Risposta in giornata.</p>
        </a>
        <a href="https://instagram.com/wavestaff" target="_blank" rel="noreferrer" className="card p-8 hover:border-accent/40 transition-colors group">
          <Instagram size={28} className="text-accent transition-transform group-hover:scale-110" />
          <p className="display mt-6 text-3xl">INSTAGRAM</p>
          <p className="mt-2 text-sm text-muted">DM aperti. Le storie di ogni drop.</p>
        </a>
        <a href="mailto:ciao@wavestaff.it" className="card p-8 hover:border-accent/40 transition-colors group">
          <Mail size={28} className="text-accent transition-transform group-hover:scale-110" />
          <p className="display mt-6 text-3xl">EMAIL</p>
          <p className="mt-2 text-sm text-muted break-all">ciao@wavestaff.it</p>
        </a>
      </div>
    </div>
  );
}
