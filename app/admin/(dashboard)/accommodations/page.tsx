"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ResourceManager, { type ResourceField } from "@/components/admin/resource-manager";

const LABEL_COLOR_OPTIONS = [
  { value: "bg-wff-red/20 text-wff-red", label: "Red (e.g. Official / VIP Host)" },
  { value: "bg-wff-gold/20 text-wff-gold", label: "Gold (e.g. Premium Partner)" },
  { value: "bg-white/10 text-white/80", label: "Neutral (e.g. Standard & Economy)" },
  { value: "", label: "No badge" },
];

export default function AdminAccommodationsPage() {
  const [eventOptions, setEventOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    supabase
      .from("events")
      .select("id, title")
      .order("start_date", { ascending: false })
      .then(({ data }) => {
        if (data) setEventOptions(data.map((e) => ({ value: e.id, label: e.title })));
      });
  }, []);

  const fields: ResourceField[] = [
    { key: "name", label: "Hotel / Property Name", required: true },
    {
      key: "location",
      label: "Location",
      half: true,
      placeholder: "Airport City (2 mins from ACC)",
    },
    {
      key: "type",
      label: "Badge Text",
      half: true,
      placeholder: "Official VIP Host",
      hint: "Shown as a small badge above the name. Leave blank for none.",
    },
    {
      key: "label_color",
      label: "Badge Color",
      type: "select",
      options: LABEL_COLOR_OPTIONS,
    },
    {
      key: "event_id",
      label: "Event",
      type: "select",
      required: true,
      options: eventOptions,
    },
    { key: "description", label: "Description", type: "textarea" },
  ];

  return (
    <ResourceManager
      table="accommodations"
      title="HOTELS & ACCOMMODATION"
      description="Partner hotels shown on the Championship and Info pages, closest-to-airport first by default."
      singular="Property"
      select="*, events(title)"
      columns={[
        { key: "name", label: "Property" },
        { key: "location", label: "Location" },
        { key: "type", label: "Badge" },
        { key: "events", label: "Event", render: (row) => row.events?.title || "—" },
      ]}
      fields={fields}
    />
  );
}
