import { prisma } from "@/server/db";

function padNumber(value: number, length: number) {
  return value.toString().padStart(length, "0");
}

export async function nextQuoteNumber() {
  const seq = await prisma.sequence.upsert({
    where: { key: "quote" },
    create: { key: "quote", value: 1 },
    update: { value: { increment: 1 } },
  });

  return `Q-${padNumber(seq.value, 6)}`;
}

export async function nextOrderNumber() {
  const seq = await prisma.sequence.upsert({
    where: { key: "order" },
    create: { key: "order", value: 1 },
    update: { value: { increment: 1 } },
  });

  return `O-${padNumber(seq.value, 6)}`;
}

