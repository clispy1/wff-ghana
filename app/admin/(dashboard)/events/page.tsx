"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    venue_name: "",
    venue_location: "",
    description: ""
  });

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await supabase.from('events').update(formData).eq('id', editId);
    } else {
      await supabase.from('events').insert([formData]);
    }
    setIsOpen(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await supabase.from('events').delete().eq('id', id);
      fetchEvents();
    }
  };

  const openEdit = (event: any) => {
    setEditId(event.id);
    setFormData({
      title: event.title,
      start_date: event.start_date,
      end_date: event.end_date,
      venue_name: event.venue_name || "",
      venue_location: event.venue_location || "",
      description: event.description || ""
    });
    setIsOpen(true);
  };

  const openNew = () => {
    setEditId(null);
    setFormData({ title: "", start_date: "", end_date: "", venue_name: "", venue_location: "", description: "" });
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="font-bebas text-4xl text-white">EVENTS & LOGISTICS</h2>
        
        {/* The dialog is controlled by `isOpen`, so the button just opens
            it — no DialogTrigger needed (Base UI has no `asChild`). */}
        <Button onClick={openNew} className="bg-wff-red hover:bg-white hover:text-black font-bebas tracking-widest">
          <Plus className="mr-2 h-4 w-4" /> NEW EVENT
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-[#111] text-white border-white/10 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-bebas text-3xl tracking-widest text-wff-gold">
                {editId ? 'EDIT EVENT' : 'CREATE NEW EVENT'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Event Title</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="bg-black border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required className="bg-black border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required className="bg-black border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Venue Name</Label>
                <Input value={formData.venue_name} onChange={e => setFormData({...formData, venue_name: e.target.value})} className="bg-black border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Venue Location</Label>
                <Input value={formData.venue_location} onChange={e => setFormData({...formData, venue_location: e.target.value})} className="bg-black border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border-white/10" />
              </div>
              <Button type="submit" className="w-full bg-wff-gold text-black hover:bg-white font-bebas tracking-widest">SAVE CONFIGURATION</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-black/40">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest hover:bg-transparent cursor-default">Title</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest hover:bg-transparent cursor-default">Dates</TableHead>
              <TableHead className="text-white/40 uppercase font-bold text-[10px] tracking-widest hover:bg-transparent cursor-default">Venue</TableHead>
              <TableHead className="text-right text-white/40 uppercase font-bold text-[10px] tracking-widest hover:bg-transparent cursor-default">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8 text-white/40 font-sans text-xs">Loading data...</TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="text-center py-8 text-white/40 font-sans text-xs">No events found.</TableCell>
              </TableRow>
            ) : (
              events.map((evt) => (
                <TableRow key={evt.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="font-bold text-white">{evt.title}</TableCell>
                  <TableCell className="text-white/60 font-mono text-xs">{evt.start_date} to {evt.end_date}</TableCell>
                  <TableCell className="text-white/60">{evt.venue_name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(evt)} className="text-white/40 hover:text-wff-gold hover:bg-transparent mr-2">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(evt.id)} className="text-white/40 hover:text-wff-red hover:bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
