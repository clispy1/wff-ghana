"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminStaffPage() {
  return (
    <ResourceManager
      table="federation_staff"
      title="FEDERATION STAFF"
      description="Officials and executives listed on the federation page."
      singular="Official"
      orderBy={{ column: "display_order", ascending: true }}
      columns={[
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "display_order", label: "Order" },
      ]}
      fields={[
        { key: "name", label: "Full Name", required: true, half: true },
        { key: "role", label: "Role / Title", required: true, half: true },
        { key: "display_order", label: "Display Order", type: "number", half: true },
        { key: "image_url", label: "Portrait", type: "image" },
        { key: "bio", label: "Biography", type: "textarea" },
      ]}
    />
  );
}
