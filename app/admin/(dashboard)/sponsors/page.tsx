"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminSponsorsPage() {
  return (
    <ResourceManager
      table="sponsors"
      title="SPONSORS & PARTNERS"
      description="Partner logos on the homepage and partnerships page. Lower display order shows first."
      singular="Sponsor"
      orderBy={{ column: "display_order", ascending: true }}
      columns={[
        { key: "name", label: "Sponsor" },
        { key: "tier", label: "Tier" },
        { key: "display_order", label: "Order" },
      ]}
      fields={[
        { key: "name", label: "Sponsor Name", required: true },
        {
          key: "tier",
          label: "Tier",
          type: "select",
          half: true,
          options: [
            { value: "platinum", label: "Platinum" },
            { value: "gold", label: "Gold" },
            { value: "silver", label: "Silver" },
            { value: "partner", label: "Partner" },
          ],
        },
        { key: "display_order", label: "Display Order", type: "number", half: true },
        { key: "logo_url", label: "Logo", type: "image" },
        { key: "link_url", label: "Website URL", placeholder: "https://…" },
      ]}
    />
  );
}
