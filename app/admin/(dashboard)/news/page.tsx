"use client";

import ResourceManager from "@/components/admin/resource-manager";

export default function AdminNewsPage() {
  return (
    <ResourceManager
      table="news_articles"
      title="NEWS & MEDIA"
      description="Articles surfaced on the homepage and media page, newest first."
      singular="Article"
      orderBy={{ column: "publish_date", ascending: false }}
      columns={[
        { key: "title", label: "Headline" },
        { key: "publish_date", label: "Published" },
        {
          key: "summary",
          label: "Summary",
          render: (row) =>
            row.summary ? `${String(row.summary).slice(0, 60)}…` : "—",
        },
      ]}
      fields={[
        { key: "title", label: "Headline", required: true },
        { key: "publish_date", label: "Publish Date", type: "date", required: true, half: true },
        { key: "image_url", label: "Cover Image", type: "image" },
        { key: "summary", label: "Summary", type: "textarea", hint: "Shown in article cards." },
        { key: "content_body", label: "Full Article", type: "textarea" },
      ]}
    />
  );
}
