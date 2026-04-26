import { redirect } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
import { loginAdmin } from '@/lib/auth';

export const metadata = { title: 'Admin' };

async function doLogin(formData: FormData) {
  'use server';
  const pw = String(formData.get('password') ?? '');
  const ok = await loginAdmin(pw);
  if (ok) redirect('/admin/drops');
  redirect('/admin/login?error=1');
}

export default function AdminLogin({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="page-enter container">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          padding: '40px 0',
        }}
      >
        <section
          className="account-card"
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Admin · Riservato
          </div>
          <h1
            className="display"
            style={{
              fontSize: 'clamp(40px, 6vw, 56px)',
              marginBottom: 8,
            }}
          >
            Backstage.
          </h1>
          <p
            style={{
              color: 'var(--fg-dim)',
              fontSize: 14,
              marginBottom: 22,
            }}
          >
            Inserisci la password per gestire drop, prodotti e ordini.
          </p>

          <form action={doLogin} className="account-form">
            <label className="account-field">
              <Lock size={16} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                autoFocus
              />
            </label>

            {searchParams.error && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--r-pill)',
                  background: 'rgba(255,80,80,0.08)',
                  border: '1px solid rgba(255,80,80,0.25)',
                  color: '#ff8080',
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                Password errata
              </div>
            )}

            <button
              type="submit"
              className="btn primary"
              style={{ width: '100%' }}
            >
              Entra <ArrowRight size={16} />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
