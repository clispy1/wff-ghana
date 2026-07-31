"use client";

import { useEffect, useState } from "react";
import {
  EVENT_CONTENT_DEFAULTS,
  fetchEventPageContent,
  saveEventContentSection,
  type EventPageContent,
  type ScheduleDay,
  type ScheduleBlock,
  type AwardItem,
} from "@/lib/eventContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, RefreshCw } from "lucide-react";
import {
  SectionCard,
  Field,
  TextAreaField,
  RowControls,
  StringListEditor,
  updateItem,
  moveItem,
  inputClass,
} from "@/components/admin/content-editor-kit";

export default function AdminSchedulePage() {
  const [content, setContent] = useState<EventPageContent>(EVENT_CONTENT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<keyof EventPageContent | null>(null);
  const [savedKey, setSavedKey] = useState<keyof EventPageContent | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setContent(await fetchEventPageContent());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load schedule content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = <K extends keyof EventPageContent>(section: K, value: EventPageContent[K]) => {
    setContent((prev) => ({ ...prev, [section]: value }));
  };

  const save = async (section: keyof EventPageContent) => {
    setSavingKey(section);
    setError(null);
    try {
      await saveEventContentSection(section, content[section]);
      setSavedKey(section);
      setTimeout(() => setSavedKey((k) => (k === section ? null : k)), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return <p className="text-white/40 font-sans text-sm">Loading schedule content…</p>;
  }

  const days = content.schedule.days;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">EVENT SCHEDULE &amp; LOGISTICS</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            The day-by-day running order, arrival/hotel/visa notes, and awards copy shown on{" "}
            <span className="text-wff-gold">/championship</span>. One source of truth, so the
            schedule can&apos;t drift out of sync with itself.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={load}
          className="text-white/40 hover:text-white"
          aria-label="Reload"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="bg-wff-red/10 border border-wff-red/30 text-wff-red font-sans text-xs p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Schedule days */}
      <SectionCard
        title="RUNNING ORDER"
        hint="One card per day. Leave venue blank to use the main event venue from Events & Logistics."
        saving={savingKey === "schedule"}
        saved={savedKey === "schedule"}
        onSave={() => save("schedule")}
      >
        <div className="space-y-4">
          {days.map((day, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-4 space-y-3 bg-black/30">
              <div className="flex justify-between items-center">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                  Day {i + 1}
                </span>
                <RowControls
                  index={i}
                  count={days.length}
                  onMove={(from, to) => update("schedule", { days: moveItem(days, from, to) })}
                  onRemove={() =>
                    update("schedule", { days: days.filter((_, idx) => idx !== i) })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Date</Label>
                  <Input
                    type="date"
                    value={day.date}
                    onChange={(e) =>
                      update("schedule", { days: updateItem(days, i, { date: e.target.value }) })
                    }
                    className={inputClass}
                  />
                </div>
                <Field
                  label="Day Title"
                  value={day.dayTitle}
                  onChange={(e) =>
                    update("schedule", { days: updateItem(days, i, { dayTitle: e.target.value }) })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Venue Override (optional)"
                  value={day.venueName || ""}
                  onChange={(e) =>
                    update("schedule", {
                      days: updateItem(days, i, { venueName: e.target.value || undefined }),
                    })
                  }
                />
                <Field
                  label="Venue Location Override"
                  value={day.venueLocation || ""}
                  onChange={(e) =>
                    update("schedule", {
                      days: updateItem(days, i, { venueLocation: e.target.value || undefined }),
                    })
                  }
                />
              </div>

              <div className="space-y-3 border-t border-white/10 pt-3">
                <Label className="text-white/50 text-xs">Time Blocks</Label>
                {day.blocks.map((block, bIdx) => (
                  <div key={bIdx} className="border border-white/5 rounded-md p-3 space-y-2 bg-white/[0.02]">
                    <div className="flex gap-2 items-start">
                      <Input
                        value={block.label}
                        onChange={(e) =>
                          update("schedule", {
                            days: updateItem(days, i, {
                              blocks: updateItem(day.blocks, bIdx, { label: e.target.value }),
                            }),
                          })
                        }
                        placeholder="Time or session label"
                        className={`${inputClass} flex-1`}
                      />
                      <RowControls
                        index={bIdx}
                        count={day.blocks.length}
                        onMove={(from, to) =>
                          update("schedule", {
                            days: updateItem(days, i, { blocks: moveItem(day.blocks, from, to) }),
                          })
                        }
                        onRemove={() =>
                          update("schedule", {
                            days: updateItem(days, i, {
                              blocks: day.blocks.filter((_, idx) => idx !== bIdx),
                            }),
                          })
                        }
                      />
                    </div>
                    <StringListEditor
                      label="Items (one activity per line — a single item renders inline, several render as a bulleted list)"
                      items={block.items}
                      onChange={(items) =>
                        update("schedule", {
                          days: updateItem(days, i, {
                            blocks: updateItem(day.blocks, bIdx, { items }),
                          }),
                        })
                      }
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    update("schedule", {
                      days: updateItem(days, i, {
                        blocks: [...day.blocks, { label: "", items: [""] } as ScheduleBlock],
                      }),
                    })
                  }
                  className="w-full bg-white/5 text-white/60 hover:bg-white/10 font-bebas tracking-widest text-sm h-8"
                >
                  <Plus className="mr-2 h-3.5 w-3.5" /> ADD TIME BLOCK
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              update("schedule", {
                days: [
                  ...days,
                  { date: "", dayTitle: "NEW DAY", blocks: [] } as ScheduleDay,
                ],
              })
            }
            className="w-full bg-white/5 text-white/60 hover:bg-white/10 font-bebas tracking-widest"
          >
            <Plus className="mr-2 h-4 w-4" /> ADD DAY
          </Button>
        </div>
      </SectionCard>

      {/* Logistics */}
      <SectionCard
        title="ARRIVAL, VISAS & ACCOMMODATION"
        hint="Hotel listings themselves are managed under Hotels & Accommodation — this is just the surrounding copy."
        saving={savingKey === "logistics"}
        saved={savedKey === "logistics"}
        onSave={() => save("logistics")}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Host Nation Name"
            value={content.logistics.hostNationName}
            onChange={(e) => update("logistics", { ...content.logistics, hostNationName: e.target.value })}
          />
          <Field
            label="Host Nation Tagline"
            value={content.logistics.hostNationTagline}
            onChange={(e) => update("logistics", { ...content.logistics, hostNationTagline: e.target.value })}
          />
        </div>
        <TextAreaField
          label="Airport Arrival Info"
          value={content.logistics.airportIntro}
          onChange={(v) => update("logistics", { ...content.logistics, airportIntro: v })}
        />
        <TextAreaField
          label="Alternative Transport Note"
          value={content.logistics.transportNote}
          onChange={(v) => update("logistics", { ...content.logistics, transportNote: v })}
        />
        <TextAreaField
          label="Visa Note"
          value={content.logistics.visaNote}
          onChange={(v) => update("logistics", { ...content.logistics, visaNote: v })}
        />
        <TextAreaField
          label="Yellow Fever Note"
          value={content.logistics.yellowFeverNote}
          onChange={(v) => update("logistics", { ...content.logistics, yellowFeverNote: v })}
        />
        <TextAreaField
          label="Hotel Partnership Intro"
          value={content.logistics.hotelIntro}
          onChange={(v) => update("logistics", { ...content.logistics, hotelIntro: v })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Hotel Discount Code"
            value={content.logistics.hotelDiscountCode}
            onChange={(e) => update("logistics", { ...content.logistics, hotelDiscountCode: e.target.value })}
          />
          <Field
            label="Event Info PDF URL"
            value={content.logistics.pdfUrl}
            onChange={(e) => update("logistics", { ...content.logistics, pdfUrl: e.target.value })}
          />
        </div>
      </SectionCard>

      {/* Awards */}
      <SectionCard
        title="AWARDS & PRIZES"
        hint="Shown on the /info page. Icon colors are fixed to the first three cards by design."
        saving={savingKey === "awards"}
        saved={savedKey === "awards"}
        onSave={() => save("awards")}
      >
        <div className="space-y-4">
          {content.awards.items.map((award, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-4 space-y-3 bg-black/30">
              <div className="flex justify-between items-center">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                  Award {i + 1}
                </span>
                <RowControls
                  index={i}
                  count={content.awards.items.length}
                  onMove={(from, to) =>
                    update("awards", { items: moveItem(content.awards.items, from, to) })
                  }
                  onRemove={() =>
                    update("awards", {
                      items: content.awards.items.filter((_, idx) => idx !== i),
                    })
                  }
                />
              </div>
              <Field
                label="Title"
                value={award.title}
                onChange={(e) =>
                  update("awards", {
                    items: updateItem(content.awards.items, i, { title: e.target.value }),
                  })
                }
              />
              <TextAreaField
                label="Description"
                rows={2}
                value={award.description}
                onChange={(v) =>
                  update("awards", { items: updateItem(content.awards.items, i, { description: v }) })
                }
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={() =>
              update("awards", {
                items: [
                  ...content.awards.items,
                  { title: "NEW AWARD", description: "" } as AwardItem,
                ],
              })
            }
            className="w-full bg-white/5 text-white/60 hover:bg-white/10 font-bebas tracking-widest"
          >
            <Plus className="mr-2 h-4 w-4" /> ADD AWARD
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
