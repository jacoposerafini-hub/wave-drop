'use client';

import { useState, useTransition } from 'react';
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
      <p className="flex items-center gap-2 text-sm text-accent">
        ✓ Sei nel loop. Ci sentiamo al prossimo drop.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-0">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="la-tua@email.com"
        className="input flex-1"
        disabled={pending}
      />
      <button type="submit" className="btn-primary px-5" disabled={pending}>
        {pending ? '...' : 'Sign up'}
      </button>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </form>
  );
}
