import { db } from "@/lib/db";

export function listActiveListings() {
  return db.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });
}

export function getListingById(id: string) {
  return db.listing.findUnique({
    where: { id },
    include: { seller: { select: { id: true, name: true } } },
  });
}
