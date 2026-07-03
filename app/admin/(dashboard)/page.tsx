"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, ShoppingCart, UserCheck } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="font-bebas text-4xl mb-8">DASHBOARD OVERVIEW</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Registered Athletes</CardTitle>
            <Users className="h-4 w-4 text-wff-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-bebas">24</div>
            <p className="text-xs text-white/40 mt-1">+2 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-wff-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-bebas">1</div>
            <p className="text-xs text-white/40 mt-1">2026 All Africa Championship</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Shop Products</CardTitle>
            <ShoppingCart className="h-4 w-4 text-wff-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-bebas">8</div>
            <p className="text-xs text-white/40 mt-1">Active inventory items</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">VIP Tickets Sold</CardTitle>
            <UserCheck className="h-4 w-4 text-wff-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-bebas">142</div>
            <p className="text-xs text-white/40 mt-1">Goal: 500</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
