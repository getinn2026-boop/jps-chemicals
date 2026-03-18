import { prisma } from "@/server/db";
import NewQuotePageClient from "./NewQuotePageClient";

export const dynamic = 'force-dynamic';

export default async function NewQuotePage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return <NewQuotePageClient clients={clients as any} />;
}