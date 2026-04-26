import Link from 'next/link';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';

export const metadata = { title: 'Account' };

export default function AccountPage() {
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
            <Link
              href="/account/recover"
              style={{ fontSize: 13, color: 'var(--fg-dim)', textAlign: 'center' }}
            >
              Password dimenticata?
            </Link>
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
