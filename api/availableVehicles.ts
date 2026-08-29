import axios from "@/lib/axios";
import type { Vehicle } from "@/components/general/Cards/SelectVehicleCard";

export interface AvailableVehicle {
  _id: string;
  name: string;
  description: string;
  category: string;
  hourlyRate: number;
  passengerCapacity: number;
  bagsCapacity: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AvailableVehiclesQuery {
  date?: string;
  time?: string;
  passengers?: number;
}

export async function fetchAvailableVehicles(
  query: AvailableVehiclesQuery = {}
): Promise<AvailableVehicle[]> {
  const { data } = await axios.get<AvailableVehicle[]>("/vehicles/available", {
    params: query,
  });
  return data;
}

export function availableVehicleToCard(vehicle: AvailableVehicle): Vehicle {
  return {
    id: vehicle._id,
    name: vehicle.name,
    description: vehicle.description,
    category: vehicle.category,
    passengers: vehicle.passengerCapacity,
    bags: vehicle.bagsCapacity,
    price: vehicle.hourlyRate,
    priceUnit: "Per Hour",
    image: vehicle.imageUrl || "/vehicle1.jpg",
  };
}