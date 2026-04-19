import { redirect } from 'next/navigation';
import { loginAdmin } from '@/lib/auth';

async function doLogin(formData: FormData) {
  'use server';
  const pw = String(formData.get('password') ?? '');
  const ok = await loginAdmin(pw);
  if (ok) redirect('/admin/drops');
  redirect('/admin/login?error=1');
}

export default function AdminLogin({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <form action={doLogin} className="flex w-full max-w-sm flex-col gap-4">
        <p className="display text-5xl text-center">ADMIN</p>
        <input
          type="password"
          name="password"
          required
          placeholder="password"
          className="input"
          autoFocus
        />
        {searchParams.error && <p className="text-xs text-danger">Password errata</p>}
        <button type="submit" className="btn-primary h-12">Entra</button>
      </form>
    </div>
  );
}
