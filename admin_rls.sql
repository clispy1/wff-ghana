-- Allow authenticated users (Admin) full access to all dynamic CMS tables
-- You MUST run this in the Supabase SQL Editor if you want your Admin Dashboard to be able to save/edit data!

CREATE POLICY "Admin All Access Events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Staff" ON public.federation_staff FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Sponsors" ON public.sponsors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access News" ON public.news_articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Accommodations" ON public.accommodations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Memberships" ON public.memberships FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Ticket Tiers" ON public.ticket_tiers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Products" ON public.ecommerce_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
