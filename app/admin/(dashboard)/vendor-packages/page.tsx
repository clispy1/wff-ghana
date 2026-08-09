"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminVendorPackagesPage() {
  return (
    <ResourceManager
      table="vendor_packages"
      title="VENDOR PACKAGES"
      description="Sponsorship and booth packages shown on the public apply page at /championship/vendors/apply. Prices are charged in GHS via Paystack."
      singular="Package"
      orderBy={{ column: "display_order", ascending: true }}
      columns={[
        { key: "name", label: "Package" },
        {
          key: "price",
          label: "Price (GHS)",
          render: (row) =>
            row.price == null ? "—" : `₵ ${Number(row.price).toFixed(2)}`,
        },
        {
          key: "is_active",
          label: "Active",
          render: (row) =>
            row.is_active ? (
              <span className="text-green-400 font-bold">●</span>
            ) : (
              <span className="text-white/25 font-bold">●</span>
            ),
        },
        { key: "display_order", label: "Order" },
      ]}
      fields={[
        { key: "name", label: "Package Name", required: true },
        { key: "price", label: "Price (GHS)", type: "number", half: true },
        {
          key: "is_active",
          label: "Visible on apply page",
          type: "checkbox",
          half: true,
        },
        { key: "display_order", label: "Display Order", type: "number", half: true },
        { key: "description", label: "Short Description", type: "textarea", half: false },
        {
          key: "benefits",
          label: "Benefits",
          type: "textarea",
          hint: "One benefit per line — each line becomes a bullet on the apply page.",
        },
      ]}
    />
  );
}
