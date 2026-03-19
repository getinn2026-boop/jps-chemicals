import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

// Add a product to a client's catalog
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params;
    const body = await request.json();
    const { masterProductId, negotiatedPrice } = body;

    if (!masterProductId || negotiatedPrice === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upsert so if it already exists, we just update the price
    const clientProduct = await prisma.clientProduct.upsert({
      where: {
        clientId_masterProductId: {
          clientId,
          masterProductId,
        },
      },
      update: {
        negotiatedPrice,
      },
      create: {
        clientId,
        masterProductId,
        negotiatedPrice,
      },
      include: {
        masterProduct: true,
      },
    });

    // Record the activity
    await prisma.activity.create({
      data: {
        clientId,
        type: "CATALOG_UPDATE",
        message: `Added/Updated ${clientProduct.masterProduct.name} in client catalog at ₹${negotiatedPrice}`,
      },
    });

    return NextResponse.json({ success: true, clientProduct });
  } catch (error) {
    console.error("Failed to add client product:", error);
    return NextResponse.json(
      { error: "Failed to add client product" },
      { status: 500 }
    );
  }
}

// Remove a product from a client's catalog
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const clientProductId = searchParams.get("id");

    if (!clientProductId) {
      return NextResponse.json(
        { error: "Missing product ID" },
        { status: 400 }
      );
    }

    const clientProduct = await prisma.clientProduct.delete({
      where: { id: clientProductId },
      include: { masterProduct: true },
    });

    // Record the activity
    await prisma.activity.create({
      data: {
        clientId: clientProduct.clientId,
        type: "CATALOG_UPDATE",
        message: `Removed ${clientProduct.masterProduct.name} from client catalog`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete client product:", error);
    return NextResponse.json(
      { error: "Failed to delete client product" },
      { status: 500 }
    );
  }
}
