'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import {
  User, Trophy, Users, FileText, CreditCard,
  Upload, CheckCircle, ChevronRight, ChevronLeft,
  Camera, Shield, AlertCircle, Instagram, Facebook,
  Phone, MapPin, Plane, X, Check
} from 'lucide-react';

// ─────────────────────────────────────────────
// STEP DEFINITIONS
// ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Personal',     icon: User },
  { id: 2, label: 'Competition',  icon: Trophy },
  { id: 3, label: 'Team / Club',  icon: Users },
  { id: 4, label: 'Documents',    icon: FileText },
  { id: 5, label: 'Payment',      icon: CreditCard },
];

// ─────────────────────────────────────────────
// ZOD SCHEMA
// ─────────────────────────────────────────────
const schema = z.object({
  // Step 1 — Personal
  firstName:           z.string().min(2, 'First name is required'),
  lastName:            z.string().min(2, 'Last name is required'),
  middleName:          z.string().optional(),
  gender:              z.string().min(1, 'Gender is required'),
  dob:                 z.string().min(1, 'Date of birth is required'),
  nationality:         z.string().min(2, 'Nationality is required'),
  countryRepresenting: z.string().min(2, 'Country representing is required'),
  passportNumber:      z.string().optional(),
  nationalId:          z.string().optional(),
  email:               z.string().email('Invalid email address'),
  mobile:              z.string().min(10, 'Valid mobile number required'),
  whatsapp:            z.string().optional(),
  address:             z.string().min(5, 'Residential address is required'),
  city:                z.string().min(2, 'City is required'),
  country:             z.string().min(2, 'Country is required'),

  // Step 2 — Competition
  athleteType:         z.string().min(1, 'Athlete type is required'),
  category:            z.string().min(1, 'Category is required'),
  division:            z.string().min(1, 'Division is required'),
  weightClass:         z.string().optional(),
  heightClass:         z.string().optional(),

  // Step 3 — Team / Club
  teamName:            z.string().optional(),
  clubName:            z.string().optional(),
  teamCountry:         z.string().optional(),
  coachName:           z.string().optional(),
  managerName:         z.string().optional(),
  managerContact:      z.string().optional(),
  federationAffiliation: z.string().optional(),

  // Step 4 — Documents / Medical
  medicalDeclaration:  z.boolean().refine(v => v === true, 'You must confirm your medical fitness'),
  fitnessDeclaration:  z.boolean().refine(v => v === true, 'You must confirm your fitness declaration'),

  // Step 5 — Payment
  feePaid:             z.string().min(1, 'Please indicate payment status'),
  paymentMethod:       z.string().optional(),
  transactionId:       z.string().optional(),
  paystackRef:         z.string().optional(),

  // Additional
  emergencyName:       z.string().min(2, 'Emergency contact name required'),
  emergencyRelation:   z.string().min(2, 'Relationship required'),
  emergencyPhone:      z.string().min(10, 'Emergency phone required'),
  instagram:           z.string().optional(),
  facebook:            z.string().optional(),
  tiktok:              z.string().optional(),
  arrivalDate:         z.string().optional(),
  departureDate:       z.string().optional(),
  needsPickup:         z.string().optional(),
  needsAccommodation:  z.string().optional(),
  mediaConsent:        z.boolean().optional(),
  termsAgreed:         z.boolean().refine(v => v === true, 'You must agree to the terms and conditions'),
});

type FormData = z.infer<typeof schema>;

// ─────────────────────────────────────────────
// REUSABLE FIELD COMPONENTS
// ─────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">
    {children}
  </label>
);

const RequiredMark = () => <span className="text-wff-red ml-1">*</span>;

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <span className="flex items-center gap-1 text-wff-red text-xs mt-1.5">
      <AlertCircle size={11} /> {message}
    </span>
  ) : null;

const inputClass =
  'w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-wff-red/70 focus:outline-none focus:bg-white/8 transition-all duration-200';

const selectClass =
  'w-full bg-[#0d0d0d] border border-white/10 px-4 py-3 text-sm text-white focus:border-wff-red/70 focus:outline-none transition-all duration-200 appearance-none cursor-pointer';

interface FileUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  hint?: string;
  fileName?: string;
  onChange: (file: File | null) => void;
}
const FileUpload = ({ label, required, accept = 'image/*', hint, fileName, onChange }: FileUploadProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label>{label}{required && <RequiredMark />}</Label>
      <div
        onClick={() => ref.current?.click()}
        className="border border-dashed border-white/15 p-5 text-center cursor-pointer hover:border-wff-red/50 hover:bg-white/3 transition-all duration-200 group"
      >
        <Upload size={20} className="mx-auto mb-2 text-white/30 group-hover:text-wff-red/60 transition-colors" />
        <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
          {fileName || 'Click to upload'}
        </p>
        {hint && <p className="text-[10px] text-white/25 mt-1">{hint}</p>}
        <input type="file" ref={ref} className="hidden" accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} />
      </div>
    </div>
  );
};

interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  error?: string;
}
const CheckboxField = ({ id, checked, onChange, label, sublabel, error }: CheckboxFieldProps) => (
  <div>
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <div
        className={`mt-0.5 w-5 h-5 flex-shrink-0 border flex items-center justify-center transition-all duration-200 ${
          checked ? 'bg-wff-red border-wff-red' : 'border-white/20 group-hover:border-wff-red/50'
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check size={12} className="text-white" />}
      </div>
      <div>
        <p className="text-sm text-white/80 leading-snug">{label}</p>
        {sublabel && <p className="text-xs text-white/40 mt-0.5">{sublabel}</p>}
      </div>
    </label>
    <FieldError message={error} />
  </div>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="font-bebas text-xl text-white/50 tracking-widest uppercase border-b border-white/8 pb-2 mb-5 mt-8 first:mt-0">
    {children}
  </h4>
);

const RadioGroup = ({
  label, name, options, value, onChange, required, error
}: {
  label: string; name: string; options: { value: string; label: string }[];
  value: string; onChange: (v: string) => void; required?: boolean; error?: string;
}) => (
  <div>
    <Label>{label}{required && <RequiredMark />}</Label>
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 text-xs font-sans border transition-all duration-200 ${
            value === opt.value
              ? 'bg-wff-red border-wff-red text-white'
              : 'border-white/15 text-white/50 hover:border-wff-red/40 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
    <FieldError message={error} />
  </div>
);

// ─────────────────────────────────────────────
// STEP PANELS
// ─────────────────────────────────────────────

// ── STEP 1: PERSONAL INFORMATION ──
function Step1({ register, errors, watch, setValue, files, onFileChange }: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<FormData>>['watch'];
  setValue: ReturnType<typeof useForm<FormData>>['setValue'];
  files: Record<string, File | null>;
  onFileChange: (key: string, file: File | null) => void;
}) {

  return (
    <div className="space-y-0">
      <SectionHeading>Identity</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>First Name <RequiredMark /></Label>
          <input {...register('firstName')} className={inputClass} placeholder="Kwame" />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label>Last Name <RequiredMark /></Label>
          <input {...register('lastName')} className={inputClass} placeholder="Mensah" />
          <FieldError message={errors.lastName?.message} />
        </div>
        <div>
          <Label>Middle Name</Label>
          <input {...register('middleName')} className={inputClass} placeholder="Optional" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Gender <RequiredMark /></Label>
          <select {...register('gender')} className={selectClass}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <FieldError message={errors.gender?.message} />
        </div>
        <div>
          <Label>Date of Birth <RequiredMark /></Label>
          <input
            {...register('dob')}
            type="date"
            className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-30`}
          />
          <FieldError message={errors.dob?.message} />
        </div>
        <div>
          <Label>Nationality <RequiredMark /></Label>
          <input {...register('nationality')} className={inputClass} placeholder="Ghanaian" />
          <FieldError message={errors.nationality?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Country Representing <RequiredMark /></Label>
          <input {...register('countryRepresenting')} className={inputClass} placeholder="Ghana" />
          <FieldError message={errors.countryRepresenting?.message} />
        </div>
        <div>
          <Label>Passport Number <span className="text-white/30 ml-1 normal-case text-[9px]">International</span></Label>
          <input {...register('passportNumber')} className={inputClass} placeholder="G12345678" />
        </div>
        <div>
          <Label>National ID</Label>
          <input {...register('nationalId')} className={inputClass} placeholder="GHA-000000000-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
        <FileUpload
          label="Passport Photo"
          required
          hint="JPEG / PNG · Max 2MB · White background preferred"
          fileName={files.passportPhoto?.name || ''}
          onChange={f => onFileChange('passportPhoto', f)}
        />
        <FileUpload
          label="Athlete Photo"
          required
          hint="Full-face, competition or gym photo"
          fileName={files.athletePhoto?.name || ''}
          onChange={f => onFileChange('athletePhoto', f)}
        />
      </div>

      <SectionHeading>Contact Details</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Email Address <RequiredMark /></Label>
          <input {...register('email')} type="email" className={inputClass} placeholder="athlete@email.com" />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label>Mobile Number <RequiredMark /></Label>
          <input {...register('mobile')} className={inputClass} placeholder="+233 20 123 4567" />
          <FieldError message={errors.mobile?.message} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>WhatsApp Number</Label>
          <input {...register('whatsapp')} className={inputClass} placeholder="+233 20 123 4567" />
        </div>
        <div className="sm:col-span-2">
          <Label>Residential Address <RequiredMark /></Label>
          <input {...register('address')} className={inputClass} placeholder="House No., Street Name" />
          <FieldError message={errors.address?.message} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>City <RequiredMark /></Label>
          <input {...register('city')} className={inputClass} placeholder="Accra" />
          <FieldError message={errors.city?.message} />
        </div>
        <div>
          <Label>Country <RequiredMark /></Label>
          <input {...register('country')} className={inputClass} placeholder="Ghana" />
          <FieldError message={errors.country?.message} />
        </div>
      </div>
    </div>
  );
}

// ── STEP 2: COMPETITION INFORMATION ──
function Step2({ register, errors, watch, setValue }: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<FormData>>['watch'];
  setValue: ReturnType<typeof useForm<FormData>>['setValue'];
}) {
  const athleteType = watch('athleteType') || '';
  const category    = watch('category') || '';
  const division    = watch('division') || '';
  const weightClass = watch('weightClass') || '';

  const CATEGORIES: Record<string, { label: string; value: string }[]> = {
    men: [
      { value: 'mens-bodybuilding', label: "Men's Bodybuilding" },
      { value: 'mens-physique',     label: "Men's Physique" },
      { value: 'classic-physique',  label: 'Classic Physique' },
    ],
    women: [
      { value: 'womens-bikini',   label: "Women's Bikini" },
      { value: 'womens-fitness',  label: "Women's Fitness" },
      { value: 'womens-figure',   label: "Women's Figure" },
    ],
  };

  const ALL_CATS = [...(CATEGORIES.men), ...(CATEGORIES.women)];

  const isBodybuilding = ['mens-bodybuilding', 'classic-physique'].includes(category);
  const isPhysique     = ['mens-physique', 'womens-bikini', 'womens-fitness', 'womens-figure'].includes(category);

  return (
    <div>
      <SectionHeading>Athlete Type</SectionHeading>
      <RadioGroup
        label="I am competing as"
        name="athleteType"
        required
        value={athleteType}
        onChange={v => setValue('athleteType', v)}
        error={errors.athleteType?.message}
        options={[
          { value: 'individual', label: 'Individual Athlete' },
          { value: 'club',       label: 'Club Athlete' },
          { value: 'national',   label: 'National Team Athlete' },
        ]}
      />

      <SectionHeading>Category</SectionHeading>
      <div className="mb-5">
        <Label>Men&apos;s Categories</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.men.map(c => (
            <button
              key={c.value} type="button"
              onClick={() => setValue('category', c.value)}
              className={`px-4 py-2 text-xs font-sans border transition-all duration-200 ${
                category === c.value
                  ? 'bg-wff-red border-wff-red text-white'
                  : 'border-white/15 text-white/50 hover:border-wff-red/40 hover:text-white'
              }`}
            >{c.label}</button>
          ))}
        </div>
        <Label>Women&apos;s Categories</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.women.map(c => (
            <button
              key={c.value} type="button"
              onClick={() => setValue('category', c.value)}
              className={`px-4 py-2 text-xs font-sans border transition-all duration-200 ${
                category === c.value
                  ? 'bg-wff-red border-wff-red text-white'
                  : 'border-white/15 text-white/50 hover:border-wff-red/40 hover:text-white'
              }`}
            >{c.label}</button>
          ))}
        </div>
        <FieldError message={errors.category?.message} />
      </div>

      <SectionHeading>Division</SectionHeading>
      <RadioGroup
        label="Division"
        name="division"
        required
        value={division}
        onChange={v => setValue('division', v)}
        error={errors.division?.message}
        options={[
          { value: 'junior',  label: 'Junior (Under 23)' },
          { value: 'senior',  label: 'Senior' },
          { value: 'masters', label: 'Masters (40+)' },
        ]}
      />

      {isBodybuilding && (
        <>
          <SectionHeading>Weight Class</SectionHeading>
          <RadioGroup
            label="Select your weight class"
            name="weightClass"
            value={weightClass}
            onChange={v => setValue('weightClass', v)}
            options={[
              { value: 'u70',  label: 'Up to 70kg' },
              { value: '70-80', label: '70 – 80kg' },
              { value: '80-90', label: '80 – 90kg' },
              { value: '90+',  label: '90kg+' },
            ]}
          />
        </>
      )}

      {isPhysique && (
        <>
          <SectionHeading>Height Class</SectionHeading>
          <div>
            <Label>Height Class</Label>
            <input
              {...register('heightClass')}
              className={inputClass}
              placeholder="e.g. Under 175cm"
            />
          </div>
        </>
      )}
    </div>
  );
}

// ── STEP 3: TEAM / CLUB INFORMATION ──
function Step3({ register, errors }: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
}) {
  return (
    <div>
      <SectionHeading>Team & Club</SectionHeading>
      <p className="text-sm text-white/40 mb-6">Only required if competing as a Club or National Team athlete. Leave blank if individual.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Team Name</Label>
          <input {...register('teamName')} className={inputClass} placeholder="Team Strength Ghana" />
        </div>
        <div>
          <Label>Club Name</Label>
          <input {...register('clubName')} className={inputClass} placeholder="Iron Temple GH" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Team / Club Country</Label>
          <input {...register('teamCountry')} className={inputClass} placeholder="Ghana" />
        </div>
        <div>
          <Label>Federation Affiliation</Label>
          <input {...register('federationAffiliation')} className={inputClass} placeholder="WFF Ghana" />
        </div>
      </div>

      <SectionHeading>Coaching Staff</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Coach Name</Label>
          <input {...register('coachName')} className={inputClass} placeholder="Coach John Doe" />
        </div>
        <div>
          <Label>Team Manager Name</Label>
          <input {...register('managerName')} className={inputClass} placeholder="Jane Smith" />
        </div>
        <div>
          <Label>Manager Contact</Label>
          <input {...register('managerContact')} className={inputClass} placeholder="+233 20 000 0000" />
        </div>
      </div>
    </div>
  );
}

// ── STEP 4: DOCUMENTS & VERIFICATION ──
function Step4({ register, errors, watch, setValue, files, onFileChange }: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<FormData>>['watch'];
  setValue: ReturnType<typeof useForm<FormData>>['setValue'];
  files: Record<string, File | null>;
  onFileChange: (key: string, file: File | null) => void;
}) {
  const medicalDeclaration = watch('medicalDeclaration') || false;
  const fitnessDeclaration = watch('fitnessDeclaration') || false;

  const handleFile = (key: string) => (f: File | null) => {
    onFileChange(key, f);
  };

  return (
    <div>
      <SectionHeading>Required Documents</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
        <FileUpload label="Passport Copy" required hint="First page with photo · PDF or JPEG"
          fileName={files.passport?.name || ''} onChange={handleFile('passport')} accept="image/*,.pdf" />
        <FileUpload label="National ID" hint="Government-issued national ID card"
          fileName={files.nationalId?.name || ''} onChange={handleFile('nationalId')} accept="image/*,.pdf" />
        <FileUpload label="Athlete Headshot" required hint="Professional headshot, plain background"
          fileName={files.headshot?.name || ''} onChange={handleFile('headshot')} />
        <FileUpload label="Full Body Competition Photo" required hint="Recent competition or stage photo"
          fileName={files.fullBody?.name || ''} onChange={handleFile('fullBody')} />
      </div>

      <SectionHeading>Optional Documents</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
        <FileUpload label="Previous Competition Photos" hint="Up to 3 photos · ZIP or individual"
          fileName={files.prevPhotos?.name || ''} onChange={handleFile('prevPhotos')} />
        <FileUpload label="Championship Certificates" hint="PDF preferred · Previous wins & placements"
          fileName={files.certs?.name || ''} onChange={handleFile('certs')} accept="image/*,.pdf" />
      </div>

      <SectionHeading>Medical Declarations</SectionHeading>
      <div className="space-y-4 p-5 border border-white/8 bg-white/2">
        <CheckboxField
          id="medicalDeclaration"
          checked={medicalDeclaration}
          onChange={v => setValue('medicalDeclaration', v)}
          label="I confirm that I am medically fit to compete in this championship."
          sublabel="I have no known medical conditions that would prevent safe participation."
          error={errors.medicalDeclaration?.message}
        />
        <CheckboxField
          id="fitnessDeclaration"
          checked={fitnessDeclaration}
          onChange={v => setValue('fitnessDeclaration', v)}
          label="I declare that I am in peak physical condition and ready to compete."
          sublabel="I take full personal responsibility for my participation and physical wellbeing."
          error={errors.fitnessDeclaration?.message}
        />
      </div>
    </div>
  );
}

// ── STEP 5: PAYMENT INFORMATION ──
function Step5({ register, errors, watch, setValue, files, onFileChange }: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<FormData>>['watch'];
  setValue: ReturnType<typeof useForm<FormData>>['setValue'];
  files: Record<string, File | null>;
  onFileChange: (key: string, file: File | null) => void;
}) {
  const feePaid       = watch('feePaid') || '';
  const paymentMethod = watch('paymentMethod') || '';

  return (
    <div>
      <SectionHeading>Registration Fee</SectionHeading>

      <div className="p-5 border border-wff-gold/20 bg-wff-gold/5 mb-6 flex items-start gap-3">
        <CreditCard size={20} className="text-wff-gold mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bebas tracking-wider text-wff-gold text-lg leading-none">Registration Fee: ₵ 500.00 / $45 USD</p>
          <p className="text-xs text-white/40 mt-1">Fee covers registration, competition bib, and entry into all judging rounds for your selected category.</p>
        </div>
      </div>

      <RadioGroup
        label="Has the fee been paid?"
        name="feePaid"
        required
        value={feePaid}
        onChange={v => setValue('feePaid', v)}
        error={errors.feePaid?.message}
        options={[
          { value: 'paid',    label: 'Yes, paid' },
          { value: 'pending', label: 'Not yet — will pay' },
        ]}
      />

      {feePaid === 'paid' && (
        <div className="mt-6 space-y-4">
          <SectionHeading>Payment Details</SectionHeading>
          <RadioGroup
            label="Payment Method"
            name="paymentMethod"
            value={paymentMethod}
            onChange={v => setValue('paymentMethod', v)}
            options={[
              { value: 'paystack',     label: 'Paystack' },
              { value: 'mobile-money', label: 'Mobile Money' },
              { value: 'bank-transfer',label: 'Bank Transfer' },
              { value: 'cash',         label: 'Cash' },
            ]}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Transaction / Reference ID</Label>
              <input {...register('transactionId')} className={inputClass} placeholder="TXN-XXXXXXXX" />
            </div>
            {paymentMethod === 'paystack' && (
              <div>
                <Label>Paystack Reference ID</Label>
                <input {...register('paystackRef')} className={inputClass} placeholder="pay_XXXXXXXXXXXXXXXX" />
              </div>
            )}
          </div>
          <FileUpload
            label="Payment Screenshot / Receipt"
            hint="JPEG or PNG · Clear screenshot of payment confirmation"
            fileName={files.paymentScreenshot?.name || ''}
            onChange={f => onFileChange('paymentScreenshot', f)}
          />
        </div>
      )}

      <SectionHeading>Emergency Contact</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-0">
        <div>
          <Label>Full Name <RequiredMark /></Label>
          <input {...register('emergencyName')} className={inputClass} placeholder="Jane Mensah" />
          <FieldError message={errors.emergencyName?.message} />
        </div>
        <div>
          <Label>Relationship <RequiredMark /></Label>
          <input {...register('emergencyRelation')} className={inputClass} placeholder="Spouse / Parent / Sibling" />
          <FieldError message={errors.emergencyRelation?.message} />
        </div>
        <div>
          <Label>Phone Number <RequiredMark /></Label>
          <input {...register('emergencyPhone')} className={inputClass} placeholder="+233 24 000 0000" />
          <FieldError message={errors.emergencyPhone?.message} />
        </div>
      </div>

      <SectionHeading>Social Media <span className="text-white/30 text-sm normal-case ml-2 font-sans font-normal">Used for competition promotion</span></SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-0">
        <div>
          <Label><Instagram size={11} className="inline mr-1.5 -mt-0.5" />Instagram</Label>
          <input {...register('instagram')} className={inputClass} placeholder="@username" />
        </div>
        <div>
          <Label><Facebook size={11} className="inline mr-1.5 -mt-0.5" />Facebook</Label>
          <input {...register('facebook')} className={inputClass} placeholder="facebook.com/username" />
        </div>
        <div>
          <Label>TikTok</Label>
          <input {...register('tiktok')} className={inputClass} placeholder="@username" />
        </div>
      </div>

      <SectionHeading>
        <Plane size={14} className="inline mr-2 -mt-0.5" />
        Logistics — All Africa Championship
      </SectionHeading>
      <p className="text-xs text-white/35 mb-4">For international athletes travelling to the event.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Arrival Date</Label>
          <input {...register('arrivalDate')} type="date"
            className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-30`} />
        </div>
        <div>
          <Label>Departure Date</Label>
          <input {...register('departureDate')} type="date"
            className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-30`} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Airport Pickup Required?</Label>
          <select {...register('needsPickup')} className={selectClass}>
            <option value="">Select</option>
            <option value="yes">Yes, I need pickup</option>
            <option value="no">No, I&apos;ll arrange my own</option>
          </select>
        </div>
        <div>
          <Label>Accommodation Required?</Label>
          <select {...register('needsAccommodation')} className={selectClass}>
            <option value="">Select</option>
            <option value="yes">Yes, please arrange</option>
            <option value="no">No, I have accommodation</option>
          </select>
        </div>
      </div>

      <SectionHeading>Consents & Agreements</SectionHeading>
      <div className="space-y-4 p-5 border border-white/8 bg-white/2">
        <CheckboxField
          id="mediaConsent"
          checked={watch('mediaConsent') || false}
          onChange={v => setValue('mediaConsent', v)}
          label="I authorize WFF Ghana to use my photographs, videos, and competition footage for promotional purposes."
          sublabel="Including social media, press releases, and official WFF Ghana publications."
        />
        <CheckboxField
          id="termsAgreed"
          checked={watch('termsAgreed') || false}
          onChange={v => setValue('termsAgreed', v)}
          label="I agree to abide by all WFF Ghana competition rules and regulations."
          sublabel="I understand that violation of these rules may result in disqualification."
          error={errors.termsAgreed?.message}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STEP FIELDS for validation
// ─────────────────────────────────────────────
const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ['firstName', 'lastName', 'gender', 'dob', 'nationality', 'countryRepresenting', 'email', 'mobile', 'address', 'city', 'country'],
  2: ['athleteType', 'category', 'division'],
  3: [],
  4: ['medicalDeclaration', 'fitnessDeclaration'],
  5: ['feePaid', 'emergencyName', 'emergencyRelation', 'emergencyPhone', 'termsAgreed'],
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function Registration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const topRef = useRef<HTMLDivElement>(null);

  const onFileChange = (key: string, file: File | null) => setFiles(prev => ({ ...prev, [key]: file }));

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger, reset } =
    useForm<FormData>({ resolver: zodResolver(schema), mode: 'onBlur' });

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const goToStep = async (next: number) => {
    if (next > currentStep) {
      const valid = await trigger(STEP_FIELDS[currentStep]);
      if (!valid) return;
    }
    setCurrentStep(next);
    scrollToTop();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const uploadFile = async (file: File | null | undefined) => {
        if (!file) return null;
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const { data: udata, error } = await supabase.storage.from('athlete-documents').upload(filename, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('athlete-documents').getPublicUrl(udata.path);
        return publicUrl;
      };

      const passportUrl = await uploadFile(files.passportPhoto || files.passport);
      const athletePhotoUrl = await uploadFile(files.athletePhoto);
      const nationalIdUrl = await uploadFile(files.nationalId);
      const headshotUrl = await uploadFile(files.headshot) || athletePhotoUrl;
      const fullBodyUrl = await uploadFile(files.fullBody);
      const prevPhotosUrl = await uploadFile(files.prevPhotos);
      const certsUrl = await uploadFile(files.certs);
      const paymentScreenshotUrl = await uploadFile(files.paymentScreenshot);

      const { error } = await supabase.from('registrations').insert({
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName || null,
        gender: data.gender,
        dob: data.dob,
        nationality: data.nationality,
        country_representing: data.countryRepresenting,
        passport_number: data.passportNumber || null,
        national_id: data.nationalId || null,
        email: data.email,
        mobile: data.mobile,
        whatsapp: data.whatsapp || null,
        address: data.address,
        city: data.city,
        country: data.country,
        athlete_type: data.athleteType,
        category: data.category,
        division: data.division,
        weight_class: data.weightClass || null,
        height_class: data.heightClass || null,
        team_name: data.teamName || null,
        club_name: data.clubName || null,
        team_country: data.teamCountry || null,
        coach_name: data.coachName || null,
        manager_name: data.managerName || null,
        manager_contact: data.managerContact || null,
        federation_affiliation: data.federationAffiliation || null,
        medical_declaration: data.medicalDeclaration,
        fitness_declaration: data.fitnessDeclaration,
        passport_url: passportUrl,
        national_id_url: nationalIdUrl,
        headshot_url: headshotUrl,
        full_body_url: fullBodyUrl,
        prev_photos_urls: prevPhotosUrl ? [prevPhotosUrl] : [],
        certs_url: certsUrl,
        fee_paid_status: data.feePaid,
        payment_method: data.paymentMethod || null,
        transaction_id: data.transactionId || null,
        paystack_ref: data.paystackRef || null,
        payment_screenshot_url: paymentScreenshotUrl,
        emergency_name: data.emergencyName,
        emergency_relation: data.emergencyRelation,
        emergency_phone: data.emergencyPhone,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        tiktok: data.tiktok || null,
        arrival_date: data.arrivalDate || null,
        departure_date: data.departureDate || null,
        needs_pickup: data.needsPickup || null,
        needs_accommodation: data.needsAccommodation || null,
        media_consent: data.mediaConsent || false,
        terms_agreed: data.termsAgreed,
      });

      if (error) throw error;
      
      setIsSubmitting(false);
      setIsSuccess(true);
      const duration = 4000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#CE1126', '#FCD116', '#FFFFFF', '#006B3F'] });
        confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#CE1126', '#FCD116', '#FFFFFF', '#006B3F'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } catch (e: any) {
      console.error(e);
      alert('Submission failed: ' + e.message);
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <section id="register" className="py-24 bg-wff-dark relative border-t border-white/5" ref={topRef}>
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-wff-red/4 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-wff-gold/3 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-wff-red mb-4">2026 All Africa Championship</p>
          <h2 className="font-bebas text-6xl md:text-8xl mb-4 leading-none">
            ATHLETE <span className="text-wff-red">REGISTRATION</span>
          </h2>
          <p className="font-sans text-white/50 text-base max-w-xl mx-auto">
            Complete all sections carefully. Accurate information ensures a smooth qualification and check-in process.
          </p>
        </div>

        {isSuccess ? (
          // ── SUCCESS STATE ──
          <div className="max-w-2xl mx-auto border border-white/10 p-12 text-center bg-[#0a0a0a]">
            <div className="w-20 h-20 rounded-full bg-wff-red/10 border border-wff-red/30 flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={40} className="text-wff-red" />
            </div>
            <h3 className="font-bebas text-5xl mb-3">REGISTRATION RECEIVED</h3>
            <p className="font-sans text-white/50 mb-2 text-sm">Welcome to the 2026 WFF All Africa Championship.</p>
            <p className="font-sans text-white/40 text-sm max-w-sm mx-auto mb-10">
              Our team will review your submission and contact you within 48 hours with your registration status and next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setIsSuccess(false); reset(); setCurrentStep(1); scrollToTop(); }}
                className="bg-wff-red text-white font-bebas text-xl px-10 py-3 hover:bg-white hover:text-wff-red transition-colors"
              >
                Register Another Athlete
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* ── STEP NAVIGATION ── */}
            <div className="mb-10">
              {/* Desktop stepper */}
              <div className="hidden md:flex items-center mb-4">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const done    = currentStep > step.id;
                  const active  = currentStep === step.id;
                  return (
                    <div key={step.id} className="flex items-center flex-1 last:flex-none">
                      <button
                        type="button"
                        onClick={() => goToStep(step.id)}
                        className={`flex flex-col items-center gap-1.5 group transition-all duration-200 ${
                          active ? 'opacity-100' : done ? 'opacity-80 hover:opacity-100' : 'opacity-30 hover:opacity-50'
                        }`}
                      >
                        <div className={`w-10 h-10 border flex items-center justify-center transition-all duration-200 ${
                          done    ? 'bg-wff-red border-wff-red' :
                          active  ? 'border-wff-red bg-wff-red/10' :
                                    'border-white/20 bg-white/3'
                        }`}>
                          {done
                            ? <Check size={16} className="text-white" />
                            : <Icon size={16} className={active ? 'text-wff-red' : 'text-white/50'} />
                          }
                        </div>
                        <span className={`font-bebas text-sm tracking-wider ${active ? 'text-wff-red' : 'text-white/50'}`}>
                          {step.label}
                        </span>
                      </button>
                      {idx < STEPS.length - 1 && (
                        <div className="flex-1 mx-3 h-px bg-white/10 relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-wff-red transition-all duration-500"
                            style={{ width: currentStep > step.id ? '100%' : '0%' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile: compact dots */}
              <div className="flex md:hidden items-center justify-between mb-4">
                {STEPS.map(step => {
                  const Icon = step.icon;
                  const done   = currentStep > step.id;
                  const active = currentStep === step.id;
                  return (
                    <div
                      key={step.id}
                      onClick={() => goToStep(step.id)}
                      className={`w-8 h-8 border flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        done    ? 'bg-wff-red border-wff-red' :
                        active  ? 'border-wff-red bg-wff-red/10' :
                                  'border-white/15 bg-white/3'
                      }`}
                    >
                      {done ? <Check size={14} className="text-white" /> : <Icon size={14} className={active ? 'text-wff-red' : 'text-white/30'} />}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="h-px bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-wff-red to-wff-red/60 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-white/25 font-sans uppercase tracking-wider">
                  Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
                </span>
                <span className="text-[10px] text-white/25 font-sans">{Math.round(progress)}% complete</span>
              </div>
            </div>

            {/* ── FORM PANEL ── */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-[#0a0a0a] border border-white/8 p-8 md:p-12 min-h-[500px]">
                {currentStep === 1 && <Step1 register={register} errors={errors} watch={watch} setValue={setValue} files={files} onFileChange={onFileChange} />}
                {currentStep === 2 && <Step2 register={register} errors={errors} watch={watch} setValue={setValue} />}
                {currentStep === 3 && <Step3 register={register} errors={errors} />}
                {currentStep === 4 && <Step4 register={register} errors={errors} watch={watch} setValue={setValue} files={files} onFileChange={onFileChange} />}
                {currentStep === 5 && <Step5 register={register} errors={errors} watch={watch} setValue={setValue} files={files} onFileChange={onFileChange} />}
              </div>

              {/* ── NAVIGATION BUTTONS ── */}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => goToStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 font-bebas text-lg text-white/40 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-all duration-200"
                >
                  <ChevronLeft size={18} /> Previous
                </button>

                <div className="flex items-center gap-2">
                  {STEPS.map(s => (
                    <div
                      key={s.id}
                      className={`transition-all duration-300 rounded-full ${
                        s.id === currentStep ? 'w-6 h-1.5 bg-wff-red' :
                        s.id < currentStep  ? 'w-1.5 h-1.5 bg-wff-red/40' :
                                              'w-1.5 h-1.5 bg-white/15'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={() => goToStep(currentStep + 1)}
                    className="flex items-center gap-2 font-bebas text-xl bg-wff-red text-white px-8 py-3 hover:bg-white hover:text-wff-red transition-all duration-200"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 font-bebas text-xl bg-wff-red text-white px-8 py-3 hover:bg-wff-gold hover:text-wff-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Shield size={16} /> Submit Registration</>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
