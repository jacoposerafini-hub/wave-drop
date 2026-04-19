# Wave Drop

E-commerce streetwear per Wave Staff — drop limitati, logica a scarsità, Italian nightlife brand.

## Stack

- Next.js 14 App Router + Server Components + Server Actions
- Prisma + PostgreSQL (Neon consigliato)
- Stripe Checkout (card + Klarna IT)
- Tailwind CSS con design system custom
- Bebas Neue + Inter (next/font)

## Setup locale

```bash
npm install
cp .env.example .env
# compila DATABASE_URL (Neon o Supabase Postgres)
# compila ADMIN_PASSWORD, SESSION_SECRET
# compila Stripe keys (test mode va bene per dev)

npx prisma db push
npm run seed
npm run dev
```

Apri http://localhost:3000

## Rotte pubbliche

- `/` — homepage, mostra il drop live/upcoming
- `/drop/[slug]` — pagina drop (hero + prodotti, in sola lettura se archiviato)
- `/product/[slug]` — pagina prodotto (galleria + sticky panel + add to cart)
- `/archive` — griglia drop passati
- `/cart` — carrello (cookie-based)
- `/orders/[id]` — stato ordine
- `/about`, `/contact` — pagine statiche
- `/api/checkout` — crea Stripe Checkout session (POST)
- `/api/webhook` — riceve `checkout.session.completed` da Stripe

## Admin

Login: `/admin/login` (password in `.env` → `ADMIN_PASSWORD`)

- `/admin/drops` — lista + crea drop
- `/admin/drops/[id]` — edita drop (status, password gate, hero, date)
- `/admin/products` — lista + crea prodotti (appartengono a un drop)
- `/admin/products/[id]` — edita prodotto + gestione varianti/stock
- `/admin/orders` — ordini + cambio status + tracking
- `/admin/analytics` — KPI base (revenue, top prodotti, iscritti)

## Come creare un nuovo drop

1. `/admin/drops` → inserisci nome → "Crea"
2. Imposta status su `upcoming` con `startsAt` futuro → la homepage mostra countdown
3. Vai su `/admin/products` → crea i prodotti associandoli al drop
4. Per ogni prodotto: foto (URL immagini, una per riga), prezzo, descrizione, composizione, taglie con stock
5. Quando pronto → status del drop su `live` → shop aperto
6. Per drop segreti: status=upcoming, accessType=password, imposta password (condividi in storia IG)

## Stripe webhook

Per testare in locale:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copia il `whsec_...` che compare in `STRIPE_WEBHOOK_SECRET`.

In produzione configura l'endpoint su dashboard Stripe → eventi: `checkout.session.completed`.

## Deploy su Vercel

1. Crea progetto su Vercel collegato al repo
2. Aggiungi env vars (tutte quelle in `.env.example`)
3. `NEXT_PUBLIC_SITE_URL` = URL produzione (es. `https://wavedrop.it`)
4. Il comando `build` esegue automaticamente `prisma db push` → schema aggiornato a ogni deploy
5. Dopo il primo deploy, esegui `npm run seed` una volta (o via Vercel Cron / locale contro il DB di prod)

## Design system

- **Palette:** `#050510` bg · `#00A8E8` accent blu · `#FF4FA8` pink
- **Display:** Bebas Neue — sempre in uppercase, tracking 0, grande
- **Body:** Inter 400/500/600
- **Micro:** uppercase tracking widest (`tracking-widest` = `0.15em`)
- **Motion:** 250-400ms easing `cubic-bezier(0.22, 1, 0.36, 1)` (token `ease-smooth`)
- **Componenti Tailwind:** `.btn-primary`, `.btn-pink`, `.btn-ghost`, `.input`, `.card`, `.pill`, `.display`, `.stagger`

## Fuori scopo

- Account cliente (solo order tracking via link email)
- Recensioni, wishlist, multi-lingua, loyalty
- App nativa

## TODO possibili

- Resend per email transazionali (order confirm, shipped)
- Reservation lock in DB (non solo cookie) — passa da cookie-based a server-side quando il volume cresce
- Upload immagini via UploadThing o Cloudinary direct upload
- Lookbook page per drop
- Plausible analytics
- Scaduti cart → restock automatico variant.reserved
