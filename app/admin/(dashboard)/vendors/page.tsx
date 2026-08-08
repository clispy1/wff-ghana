"use client";

import ResourceManager from "@/components/admin/resource-manager";

const CATEGORY_LABEL: Record<string, string> = {
  catering: "Catering",
  merchandise: "Merchandise",
  services: "Services",
  other: "Other",
};

const StatusBadge = ({ status }: { status: string | null }) => {
  const approved = status === "approved";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
        approved
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
      }`}
    >
      {approved ? "Approved" : "Pending"}
    </span>
  );
};

export default function AdminVendorsPage() {
  return (
    <ResourceManager
      table="vendors"
      title="EVENT VENDORS"
      description="Vendors for the championship. Approved vendors appear on the public directory at /championship/vendors."
      singular="Vendor"
      orderBy={{ column: "display_order", ascending: true }}
      columns={[
        { key: "name", label: "Vendor" },
        {
          key: "category",
          label: "Category",
          render: (row) => CATEGORY_LABEL[row.category] ?? row.category ?? "—",
        },
        { key: "contact_person", label: "Contact" },
        { key: "phone", label: "Phone" },
        {
          key: "status",
          label: "Status",
          render: (row) => <StatusBadge status={row.status} />,
        },
        { key: "display_order", label: "Order" },
      ]}
      fields={[
        { key: "name", label: "Vendor Name", required: true },
        {
          key: "category",
          label: "Category",
          type: "select",
          half: true,
          options: [
            { value: "catering", label: "Catering" },
            { value: "merchandise", label: "Merchandise" },
            { value: "services", label: "Services" },
            { value: "other", label: "Other" },
          ],
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          half: true,
          hint: "Only approved vendors show on the public directory.",
          options: [
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
          ],
        },
        { key: "contact_person", label: "Contact Person", half: true },
        { key: "phone", label: "Phone", half: true },
        { key: "email", label: "Email", half: true },
        { key: "website_url", label: "Website URL", half: true, placeholder: "https://…" },
        { key: "display_order", label: "Display Order", type: "number", half: true },
        {
          key: "notes",
          label: "Notes",
          type: "textarea",
          hint: "Internal notes — not shown on the public site.",
        },
      ]}
    />
  );
}
