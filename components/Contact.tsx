'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  enquiryType: z.string().min(1, 'Please select an enquiry type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      reset();
    }, 5000);
  };

  return (
    <section id="contact" className="py-24 bg-wff-dark relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="font-bebas text-5xl md:text-7xl mb-6">GET IN <span className="text-wff-red">TOUCH</span></h2>
            <p className="font-sans text-white/70 text-lg mb-12 max-w-md">
              Have questions about the qualifiers, sponsorship opportunities, or general inquiries? Reach out to the WFF Ghana executive team.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start">
                <MapPin className="text-wff-red mr-4 mt-1" size={24} />
                <div>
                  <h4 className="font-bebas text-2xl mb-1">Headquarters</h4>
                  <p className="font-sans text-white/60">Sports Directorate Building<br />Accra Sports Stadium<br />Accra, Ghana</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-wff-red mr-4 mt-1" size={24} />
                <div>
                  <h4 className="font-bebas text-2xl mb-1">Email</h4>
                  <p className="font-sans text-white/60">info@wffghana.com<br />athletes@wffghana.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="text-wff-red mr-4 mt-1" size={24} />
                <div>
                  <h4 className="font-bebas text-2xl mb-1">Phone</h4>
                  <p className="font-sans text-white/60">+233 24 123 4567<br />+233 20 987 6543</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 className="font-bebas text-2xl mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-wff-red hover:border-wff-red transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-wff-red hover:border-wff-red transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-wff-red hover:border-wff-red transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#111] border border-white/10 p-8 md:p-12 relative overflow-hidden">
            {isSuccess ? (
              <div className="absolute inset-0 bg-[#111] flex flex-col items-center justify-center text-center p-8 z-10">
                <CheckCircle size={64} className="text-wff-red mb-6" />
                <h3 className="font-bebas text-4xl mb-4">MESSAGE SENT</h3>
                <p className="font-sans text-white/70">Thank you for reaching out. A member of our team will get back to you shortly.</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-0">
              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Name</label>
                <input 
                  {...register('name')}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                  placeholder="Your Name"
                />
                {errors.name && <span className="text-wff-red text-xs mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
                <input 
                  {...register('email')}
                  type="email"
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
                {errors.email && <span className="text-wff-red text-xs mt-1 block">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Enquiry Type</label>
                <select 
                  {...register('enquiryType')}
                  className="w-full bg-[#111] border-b border-white/20 py-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                >
                  <option value="">Select a topic</option>
                  <option value="athlete">Athlete Registration</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="press">Press / Media</option>
                  <option value="general">General Enquiry</option>
                </select>
                {errors.enquiryType && <span className="text-wff-red text-xs mt-1 block">{errors.enquiryType.message}</span>}
              </div>

              <div>
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Message</label>
                <textarea 
                  {...register('message')}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-wff-red focus:outline-none transition-colors resize-none"
                  placeholder="How can we help you?"
                ></textarea>
                {errors.message && <span className="text-wff-red text-xs mt-1 block">{errors.message.message}</span>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-wff-dark font-bebas text-xl py-4 hover:bg-wff-red hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
