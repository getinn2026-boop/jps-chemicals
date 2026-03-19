import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const search = searchParams.get("q");

  try {
    if (clientId) {
      // Fetch products specific to this client (Option B workflow)
      const clientProducts = await prisma.clientProduct.findMany({
        where: {
          clientId,
          isActive: true,
          masterProduct: search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { sku: { contains: search, mode: "insensitive" } },
                  { casNumber: { contains: search, mode: "insensitive" } },
                ],
              }
            : undefined,
        },
        include: {
          masterProduct: true,
        },
      });

      // Format them nicely for the frontend
      const formattedProducts = clientProducts.map((cp) => ({
        id: cp.id,
        masterProductId: cp.masterProductId,
        name: cp.masterProduct.name,
        sku: cp.masterProduct.sku,
        casNumber: cp.masterProduct.casNumber,
        grade: cp.masterProduct.grade,
        unit: cp.masterProduct.unit,
        price: cp.negotiatedPrice, // The special client price
        currency: cp.masterProduct.currency,
      }));

      return NextResponse.json(formattedProducts);
    } else {
      // Fetch global master catalog
      const masterProducts = await prisma.masterProduct.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { casNumber: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        take: 50,
      });

      return NextResponse.json(masterProducts);
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
