"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  HOME_CONTENT_DEFAULTS,
  fetchHomeContent,
  saveHomeContentSection,
  type HomeContent,
  type JourneyItem,
  type AmbassadorItem,
} from "@/lib/homeContent";
import { uploadPublicMedia } from "@/lib/uploadPublicMedia";
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

export default function AdminHomepagePage() {
  const [content, setContent] = useState<HomeContent>(HOME_CONTENT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<keyof HomeContent | null>(null);
  const [savedKey, setSavedKey] = useState<keyof HomeContent | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setContent(await fetchHomeContent());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load homepage content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = <K extends keyof HomeContent>(section: K, value: HomeContent[K]) => {
    setContent((prev) => ({ ...prev, [section]: value }));
  };

  const save = async (section: keyof HomeContent) => {
    setSavingKey(section);
    setError(null);
    try {
      await saveHomeContentSection(section, content[section]);
      setSavedKey(section);
      setTimeout(() => setSavedKey((k) => (k === section ? null : k)), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return <p className="text-white/40 font-sans text-sm">Loading homepage content…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-bebas text-4xl text-white">HOMEPAGE CONTENT</h2>
          <p className="text-white/50 text-sm font-sans mt-2">
            Copy and images shown on the public homepage. Event dates and venue come from{" "}
            <span className="text-wff-gold">Events &amp; Logistics</span> instead — edit those
            there. Sponsors, news and shop products are managed on their own pages.
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

      {/* Federation / President */}
      <SectionCard
        title="FEDERATION SECTION"
        hint="The 'THE FEDERATION' block with the president photo, quote and body copy."
        saving={savingKey === "president"}
        saved={savedKey === "president"}
        onSave={() => save("president")}
      >
        <Field
          label="Section Title"
          value={content.president.title}
          onChange={(e) => update("president", { ...content.president, title: e.target.value })}
        />
        <TextAreaField
          label="Quote"
          value={content.president.quote}
          onChange={(v) => update("president", { ...content.president, quote: v })}
        />
        <TextAreaField
          label="Body Paragraph 1"
          value={content.president.body1}
          onChange={(v) => update("president", { ...content.president, body1: v })}
        />
        <TextAreaField
          label="Body Paragraph 2"
          value={content.president.body2}
          onChange={(v) => update("president", { ...content.president, body2: v })}
        />
        <Field
          label="Button Text"
          value={content.president.cta.text}
          onChange={(e) =>
            update("president", { ...content.president, cta: { text: e.target.value } })
          }
        />

        <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
          <Field
            label="President Name"
            value={content.president.president.name}
            onChange={(e) =>
              update("president", {
                ...content.president,
                president: { ...content.president.president, name: e.target.value },
              })
            }
          />
          <Field
            label="President Role"
            value={content.president.president.role}
            onChange={(e) =>
              update("president", {
                ...content.president,
                president: { ...content.president.president, role: e.target.value },
              })
            }
          />
        </div>

        <ImagePicker
          label="President Photo"
          folder="homepage/president"
          value={content.president.president.image}
          onChange={(url) =>
            update("president", {
              ...content.president,
              president: { ...content.president.president, image: url },
            })
          }
        />
      </SectionCard>

      {/* Journey panels */}
      <SectionCard
        title="THE JOURNEY"
        hint="The five-panel bento grid (Foundation, Intensity, Discipline, Stage, Ascension)."
        saving={savingKey === "journey"}
        saved={savedKey === "journey"}
        onSave={() => save("journey")}
      >
        <div className="space-y-4">
          {content.journey.items.map((item, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-4 space-y-3 bg-black/30">
              <div className="flex justify-between items-center">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                  Panel {i + 1}
                </span>
                <RowControls
                  index={i}
                  count={content.journey.items.length}
                  onMove={(from, to) =>
                    update("journey", { items: moveItem(content.journey.items, from, to) })
                  }
                  onRemove={() =>
                    update("journey", {
                      items: content.journey.items.filter((_, idx) => idx !== i),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Title"
                  value={item.title}
                  onChange={(e) =>
                    update("journey", {
                      items: updateItem(content.journey.items, i, { title: e.target.value }),
                    })
                  }
                />
                <div className="space-y-1.5">
                  <Label className="text-white/50 text-xs">Media Type</Label>
                  <select
                    value={item.type}
                    onChange={(e) =>
                      update("journey", {
                        items: updateItem(content.journey.items, i, {
                          type: e.target.value as JourneyItem["type"],
                        }),
                      })
                    }
                    className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-wff-gold transition-colors"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <Field
                label="Subtitle"
                value={item.subtitle}
                onChange={(e) =>
                  update("journey", {
                    items: updateItem(content.journey.items, i, { subtitle: e.target.value }),
                  })
                }
              />

              {item.type === "image" ? (
                <ImagePicker
                  label="Panel Image"
                  folder="homepage/journey"
                  value={item.src}
                  onChange={(url) =>
                    update("journey", { items: updateItem(content.journey.items, i, { src: url }) })
                  }
                />
              ) : (
                <Field
                  label="Video URL"
                  value={item.src}
                  onChange={(e) =>
                    update("journey", {
                      items: updateItem(content.journey.items, i, { src: e.target.value }),
                    })
                  }
                />
              )}
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              update("journey", {
                items: [
                  ...content.journey.items,
                  { title: "NEW PANEL", subtitle: "", type: "image", src: "" },
                ],
              })
            }
            className="w-full bg-white/5 text-white/60 hover:bg-white/10 font-bebas tracking-widest"
          >
            <Plus className="mr-2 h-4 w-4" /> ADD PANEL
          </Button>
        </div>
      </SectionCard>

      {/* Championship details */}
      <SectionCard
        title="CHAMPIONSHIP DETAILS"
        hint="Falls back copy for the championship block on the homepage — overridden automatically whenever an event is marked live under Events & Logistics."
        saving={savingKey === "championship"}
        saved={savedKey === "championship"}
        onSave={() => save("championship")}
      >
        <Field
          label="Supertitle"
          value={content.championship.supertitle}
          onChange={(e) => update("championship", { ...content.championship, supertitle: e.target.value })}
        />
        <div className="grid grid-cols-1 gap-3">
          <Field
            label="Fallback Title"
            value={content.championship.title}
            onChange={(e) => update("championship", { ...content.championship, title: e.target.value })}
          />
          <TextAreaField
            label="Fallback Description"
            value={content.championship.description}
            onChange={(v) => update("championship", { ...content.championship, description: v })}
          />
        </div>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <Field
            label="Categories Card Title"
            value={content.championship.categoriesTitle}
            onChange={(e) =>
              update("championship", { ...content.championship, categoriesTitle: e.target.value })
            }
          />
          <StringListEditor
            label="Competition Categories"
            items={content.championship.categories}
            onChange={(items) => update("championship", { ...content.championship, categories: items })}
          />
        </div>

        <div className="border-t border-white/10 pt-4 grid grid-cols-1 gap-3">
          <Field
            label="Prize Card Title"
            value={content.championship.stakesTitle}
            onChange={(e) => update("championship", { ...content.championship, stakesTitle: e.target.value })}
          />
          <TextAreaField
            label="Prize Description"
            value={content.championship.stakesDescription}
            onChange={(v) => update("championship", { ...content.championship, stakesDescription: v })}
          />
          <Field
            label="Prize Badge Text"
            value={content.championship.stakesBadge}
            onChange={(e) => update("championship", { ...content.championship, stakesBadge: e.target.value })}
          />
        </div>

        <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-3">
          <Field
            label="Fallback Venue Name"
            value={content.championship.venueTitle}
            onChange={(e) => update("championship", { ...content.championship, venueTitle: e.target.value })}
          />
          <Field
            label="Fallback Venue Location"
            value={content.championship.venueLocation}
            onChange={(e) => update("championship", { ...content.championship, venueLocation: e.target.value })}
          />
        </div>
        <TextAreaField
          label="Venue Details"
          value={content.championship.venueDetails}
          onChange={(v) => update("championship", { ...content.championship, venueDetails: v })}
        />

        <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-3">
          <Field
            label="Tickets Button Text"
            value={content.championship.ctas.tickets.text}
            onChange={(e) =>
              update("championship", {
                ...content.championship,
                ctas: { ...content.championship.ctas, tickets: { text: e.target.value } },
              })
            }
          />
          <Field
            label="Register Button Text"
            value={content.championship.ctas.register.text}
            onChange={(e) =>
              update("championship", {
                ...content.championship,
                ctas: { ...content.championship.ctas, register: { text: e.target.value } },
              })
            }
          />
        </div>
      </SectionCard>

      {/* Ambassadors / divisions */}
      <SectionCard
        title="FOUNDING EMBASSY"
        hint="The three division slot cards (Aesthetics, Classic, Wellness)."
        saving={savingKey === "ambassadors"}
        saved={savedKey === "ambassadors"}
        onSave={() => save("ambassadors")}
      >
        <Field
          label="Section Title"
          value={content.ambassadors.title}
          onChange={(e) => update("ambassadors", { ...content.ambassadors, title: e.target.value })}
        />
        <Field
          label="Subtitle"
          value={content.ambassadors.subtitle}
          onChange={(e) => update("ambassadors", { ...content.ambassadors, subtitle: e.target.value })}
        />
        <TextAreaField
          label="Description"
          value={content.ambassadors.description}
          onChange={(v) => update("ambassadors", { ...content.ambassadors, description: v })}
        />

        <div className="space-y-4 border-t border-white/10 pt-4">
          {content.ambassadors.items.map((item, i) => (
            <div key={item.id} className="border border-white/10 rounded-lg p-4 space-y-3 bg-black/30">
              <div className="flex justify-between items-center">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                  Division {i + 1}
                </span>
                <RowControls
                  index={i}
                  count={content.ambassadors.items.length}
                  onMove={(from, to) =>
                    update("ambassadors", {
                      ...content.ambassadors,
                      items: moveItem(content.ambassadors.items, from, to),
                    })
                  }
                  onRemove={() =>
                    update("ambassadors", {
                      ...content.ambassadors,
                      items: content.ambassadors.items.filter((_, idx) => idx !== i),
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Title"
                  value={item.title}
                  onChange={(e) =>
                    update("ambassadors", {
                      ...content.ambassadors,
                      items: updateItem(content.ambassadors.items, i, { title: e.target.value }),
                    })
                  }
                />
                <Field
                  label="Badge"
                  value={item.badge}
                  onChange={(e) =>
                    update("ambassadors", {
                      ...content.ambassadors,
                      items: updateItem(content.ambassadors.items, i, { badge: e.target.value }),
                    })
                  }
                />
              </div>
              <Field
                label="Description"
                value={item.desc}
                onChange={(e) =>
                  update("ambassadors", {
                    ...content.ambassadors,
                    items: updateItem(content.ambassadors.items, i, { desc: e.target.value }),
                  })
                }
              />
              <ImagePicker
                label="Image"
                folder="homepage/ambassadors"
                value={item.image}
                onChange={(url) =>
                  update("ambassadors", {
                    ...content.ambassadors,
                    items: updateItem(content.ambassadors.items, i, { image: url }),
                  })
                }
              />
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              update("ambassadors", {
                ...content.ambassadors,
                items: [
                  ...content.ambassadors.items,
                  {
                    id: `amb-${Date.now()}`,
                    title: "NEW DIVISION",
                    desc: "",
                    image: "",
                    badge: "",
                  },
                ],
              })
            }
            className="w-full bg-white/5 text-white/60 hover:bg-white/10 font-bebas tracking-widest"
          >
            <Plus className="mr-2 h-4 w-4" /> ADD DIVISION
          </Button>
        </div>

        <Field
          label="Button Text"
          value={content.ambassadors.cta.text}
          onChange={(e) =>
            update("ambassadors", { ...content.ambassadors, cta: { text: e.target.value } })
          }
        />
      </SectionCard>

      {/* Wellness */}
      <SectionCard
        title="WELLNESS & PHYSIOLOGY"
        saving={savingKey === "wellness"}
        saved={savedKey === "wellness"}
        onSave={() => save("wellness")}
      >
        <Field
          label="Supertitle"
          value={content.wellness.supertitle}
          onChange={(e) => update("wellness", { ...content.wellness, supertitle: e.target.value })}
        />
        <Field
          label="Title"
          value={content.wellness.title}
          onChange={(e) => update("wellness", { ...content.wellness, title: e.target.value })}
        />
        <TextAreaField
          label="Body"
          value={content.wellness.body}
          onChange={(v) => update("wellness", { ...content.wellness, body: v })}
        />
        <Field
          label="Button Text"
          value={content.wellness.cta.text}
          onChange={(e) => update("wellness", { ...content.wellness, cta: { text: e.target.value } })}
        />
      </SectionCard>

      {/* Armory header */}
      <SectionCard
        title="ARMORY SHOP HEADER"
        hint="Just the section heading — products themselves are managed under Armory Shop."
        saving={savingKey === "armory"}
        saved={savedKey === "armory"}
        onSave={() => save("armory")}
      >
        <Field
          label="Supertitle"
          value={content.armory.supertitle}
          onChange={(e) => update("armory", { ...content.armory, supertitle: e.target.value })}
        />
        <Field
          label="Title"
          value={content.armory.title}
          onChange={(e) => update("armory", { ...content.armory, title: e.target.value })}
        />
      </SectionCard>

      {/* News header */}
      <SectionCard
        title="NEWS SECTION HEADER"
        hint="Just the section heading — articles are managed under News & Media."
        saving={savingKey === "news"}
        saved={savedKey === "news"}
        onSave={() => save("news")}
      >
        <Field
          label="Title"
          value={content.news.title}
          onChange={(e) => update("news", { title: e.target.value })}
        />
      </SectionCard>

      {/* Partnerships */}
      <SectionCard
        title="AFFILIATION & PARTNERS"
        saving={savingKey === "partnerships"}
        saved={savedKey === "partnerships"}
        onSave={() => save("partnerships")}
      >
        <Field
          label="Title"
          value={content.partnerships.title}
          onChange={(e) => update("partnerships", { ...content.partnerships, title: e.target.value })}
        />
        <TextAreaField
          label="Body"
          value={content.partnerships.body}
          onChange={(v) => update("partnerships", { ...content.partnerships, body: v })}
        />
        <Field
          label="Button Text"
          value={content.partnerships.cta.text}
          onChange={(e) =>
            update("partnerships", { ...content.partnerships, cta: { text: e.target.value } })
          }
        />
      </SectionCard>

      {/* Final CTA */}
      <SectionCard
        title="FINAL CALL TO ACTION"
        saving={savingKey === "contactCta"}
        saved={savedKey === "contactCta"}
        onSave={() => save("contactCta")}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Primary Button Text"
            value={content.contactCta.passesBtn.text}
            onChange={(e) =>
              update("contactCta", {
                ...content.contactCta,
                passesBtn: { text: e.target.value },
              })
            }
          />
          <Field
            label="Secondary Button Text"
            value={content.contactCta.contactBtn.text}
            onChange={(e) =>
              update("contactCta", {
                ...content.contactCta,
                contactBtn: { text: e.target.value },
              })
            }
          />
        </div>
        <p className="text-white/30 text-[11px]">
          The heading &ldquo;READY FOR THE STAGE?&rdquo; is fixed in the page design and isn&apos;t
          editable here.
        </p>
      </SectionCard>
    </div>
  );
}

function ImagePicker({
  label,
  folder,
  value,
  onChange,
}: {
  label: string;
  folder: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadPublicMedia(folder, file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-white/50 text-xs">{label}</Label>
      <div className="flex gap-3 items-start">
        {value && (
          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-white/10 flex-shrink-0">
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block w-full text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-white/10 file:text-white file:font-sans file:text-xs hover:file:bg-wff-red cursor-pointer"
          />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className={inputClass}
          />
          {uploading && <p className="text-white/30 text-[11px]">Uploading…</p>}
          {error && <p className="text-wff-red text-[11px]">{error}</p>}
        </div>
      </div>
    </div>
  );
}
