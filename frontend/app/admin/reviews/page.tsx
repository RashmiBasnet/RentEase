import { handleGetAllReviews } from "@/lib/actions/review-action";
import { ReviewsManager } from "./_components/ReviewsManager";

export default async function AdminReviewsPage() {
  const res = await handleGetAllReviews();
  const reviews: any[] = res.data?.reviews ?? [];

  return <ReviewsManager reviews={reviews} />;
}
