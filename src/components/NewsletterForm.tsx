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

  return (
    <div>
      <form
        className={'signup' + (done ? ' ok' : '')}
        onSubmit={submit}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="la-tua@email.com"
          disabled={pending}
        />
        <button type="submit" disabled={pending}>
          {pending ? '...' : 'Sblocca accesso'}
        </button>
      </form>
      {error && (
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
