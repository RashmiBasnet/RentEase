"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "../../../_components/Button";
import { TextField } from "../../../_components/TextField";
import { Select } from "../../../_components/Select";
import { Modal } from "../../_components/Modal";
import { resolveImage } from "../../_components/adminUtils";
import {
  handleCreateVehicle,
  handleUpdateVehicle,
} from "@/lib/actions/vehicle-action";
import type { CreateVehiclePayload } from "@/lib/api/vehicle/vehicle";

type VehicleFormModalProps = {
  open: boolean;
  vehicle?: any | null;
  onClose: () => void;
};

type FormState = {
  title: string;
  brand: string;
  vehicleModel: string;
  type: string;
  fuelType: string;
  transmission: string;
  year: string;
  seats: string;
  pricePerDay: string;
  deposit: string;
  conditionRating: string;
  registrationNumber: string;
  pickupAddress: string;
  description: string;
  conditionNotes: string;
  existingImages: string[];
  features: string;
  lng: string;
  lat: string;
  insuranceIncluded: boolean;
  insuranceDetails: string;
};

function initialState(v?: any | null): FormState {
  return {
    title: v?.title ?? "",
    brand: v?.brand ?? "",
    vehicleModel: v?.vehicleModel ?? "",
    type: v?.type ?? "car",
    fuelType: v?.fuelType ?? "petrol",
    transmission: v?.transmission ?? "manual",
    year: v?.year ? String(v.year) : String(new Date().getFullYear()),
    seats: v?.seats ? String(v.seats) : "4",
    pricePerDay: v?.pricePerDay ? String(v.pricePerDay) : "",
    deposit: v?.deposit ? String(v.deposit) : "",
    conditionRating: v?.conditionRating ? String(v.conditionRating) : "5",
    registrationNumber: v?.registrationNumber ?? "",
    pickupAddress: v?.pickupAddress ?? "",
    description: v?.description ?? "",
    conditionNotes: v?.conditionNotes ?? "",
    existingImages: Array.isArray(v?.images) ? v.images : [],
    features: Array.isArray(v?.features) ? v.features.join(", ") : "",
    lng: v?.location?.coordinates?.[0] ? String(v.location.coordinates[0]) : "85.324",
    lat: v?.location?.coordinates?.[1] ? String(v.location.coordinates[1]) : "27.7172",
    insuranceIncluded: Boolean(v?.insurance?.included),
    insuranceDetails: v?.insurance?.details ?? "",
  };
}

const textareaClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:shadow-[var(--shadow-focus)]";
const maxVehicleImages = 12;

export function VehicleFormModal({
  open,
  vehicle,
  onClose,
}: VehicleFormModalProps) {
  const router = useRouter();
  const isEdit = Boolean(vehicle?._id);
  const [form, setForm] = useState<FormState>(() => initialState(vehicle));
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const imagePreviews = useMemo(
    () =>
      imageFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [imageFiles]
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  // Re-seed the form whenever a different vehicle is opened.
  const [seededFor, setSeededFor] = useState<string | undefined>(vehicle?._id);
  if (open && vehicle?._id !== seededFor) {
    setSeededFor(vehicle?._id);
    setForm(initialState(vehicle));
    setImageFiles([]);
    setError(null);
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const removeExistingImage = (imageIndex: number) => {
    setForm((f) => ({
      ...f,
      existingImages: f.existingImages.filter((_, index) => index !== imageIndex),
    }));
  };

  const removeSelectedImage = (imageIndex: number) => {
    setImageFiles((files) => files.filter((_, index) => index !== imageIndex));
  };

  const addSelectedImages = (selectedFiles: File[]) => {
    setError(null);
    setImageFiles((currentFiles) => {
      const availableSlots =
        maxVehicleImages - form.existingImages.length - currentFiles.length;

      if (availableSlots <= 0) {
        setError(`A vehicle can have up to ${maxVehicleImages} images.`);
        return currentFiles;
      }

      if (selectedFiles.length > availableSlots) {
        setError(`A vehicle can have up to ${maxVehicleImages} images.`);
      }

      return [
        ...currentFiles,
        ...selectedFiles.slice(0, availableSlots),
      ];
    });
  };

  const buildPayload = (): CreateVehiclePayload => {
    const features = form.features
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type as CreateVehiclePayload["type"],
      brand: form.brand.trim(),
      vehicleModel: form.vehicleModel.trim(),
      year: Number(form.year),
      registrationNumber: form.registrationNumber.trim(),
      fuelType: form.fuelType as CreateVehiclePayload["fuelType"],
      transmission: form.transmission as CreateVehiclePayload["transmission"],
      seats: Number(form.seats),
      pricePerDay: Number(form.pricePerDay),
      deposit: form.deposit ? Number(form.deposit) : undefined,
      images: form.existingImages,
      pickupAddress: form.pickupAddress.trim(),
      location: { type: "Point", coordinates: [Number(form.lng), Number(form.lat)] },
      features,
      conditionRating: Number(form.conditionRating),
      conditionNotes: form.conditionNotes.trim() || undefined,
      insurance: {
        included: form.insuranceIncluded,
        details: form.insuranceDetails.trim() || undefined,
      },
    };
  };

  const buildFormData = (payload: CreateVehiclePayload) => {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("type", payload.type);
    formData.append("brand", payload.brand);
    formData.append("vehicleModel", payload.vehicleModel);
    formData.append("year", String(payload.year));
    formData.append("registrationNumber", payload.registrationNumber);
    formData.append("fuelType", payload.fuelType);
    formData.append("transmission", payload.transmission);
    formData.append("seats", String(payload.seats));
    formData.append("pricePerDay", String(payload.pricePerDay));
    formData.append("pickupAddress", payload.pickupAddress);
    formData.append("location", JSON.stringify(payload.location));
    formData.append("conditionRating", String(payload.conditionRating));
    formData.append("imageUrls", JSON.stringify(payload.images));
    formData.append("features", JSON.stringify(payload.features ?? []));

    if (payload.deposit !== undefined) {
      formData.append("deposit", String(payload.deposit));
    }
    if (payload.conditionNotes) {
      formData.append("conditionNotes", payload.conditionNotes);
    }
    if (payload.insurance) {
      formData.append("insurance", JSON.stringify(payload.insurance));
    }

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    return formData;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = buildPayload();
    if (!payload.images.length && imageFiles.length === 0) {
      setError("Upload at least one vehicle image.");
      return;
    }
    if (payload.images.length + imageFiles.length > maxVehicleImages) {
      setError(`A vehicle can have up to ${maxVehicleImages} images.`);
      return;
    }

    const formData = buildFormData(payload);
    setSaving(true);
    const res = isEdit
      ? await handleUpdateVehicle(String(vehicle._id), formData)
      : await handleCreateVehicle(formData);
    setSaving(false);

    if (res.success) {
      onClose();
      router.refresh();
    } else {
      setError(res.message ?? "Something went wrong.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Vehicle" : "Add Vehicle"}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="vehicle-form" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Vehicle"}
          </Button>
        </>
      }
    >
      <form id="vehicle-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-[var(--color-danger-soft-bg)] px-4 py-2.5 text-sm text-[var(--color-danger-soft-text)]">
            {error}
          </p>
        )}

        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Brand"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            required
          />
          <TextField
            label="Model"
            value={form.vehicleModel}
            onChange={(e) => set("vehicleModel", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            {["car", "bike", "scooter", "suv", "van"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select
            label="Fuel"
            value={form.fuelType}
            onChange={(e) => set("fuelType", e.target.value)}
          >
            {["petrol", "diesel", "electric", "hybrid"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select
            label="Transmission"
            value={form.transmission}
            onChange={(e) => set("transmission", e.target.value)}
          >
            {["manual", "automatic"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <TextField
            label="Year"
            type="number"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            required
          />
          <TextField
            label="Seats"
            type="number"
            value={form.seats}
            onChange={(e) => set("seats", e.target.value)}
            required
          />
          <TextField
            label="Price/Day"
            type="number"
            value={form.pricePerDay}
            onChange={(e) => set("pricePerDay", e.target.value)}
            required
          />
          <TextField
            label="Deposit"
            type="number"
            value={form.deposit}
            onChange={(e) => set("deposit", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Registration No."
            value={form.registrationNumber}
            onChange={(e) => set("registrationNumber", e.target.value)}
            required
          />
          <TextField
            label="Condition Rating (1-5)"
            type="number"
            value={form.conditionRating}
            onChange={(e) => set("conditionRating", e.target.value)}
            required
          />
        </div>

        <TextField
          label="Pickup Address"
          value={form.pickupAddress}
          onChange={(e) => set("pickupAddress", e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Description
          </label>
          <textarea
            className={textareaClass}
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files ?? []);
              addSelectedImages(selectedFiles);
              e.target.value = "";
            }}
            className={textareaClass}
          />
          <p className="text-xs text-[var(--color-text-secondary)]">
            {form.existingImages.length + imageFiles.length} of {maxVehicleImages} images selected
          </p>
          {(form.existingImages.length > 0 || imagePreviews.length > 0) && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.existingImages.map((image, index) => {
                const src = resolveImage(image);
                return (
                  src && (
                    <div
                      key={`${image}-${index}`}
                      className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-inset)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt="Current vehicle"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Remove current image"
                        onClick={() => removeExistingImage(index)}
                        className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white opacity-90 transition-opacity hover:bg-black group-hover:opacity-100"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )
                );
              })}
              {imagePreviews.map((preview, index) => (
                <div
                  key={preview.url}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-inset)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Remove selected image"
                    onClick={() => removeSelectedImage(index)}
                    className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white opacity-90 transition-opacity hover:bg-black group-hover:opacity-100"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <TextField
          label="Features (comma separated)"
          value={form.features}
          onChange={(e) => set("features", e.target.value)}
          placeholder="AC, Bluetooth, GPS"
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Longitude"
            type="number"
            value={form.lng}
            onChange={(e) => set("lng", e.target.value)}
          />
          <TextField
            label="Latitude"
            type="number"
            value={form.lat}
            onChange={(e) => set("lat", e.target.value)}
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            checked={form.insuranceIncluded}
            onChange={(e) => set("insuranceIncluded", e.target.checked)}
            className="h-4 w-4 rounded border-[var(--color-border-strong)] accent-[var(--color-primary)]"
          />
          Insurance included
        </label>
        {form.insuranceIncluded && (
          <TextField
            label="Insurance Details"
            value={form.insuranceDetails}
            onChange={(e) => set("insuranceDetails", e.target.value)}
          />
        )}
      </form>
    </Modal>
  );
}
