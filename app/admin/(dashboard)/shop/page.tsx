"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminShopPage() {
  return (
    <ResourceManager
      table="ecommerce_products"
      title="ARMORY SHOP"
      description="Merchandise sold on the storefront. Prices here are what customers are charged."
      singular="Product"
      columns={[
        { key: "name", label: "Product" },
        {
          key: "price",
          label: "Price",
          render: (row) => `₵ ${Number(row.price).toFixed(2)}`,
        },
        { key: "category", label: "Category" },
        { key: "tag", label: "Tag" },
      ]}
      fields={[
        { key: "name", label: "Product Name", required: true },
        { key: "price", label: "Price (GHS)", type: "number", required: true, half: true },
        { key: "category", label: "Category", half: true, placeholder: "Apparel / Supplements" },
        { key: "tag", label: "Badge", half: true, placeholder: "New / Bestseller" },
        { key: "image_url", label: "Product Image", type: "image" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
