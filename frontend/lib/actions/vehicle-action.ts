"use server";

import {
    createVehicle,
    deleteVehicle,
    getAllVehicles,
    getVehicleById,
    getVehiclesNear,
    toggleVehicleAvailability,
    toggleVehicleVerification,
    updateVehicle,
    type UpdateVehiclePayload,
    type VehicleWritePayload,
    type VehicleFilterParams,
    type VehicleNearParams,
} from "../api/vehicle/vehicle";

export const handleGetAllVehicles = async (params?: VehicleFilterParams) => {
    try {
        const result = await getAllVehicles(params);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Vehicles fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch vehicles" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch vehicles" };
    }
}

export const handleGetVehiclesNear = async (params: VehicleNearParams) => {
    try {
        const result = await getVehiclesNear(params);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Nearby vehicles fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch nearby vehicles" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch nearby vehicles" };
    }
}

export const handleGetVehicleById = async (id: string) => {
    try {
        const result = await getVehicleById(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Vehicle fetched" };
        }
        return { success: false, message: result.message || "Failed to fetch vehicle" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to fetch vehicle" };
    }
}

export const handleCreateVehicle = async (formData: VehicleWritePayload) => {
    try {
        const result = await createVehicle(formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Vehicle created" };
        }
        return { success: false, message: result.message || "Failed to create vehicle" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to create vehicle" };
    }
}

export const handleUpdateVehicle = async (id: string, formData: UpdateVehiclePayload | FormData) => {
    try {
        const result = await updateVehicle(id, formData);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Vehicle updated" };
        }
        return { success: false, message: result.message || "Failed to update vehicle" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update vehicle" };
    }
}

export const handleDeleteVehicle = async (id: string) => {
    try {
        const result = await deleteVehicle(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Vehicle deleted" };
        }
        return { success: false, message: result.message || "Failed to delete vehicle" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to delete vehicle" };
    }
}

export const handleToggleVehicleAvailability = async (id: string) => {
    try {
        const result = await toggleVehicleAvailability(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Availability updated" };
        }
        return { success: false, message: result.message || "Failed to update availability" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update availability" };
    }
}

export const handleToggleVehicleVerification = async (id: string) => {
    try {
        const result = await toggleVehicleVerification(id);
        if (result.success) {
            return { success: true, data: result.data, message: result.message || "Verification updated" };
        }
        return { success: false, message: result.message || "Failed to update verification" };
    } catch (err: Error | any) {
        return { success: false, message: err.message || "Failed to update verification" };
    }
}
