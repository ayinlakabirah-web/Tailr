"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateMeasurements } from "@/lib/actions/customers";
import { MeasurementInput, ExtraMeasurementInput } from "@/lib/validation/customers";
import { Measurement } from "@prisma/client";
import { Check, Edit2, Plus, Save, Trash2, X } from "lucide-react";

interface MeasurementFormProps {
  customerId: string;
  initialData: Measurement | null;
}

function parseExtraMeasurements(data: Measurement | null): ExtraMeasurementInput[] {
  if (!data?.extraMeasurements) return [];
  const raw = data.extraMeasurements;
  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      name: String((item as Record<string, unknown>).name ?? ""),
      value: Number((item as Record<string, unknown>).value ?? 0),
    }));
  }
  return [];
}

export function MeasurementForm({ customerId, initialData }: MeasurementFormProps) {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<MeasurementInput>({
    shoulder: initialData?.shoulder ?? null,
    bust: initialData?.bust ?? null,
    waist: initialData?.waist ?? null,
    hip: initialData?.hip ?? null,
    sleeve: initialData?.sleeve ?? null,
    armhole: initialData?.armhole ?? null,
    thigh: initialData?.thigh ?? null,
    trouserLength: initialData?.trouserLength ?? null,
    extraMeasurements: parseExtraMeasurements(initialData),
  });

  const [newExtraName, setNewExtraName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : parseFloat(value),
    }));
    setError(null);
    setSuccess(false);
  };

  const handleExtraValueChange = (index: number, value: string) => {
    setFormData((prev) => {
      const extras = [...(prev.extraMeasurements ?? [])];
      extras[index] = { ...extras[index], value: value === "" ? 0 : parseFloat(value) };
      return { ...prev, extraMeasurements: extras };
    });
    setError(null);
    setSuccess(false);
  };

  const handleAddExtra = () => {
    const name = newExtraName.trim();
    if (!name) return;
    setFormData((prev) => ({
      ...prev,
      extraMeasurements: [...(prev.extraMeasurements ?? []), { name, value: 0 }],
    }));
    setNewExtraName("");
  };

  const handleRemoveExtra = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extraMeasurements: (prev.extraMeasurements ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await updateMeasurements(customerId, formData);

    if (result.success) {
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  type MeasurementKey = "shoulder" | "bust" | "waist" | "hip" | "sleeve" | "armhole" | "thigh" | "trouserLength";

  const fields: { name: MeasurementKey; label: string }[] = [
    { name: "shoulder", label: "Shoulder" },
    { name: "bust", label: "Bust" },
    { name: "waist", label: "Waist" },
    { name: "hip", label: "Hip" },
    { name: "sleeve", label: "Sleeve Length" },
    { name: "armhole", label: "Armhole" },
    { name: "thigh", label: "Thigh" },
    { name: "trouserLength", label: "Trouser Length" },
  ];

  if (!isEditing) {
    const hasAnyData = Object.values(formData).some(v => v !== null && v !== 0) || (formData.extraMeasurements ?? []).length > 0;
    
    if (hasAnyData || initialData) {
      return (
        <Card padding="lg">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
          <h2 style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "700", color: "var(--color-on-surface)" }}>
            Measurements
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 size={16} style={{ marginRight: "var(--space-2)" }} /> Edit
          </Button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "var(--space-6)"
        }}>
          {fields.map((field) => (
            <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <span style={{ fontSize: "var(--typography-label-small-font-size)", color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {field.label}
              </span>
              <span style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "600", color: "var(--color-on-surface)" }}>
                {formData[field.name as MeasurementKey] ?? "—"} <span style={{ fontSize: "14px", fontWeight: "400", color: "var(--color-on-surface-variant)" }}>in</span>
              </span>
            </div>
          ))}
          {(formData.extraMeasurements ?? []).map((extra, i) => (
            <div key={`extra-${i}`} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <span style={{ fontSize: "var(--typography-label-small-font-size)", color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {extra.name}
              </span>
              <span style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "600", color: "var(--color-on-surface)" }}>
                {extra.value} <span style={{ fontSize: "14px", fontWeight: "400", color: "var(--color-on-surface-variant)" }}>in</span>
              </span>
            </div>
          ))}
        </div>

        {success && (
          <div style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-2) var(--space-3)",
            backgroundColor: "var(--color-primary-container)",
            color: "var(--color-on-primary-container)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "14px"
          }}>
            <Check size={16} /> Measurements saved successfully!
          </div>
        )}
      </Card>
    );
    }
  }

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" }}>
          <h2 style={{ fontSize: "var(--typography-title-medium-font-size)", fontWeight: "700", color: "var(--color-on-surface)" }}>
            Edit Measurements
          </h2>
          {initialData && (
            <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setError(null); }} disabled={isLoading}>
              <X size={16} style={{ marginRight: "var(--space-2)" }} /> Cancel
            </Button>
          )}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "var(--space-6)"
        }}>
          {fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              name={field.name}
              type="number"
              placeholder="0.0"
              value={formData[field.name as MeasurementKey]?.toString() ?? ""}
              onChange={handleChange}
              labelRight={<span style={{ color: "var(--color-on-surface-variant)", opacity: 0.6 }}>inches</span>}
            />
          ))}
        </div>

        {/* Extra measurements */}
        <div style={{ marginBottom: "var(--space-6)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-on-surface)", marginBottom: "var(--space-4)" }}>
            Extra Measurements
          </h3>

          {(formData.extraMeasurements ?? []).length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--color-on-surface-variant)", marginBottom: "var(--space-4)" }}>
              No extra measurements added yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
              {(formData.extraMeasurements ?? []).map((extra, i) => (
                <div key={i} style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      label="Name"
                      name={`extra-name-${i}`}
                      value={extra.name}
                      onChange={(e) => {
                        const extras = [...(formData.extraMeasurements ?? [])];
                        extras[i] = { ...extras[i], name: e.target.value };
                        setFormData((prev) => ({ ...prev, extraMeasurements: extras }));
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      label="Value (in)"
                      name={`extra-value-${i}`}
                      type="number"
                      placeholder="0.0"
                      value={extra.value.toString()}
                      onChange={(e) => handleExtraValueChange(i, e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => handleRemoveExtra(i)}
                    style={{ marginBottom: "2px", color: "var(--color-error)" }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Input
                label="New measurement name"
                name="newExtraName"
                placeholder="e.g. Neck, Calf, etc."
                value={newExtraName}
                onChange={(e) => setNewExtraName(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={handleAddExtra}
              disabled={!newExtraName.trim()}
              style={{ marginBottom: "2px" }}
            >
              <Plus size={16} style={{ marginRight: "var(--space-1)" }} /> Add
            </Button>
          </div>
        </div>

        {error && (
          <div style={{
            marginBottom: "var(--space-4)",
            color: "var(--color-error)",
            fontSize: "14px",
            padding: "12px",
            backgroundColor: "color-mix(in srgb, var(--color-error), transparent 90%)",
            borderRadius: "8px"
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" isLoading={isLoading} style={{ width: "100%", maxWidth: "200px" }}>
            <Save size={18} style={{ marginRight: "var(--space-2)" }} /> Save Measurements
          </Button>
        </div>
      </form>
    </Card>
  );
}
