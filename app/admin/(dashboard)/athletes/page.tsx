"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminAthletesPage() {
  return (
    <ResourceManager
      table="memberships"
      title="ATHLETES ROSTER"
      description="Federation members shown on the public roster and championship line-up."
      singular="Athlete"
      columns={[
        {
          key: "name",
          label: "Name",
          render: (row) => `${row.first_name} ${row.last_name}`,
        },
        { key: "country", label: "Country" },
        {
          key: "bio",
          label: "Bio",
          render: (row) =>
            row.bio ? `${String(row.bio).slice(0, 60)}${row.bio.length > 60 ? "…" : ""}` : "—",
        },
      ]}
      fields={[
        { key: "first_name", label: "First Name", required: true, half: true },
        { key: "last_name", label: "Last Name", required: true, half: true },
        { key: "country", label: "Country", required: true, half: true },
        { key: "profile_image_url", label: "Profile Photo", type: "image" },
        { key: "bio", label: "Biography", type: "textarea" },
      ]}
    />
  );
}
