"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminTicketTiersPage() {
  return (
    <ResourceManager
      table="ticket_tiers"
      title="TICKET TIERS"
      description="Ticket types on sale for the championship. The price here is what Paystack charges."
      singular="Tier"
      orderBy={{ column: "price", ascending: true }}
      columns={[
        { key: "name", label: "Tier" },
        {
          key: "price",
          label: "Price",
          render: (row) => `₵ ${Number(row.price).toFixed(2)}`,
        },
        { key: "type", label: "Type" },
      ]}
      fields={[
        { key: "name", label: "Tier Name", required: true, half: true },
        { key: "price", label: "Price (GHS)", type: "number", required: true, half: true },
        { key: "type", label: "Type", half: true, placeholder: "vip / general" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
