import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.variant.deleteMany();
  await db.product.deleteMany();
  await db.notifySignup.deleteMany();
  await db.drop.deleteMany();

  const drop = await db.drop.create({
    data: {
      slug: 'drop-01-midnight',
      name: 'DROP 01 — MIDNIGHT',
      tagline: 'La prima collezione. Nata in una notte al Foro Boario.',
      description:
        'Capsule di 3 pezzi ispirati al mondo notturno di Lucca. Tessuti heavyweight, grafica minima, stampa serigrafica a mano. 150 pezzi totali, mai più.',
      heroImage: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=2000',
      status: 'live',
      accessType: 'public',
      startsAt: new Date(),
      featured: true,
      products: {
        create: [
          {
            slug: 'felpa-midnight',
            name: 'Felpa Midnight',
            description:
              'Felpa oversize in cotone heavyweight 400gsm. Logo Wave ricamato al petto, grafica posteriore in serigrafia. Tinta nera con riflessi blu notte.',
            priceCents: 8900,
            composition: '100% cotone organico, 400gsm',
            fit: 'Oversize. Ordina la tua taglia abituale.',
            images: [
              'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
              'https://images.unsplash.com/photo-1556821840-3a9fbcbd8bd7?w=1200',
            ],
            position: 1,
            variants: {
              create: [
                { size: 'S', stock: 12 },
                { size: 'M', stock: 15 },
                { size: 'L', stock: 14 },
                { size: 'XL', stock: 8 },
                { size: 'XXL', stock: 3 },
              ],
            },
          },
          {
            slug: 'tshirt-wave',
            name: 'T-Shirt Wave',
            description:
              'T-shirt boxy in jersey pesante 240gsm. Stampa Wave fronte-retro in serigrafia a caldo. Unisex.',
            priceCents: 3900,
            composition: '100% cotone, 240gsm',
            fit: 'Boxy. Scendi di una taglia per fit più aderente.',
            images: [
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
              'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200',
            ],
            position: 2,
            variants: {
              create: [
                { size: 'S', stock: 18 },
                { size: 'M', stock: 22 },
                { size: 'L', stock: 20 },
                { size: 'XL', stock: 14 },
                { size: 'XXL', stock: 6 },
              ],
            },
          },
          {
            slug: 'cappello-wave',
            name: 'Cappello Wave',
            description:
              'Cappello 6 pannelli in twill. Logo Wave ricamato 3D. Chiusura in metallo.',
            priceCents: 2900,
            composition: '100% cotone twill',
            fit: 'Regolabile. Taglia unica.',
            images: [
              'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200',
            ],
            position: 3,
            variants: {
              create: [{ size: 'ONE SIZE', stock: 40 }],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded drop:', drop.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
