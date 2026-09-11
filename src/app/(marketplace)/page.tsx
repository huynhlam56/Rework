import { listActiveListings } from "@/lib/services/listings";
import { ListingCard } from "@/components/listing-card";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const listings = await listActiveListings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Browse listings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {listings.length} item{listings.length === 1 ? "" : "s"}
        </p>
      </div>

      {listings.length === 0 ? (
        <EmptyState title="No listings yet" description="Check back soon." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="listing-grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
