import Image from "next/image";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/services/listings";
import { CONDITION_LABELS } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="grid gap-8 md:grid-cols-2" data-testid="listing-detail">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-100">
        {listing.imageUrls[0] ? (
          <Image
            src={listing.imageUrls[0]}
            alt={listing.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : null}
      </div>

      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900" data-testid="listing-title">
            {listing.title}
          </h1>
          <p className="mt-1 text-xl font-semibold text-neutral-900" data-testid="listing-price">
            {formatPrice(listing.priceCents)}
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">Size</dt>
            <dd className="font-medium text-neutral-900">{listing.size}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Condition</dt>
            <dd className="font-medium text-neutral-900">{CONDITION_LABELS[listing.condition]}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Category</dt>
            <dd className="font-medium text-neutral-900">{listing.category}</dd>
          </div>
        </dl>

        <p className="whitespace-pre-line text-sm text-neutral-700">{listing.description}</p>

        <p className="text-sm text-neutral-500">
          Sold by <span className="font-medium text-neutral-900">{listing.seller.name}</span>
        </p>
      </div>
    </div>
  );
}
