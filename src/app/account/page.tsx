import Link from 'next/link';
import { ArrowRight, Mail, Lock, User, LogOut } from 'lucide-react';
import { getCurrentUser } from '@/lib/user-auth';

export const metadata = { title: 'Account' };

const ERRORS: Record<string, string> = {
  invalid: 'Compila tutti i campi (password min. 8).',
  invalid_email: 'Email non valida.',
  email_taken: 'Email già registrata. Accedi.',
  bad_credentials: 'Email o password errati.',
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const user = await getCurrentUser();
  const error = searchParams?.error ? ERRORS[searchParams.error] : null;

  if (user) {
    return (
      <main className="page-enter container">
        <div className="page__lead">
          <div className="eyebrow" style={{ marginBottom: 20 }}>
            Account
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(72px, 12vw, 160px)' }}>
            Ciao, <span className="italic">{user.name}.</span>
          </h1>
          <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
            Sei dentro. Da qui vedi i tuoi ordini e gestisci il profilo.
          </p>
        </div>

        <div className="account-grid" style={{ gridTemplateColumns: '1fr' }}>
          <section className="account-card">
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Profilo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              <div style={{ color: 'var(--fg-dim)', fontSize: 13 }}>
                Nome
                <div style={{ color: 'var(--fg)', fontSize: 16, marginTop: 4 }}>
                  {user.name}
                </div>
              </div>
              <div style={{ color: 'var(--fg-dim)', fontSize: 13, marginTop: 12 }}>
                Email
                <div style={{ color: 'var(--fg)', fontSize: 16, marginTop: 4 }}>
                  {user.email}
                </div>
              </div>
            </div>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="btn ghost">
                <LogOut size={16} /> Esci
              </button>
            </form>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter container">
      <div className="page__lead">
        <div className="eyebrow" style={{ marginBottom: 20 }}>
          Account
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(72px, 12vw, 160px)' }}>
          Il tuo <span className="italic">account.</span>
        </h1>
        <p style={{ color: 'var(--fg-dim)', marginTop: 20, maxWidth: 520 }}>
          Accedi per vedere ordini, tracking e drop privati. Oppure crea un
          account in 30 secondi.
        </p>
        {error && (
          <div
            style={{
              marginTop: 24,
              padding: '12px 16px',
              borderRadius: 'var(--r-pill)',
              background: 'rgba(255,80,80,0.08)',
              border: '1px solid rgba(255,80,80,0.25)',
              color: '#ff8080',
              fontSize: 13,
              maxWidth: 520,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div className="account-grid">
        <section className="account-card">
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Accedi
          </div>
          <h3 style={{ fontSize: 28, marginBottom: 18 }}>Bentornato.</h3>
          <form className="account-form" action="/api/auth/login" method="post">
            <label className="account-field">
              <Mail size={16} />
              <input
                type="email"
                name="email"
                placeholder="email@esempio.it"
                required
              />
            </label>
            <label className="account-field">
              <Lock size={16} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </label>
            <button type="submit" className="btn primary" style={{ width: '100%' }}>
              Entra <ArrowRight size={16} />
            </button>
          </form>
        </section>

        <section className="account-card">
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Registrati
          </div>
          <h3 style={{ fontSize: 28, marginBottom: 18 }}>Crea account.</h3>
          <form
            className="account-form"
            action="/api/auth/register"
            method="post"
          >
            <label className="account-field">
              <User size={16} />
              <input type="text" name="name" placeholder="Nome" required />
            </label>
            <label className="account-field">
              <Mail size={16} />
              <input
                type="email"
                name="email"
                placeholder="email@esempio.it"
                required
              />
            </label>
            <label className="account-field">
              <Lock size={16} />
              <input
                type="password"
                name="password"
                placeholder="Password (min. 8)"
                minLength={8}
                required
              />
            </label>
            <button type="submit" className="btn primary" style={{ width: '100%' }}>
              Registrati <ArrowRight size={16} />
            </button>
            <p style={{ fontSize: 12, color: 'var(--fg-mute)', textAlign: 'center' }}>
              Continuando accetti i nostri{' '}
              <Link href="/terms" style={{ textDecoration: 'underline' }}>
                Termini
              </Link>{' '}
              e la{' '}
              <Link href="/privacy" style={{ textDecoration: 'underline' }}>
                Privacy
              </Link>
              .
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
