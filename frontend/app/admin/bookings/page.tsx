import { handleGetAllBookings } from "@/lib/actions/booking-action";
import { BookingsManager } from "./_components/BookingsManager";

export default async function AdminBookingsPage() {
  const res = await handleGetAllBookings({ size: 100 });
  const bookings: any[] = res.data?.bookings ?? [];

  return <BookingsManager bookings={bookings} />;
}
