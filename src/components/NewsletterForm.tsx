'use client';

import { useState, useTransition } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { notifySignup } from '@/app/actions';

export default function NewsletterForm({ dropId }: { dropId?: string }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await notifySignup(email, dropId);
      if (res.ok) {
        setDone(true);
        setEmail('');
      } else {
        setError(res.error);
      }
    });
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 border border-success/30 bg-success/5 px-4 py-3 text-sm text-success animate-fade-in">
        <Check size={16} strokeWidth={2.5} />
        Sei nel loop. Ci sentiamo al prossimo drop.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={submit} className="flex">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="la-tua@email.com"
          className="input flex-1 border-r-0"
          disabled={pending}
        />
        <button
          type="submit"
          className="btn-primary px-5"
          disabled={pending}
          aria-label="Iscriviti"
        >
          {pending ? '...' : <ArrowRight size={16} strokeWidth={2.5} />}
        </button>
      </form>
      {error && <p className="text-xs text-danger animate-fade-in">{error}</p>}
    </div>
  );
}
