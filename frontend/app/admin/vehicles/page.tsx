import { handleGetAllVehicles } from "@/lib/actions/vehicle-action";
import { VehiclesManager } from "./_components/VehiclesManager";

export default async function AdminVehiclesPage() {
  const res = await handleGetAllVehicles({ size: 100 });
  const vehicles: any[] = res.data?.vehicles ?? [];

  return <VehiclesManager vehicles={vehicles} />;
}
