"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminGalleryPage() {
  return (
    <ResourceManager
      table="gallery_media"
      title="GALLERY"
      description="Photos shown in the homepage 'Chapter Media' teaser and the full /media gallery. Lower display order shows first."
      singular="Photo"
      orderBy={{ column: "display_order", ascending: true }}
      columns={[
        { key: "caption", label: "Caption" },
        { key: "display_order", label: "Order" },
      ]}
      fields={[
        { key: "image_url", label: "Photo", type: "image", required: true },
        { key: "caption", label: "Caption (alt text)" },
        { key: "display_order", label: "Display Order", type: "number", half: true },
      ]}
    />
  );
}
