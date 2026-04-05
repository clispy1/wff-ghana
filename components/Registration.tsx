'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { UploadCloud, CheckCircle } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  category: z.string().min(1, 'Category is required'),
  weightClass: z.string().min(1, 'Weight class is required'),
  experience: z.string().min(1, 'Experience is required'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Registration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Fire confetti
    const duration = 3000;
    const end = new Date().getTime() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#CC0000', '#D4AF37', '#FFFFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#CC0000', '#D4AF37', '#FFFFFF']
      });

      if (new Date().getTime() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="register" className="py-24 bg-wff-dark relative border-t border-white/5">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-wff-red/5 blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-5xl md:text-7xl mb-4">JOIN <span className="text-wff-red">TEAM GHANA</span></h2>
            <p className="font-sans text-white/70 text-lg">Register your intent to compete in the upcoming national qualifiers. The road to Cameroon starts here.</p>
          </div>

          {isSuccess ? (
            <div className="bg-[#111] border border-wff-red p-12 text-center flex flex-col items-center">
              <CheckCircle size={64} className="text-wff-red mb-6" />
              <h3 className="font-bebas text-4xl mb-4">WELCOME TO TEAM GHANA</h3>
              <p className="font-sans text-white/70 mb-8">Your registration has been received. We will review your details and contact you with the next steps for the qualifiers.</p>
              <button 
                onClick={() => { setIsSuccess(false); reset(); setFileName(''); }}
                className="bg-white text-wff-dark font-bebas text-xl px-8 py-3 hover:bg-wff-red hover:text-white transition-colors"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-[#111] border border-white/10 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Full Name</label>
                  <input 
                    {...register('fullName')}
                    className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <span className="text-wff-red text-xs mt-1 block">{errors.fullName.message}</span>}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Email</label>
                  <input 
                    {...register('email')}
                    type="email"
                    className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-wff-red text-xs mt-1 block">{errors.email.message}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Phone</label>
                  <input 
                    {...register('phone')}
                    className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                    placeholder="+233 20 123 4567"
                  />
                  {errors.phone && <span className="text-wff-red text-xs mt-1 block">{errors.phone.message}</span>}
                </div>

                {/* DOB */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Date of Birth</label>
                  <input 
                    {...register('dob')}
                    type="date"
                    className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  {errors.dob && <span className="text-wff-red text-xs mt-1 block">{errors.dob.message}</span>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Gender</label>
                  <select 
                    {...register('gender')}
                    className="w-full bg-[#111] border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <span className="text-wff-red text-xs mt-1 block">{errors.gender.message}</span>}
                </div>

                {/* Category */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Competition Category</label>
                  <select 
                    {...register('category')}
                    className="w-full bg-[#111] border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                  >
                    <option value="">Select Category</option>
                    <option value="mens-bodybuilding">Men&apos;s Bodybuilding</option>
                    <option value="womens-bodybuilding">Women&apos;s Bodybuilding</option>
                    <option value="bikini">Bikini</option>
                    <option value="classic-physique">Classic Physique</option>
                    <option value="sports-modelling">Sports Modelling</option>
                    <option value="fitness">Fitness</option>
                  </select>
                  {errors.category && <span className="text-wff-red text-xs mt-1 block">{errors.category.message}</span>}
                </div>

                {/* Weight Class */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Weight Class / Height</label>
                  <input 
                    {...register('weightClass')}
                    className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                    placeholder="e.g. Under 80kg / Over 175cm"
                  />
                  {errors.weightClass && <span className="text-wff-red text-xs mt-1 block">{errors.weightClass.message}</span>}
                </div>

                {/* Experience */}
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Years of Experience</label>
                  <select 
                    {...register('experience')}
                    className="w-full bg-[#111] border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">0-1 Years (Novice)</option>
                    <option value="2-4">2-4 Years</option>
                    <option value="5+">5+ Years</option>
                    <option value="pro">Pro Status</option>
                  </select>
                  {errors.experience && <span className="text-wff-red text-xs mt-1 block">{errors.experience.message}</span>}
                </div>
              </div>

              {/* Photo Upload (Simulated) */}
              <div className="mb-6">
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Current Physique Photo</label>
                <div 
                  className="border-2 border-dashed border-white/20 p-8 text-center hover:border-wff-red/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="mx-auto mb-4 text-white/50" size={32} />
                  <p className="font-sans text-sm text-white/70 mb-2">
                    {fileName ? fileName : 'Click to upload or drag and drop'}
                  </p>
                  <p className="font-sans text-xs text-white/40">JPG, PNG up to 5MB (Simulated)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-8">
                <label className="block font-sans text-xs uppercase tracking-widest text-white/50 mb-2">Additional Message (Optional)</label>
                <textarea 
                  {...register('message')}
                  rows={4}
                  className="w-full bg-transparent border border-white/20 p-3 text-white focus:border-wff-red focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your competitive history..."
                ></textarea>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-wff-red text-white font-bebas text-2xl py-4 hover:bg-white hover:text-wff-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'SUBMIT REGISTRATION'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
