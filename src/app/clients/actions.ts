"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";

export async function createClient(formData: FormData) {
  const name = (formData.get("name") ?? "").toString().trim();
  const companyName = (formData.get("companyName") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const address = (formData.get("address") ?? "").toString().trim();
  const gstin = (formData.get("gstin") ?? "").toString().trim();

  if (!name) {
    return;
  }

  const client = await prisma.client.create({
    data: {
      name,
      companyName: companyName || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      gstin: gstin || null,
      activities: {
        create: {
          type: "CLIENT_CREATED",
          message: "Client record created",
        },
      },
    },
  });

  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

