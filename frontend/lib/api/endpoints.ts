export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        FORGOT_PASSWORD: "/api/auth/forgot-password",
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },

    USER: {
        GET_PROFILE: "/api/users/me",
        UPDATE_PROFILE: "/api/users/me",
        UPDATE_LOCATION: "/api/users/me/location",
        UPDATE_PROFILE_PICTURE: "/api/users/me/profile-picture",
    },

    VEHICLE: {
        GET_ALL: (params?: {
            page?: number;
            size?: number;
            type?: "car" | "bike" | "scooter" | "suv" | "van";
            fuelType?: "petrol" | "diesel" | "electric" | "hybrid";
            transmission?: "manual" | "automatic";
            minPrice?: number;
            maxPrice?: number;
            seats?: number;
            isAvailable?: boolean;
            pickupAddress?: string;
        }) => {
            if (!params) return "/api/vehicles";
            const q = new URLSearchParams();
            if (params.page !== undefined) q.set("page", String(params.page));
            if (params.size !== undefined) q.set("size", String(params.size));
            if (params.type) q.set("type", params.type);
            if (params.fuelType) q.set("fuelType", params.fuelType);
            if (params.transmission) q.set("transmission", params.transmission);
            if (params.minPrice !== undefined) q.set("minPrice", String(params.minPrice));
            if (params.maxPrice !== undefined) q.set("maxPrice", String(params.maxPrice));
            if (params.seats !== undefined) q.set("seats", String(params.seats));
            if (params.isAvailable !== undefined) q.set("isAvailable", String(params.isAvailable));
            if (params.pickupAddress) q.set("pickupAddress", params.pickupAddress);
            const qs = q.toString();
            return qs ? `/api/vehicles?${qs}` : "/api/vehicles";
        },
        GET_NEAR: (params: { lng: number; lat: number; maxDistanceKm?: number }) => {
            const q = new URLSearchParams();
            q.set("lng", String(params.lng));
            q.set("lat", String(params.lat));
            if (params.maxDistanceKm !== undefined) {
                q.set("maxDistanceKm", String(params.maxDistanceKm));
            }
            return `/api/vehicles/near?${q.toString()}`;
        },
        GET_BY_ID: (id: string) => `/api/vehicles/${id}`,
        CREATE: "/api/vehicles",
        UPDATE: (id: string) => `/api/vehicles/${id}`,
        DELETE: (id: string) => `/api/vehicles/${id}`,
        TOGGLE_AVAILABILITY: (id: string) => `/api/vehicles/${id}/availability`,
        TOGGLE_VERIFICATION: (id: string) => `/api/vehicles/${id}/verification`,
    },

    BOOKING: {
        CREATE: "/api/bookings",
        GET_ALL: (params?: {
            page?: number;
            size?: number;
            status?: "pending" | "confirmed" | "active" | "completed" | "cancelled";
            userId?: string;
            vehicleId?: string;
        }) => {
            if (!params) return "/api/bookings";
            const q = new URLSearchParams();
            if (params.page !== undefined) q.set("page", String(params.page));
            if (params.size !== undefined) q.set("size", String(params.size));
            if (params.status) q.set("status", params.status);
            if (params.userId) q.set("userId", params.userId);
            if (params.vehicleId) q.set("vehicleId", params.vehicleId);
            const qs = q.toString();
            return qs ? `/api/bookings?${qs}` : "/api/bookings";
        },
        GET_MY: "/api/bookings/me",
        GET_BY_ID: (id: string) => `/api/bookings/${id}`,
        UPDATE_STATUS: (id: string) => `/api/bookings/${id}/status`,
        CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
    },

    REVIEW: {
        CREATE: "/api/reviews",
        GET_FOR_VEHICLE: (vehicleId: string) => `/api/reviews/vehicle/${vehicleId}`,
        GET_ALL: "/api/reviews",
        GET_BY_ID: (id: string) => `/api/reviews/${id}`,
        UPDATE: (id: string) => `/api/reviews/${id}`,
        DELETE: (id: string) => `/api/reviews/${id}`,
    },

    REPORT: {
        CREATE: "/api/reports",
        GET_ALL: "/api/reports",
        GET_MY: "/api/reports/me",
        GET_BY_ID: (id: string) => `/api/reports/${id}`,
        UPDATE_STATUS: (id: string) => `/api/reports/${id}/status`,
        DELETE: (id: string) => `/api/reports/${id}`,
    },
};
