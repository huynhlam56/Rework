import type { ListingCondition } from "@/generated/prisma/enums";

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  NEW_WITH_TAGS: "New with tags",
  LIKE_NEW: "Like new",
  GOOD: "Good",
  FAIR: "Fair",
};
