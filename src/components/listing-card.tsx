import Image from "next/image";
import Link from "next/link";
import { CONDITION_LABELS } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { ListingCondition } from "@/generated/prisma/enums";

export function ListingCard({
  listing,
}: {
  listing: {
    id: string;
    title: string;
    priceCents: number;
    size: string;
    condition: ListingCondition;
    imageUrls: string[];
  };
}) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      data-testid="listing-card"
      className="group block overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        {listing.imageUrls[0] ? (
          <Image
            src={listing.imageUrls[0]}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-medium text-neutral-900">{listing.title}</p>
        <p className="text-sm text-neutral-500">
          Size {listing.size} · {CONDITION_LABELS[listing.condition]}
        </p>
        <p className="text-sm font-semibold text-neutral-900">{formatPrice(listing.priceCents)}</p>
      </div>
    </Link>
  );
}
