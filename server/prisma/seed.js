import prisma from "./client.js";

async function main() {
  await prisma.comment.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.author.deleteMany();

  const ada = await prisma.author.create({
    data: { name: "Ada", avatarUrl: "/avatars/ada.svg" },
  });
  const linus = await prisma.author.create({
    data: { name: "Linus", avatarUrl: "/avatars/linus.svg" },
  });
  const grace = await prisma.author.create({
    data: { name: "Grace", avatarUrl: "/avatars/grace.svg" },
  });

  const t1 = await prisma.thread.create({
    data: { title: "Deploy day", body: "Production ship went smoothly.", authorId: ada.id },
  });
  const t2 = await prisma.thread.create({
    data: { title: "Cache warm-up", body: "Prime expensive queries before launch.", authorId: linus.id },
  });
  const t3 = await prisma.thread.create({
    data: { title: "Schema review", body: "Check relation names before coding UI.", authorId: grace.id },
  });
  const t4 = await prisma.thread.create({
    data: { title: "Ghost thread", body: "This seeded row has no author for null-guard testing.", authorId: null },
  });
  const t5 = await prisma.thread.create({
    data: { title: "Anonymous bug report", body: "Another null author row to prove the UI stays stable.", authorId: null },
  });
  const t6 = await prisma.thread.create({
    data: { title: "Mystery roadmap", body: "One more author-less thread for fallback display.", authorId: null },
  });

  await prisma.comment.createMany({
    data: [
      { body: "Nice rollout", threadId: t1.id },
      { body: "Watching metrics", threadId: t1.id },
      { body: "Preload worked", threadId: t2.id },
      { body: "Ship faster", threadId: t2.id },
      { body: "Keep schema tidy", threadId: t3.id },
      { body: "Null guards matter", threadId: t4.id },
      { body: "Count me too", threadId: t4.id },
      { body: "Anonymous but valid", threadId: t5.id },
    ],
  });

  console.log("✅ Seeded authors, threads, and comments");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
