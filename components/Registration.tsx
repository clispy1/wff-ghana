'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import {
  User, Trophy, FileText, CreditCard,
  Upload, CheckCircle, ChevronRight, ChevronLeft, ChevronDown,
  Shield, AlertCircle, Lock, Check, X, Plane
} from 'lucide-react';

// ─────────────────────────────────────────────
// STEP DEFINITIONS
// ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Personal',    icon: User,       blurb: 'Who you are and how to reach you.' },
  { id: 2, label: 'Competition', icon: Trophy,      blurb: 'What you’re competing in.' },
  { id: 3, label: 'Documents',   icon: FileText,    blurb: 'A photo of you. Everything else can wait.' },
  { id: 4, label: 'Payment',     icon: CreditCard,  blurb: 'Pay now, later, or when you land in Ghana.' },
];

// ─────────────────────────────────────────────
// ZOD SCHEMA
// ─────────────────────────────────────────────
const schema = z.object({
  // Step 1 — Personal
  firstName:           z.string().min(2, 'First name is required'),
  lastName:            z.string().min(2, 'Last name is required'),
  gender:              z.string().min(1, 'Gender is required'),
  dob:                 z.string().min(1, 'Date of birth is required'),
  nationality:         z.string().min(2, 'Nationality is required'),
  countryRepresenting: z.string().min(2, 'Country representing is required'),
  passportNumber:      z.string().optional(),
  email:               z.string().email('Invalid email address'),
  mobile:              z.string().min(10, 'Valid mobile number required'),
  address:             z.string().min(5, 'Residential address is required'),
  city:                z.string().min(2, 'City is required'),
  country:             z.string().min(2, 'Country is required'),

  // Step 2 — Competition (+ Team/Club, shown only for club/national athletes)
  athleteType:         z.string().min(1, 'Athlete type is required'),
  category:            z.string().min(1, 'Category is required'),
  division:            z.string().min(1, 'Division is required'),
  weightClass:         z.string().optional(),
  heightClass:         z.string().optional(),
  teamName:            z.string().optional(),
  clubName:            z.string().optional(),
  teamCountry:         z.string().optional(),
  coachName:           z.string().optional(),
  managerName:         z.string().optional(),
  managerContact:      z.string().optional(),
  federationAffiliation: z.string().optional(),

  // Step 3 — Documents / Medical
  medicalDeclaration:  z.boolean().refine(v => v === true, 'You must confirm your medical fitness'),
  fitnessDeclaration:  z.boolean().refine(v => v === true, 'You must confirm your fitness declaration'),

  // Step 4 — Payment & Final
  // How the athlete intends to settle the entry fee. Whether it is
  // actually paid is decided by Paystack (or an on-site official), never
  // by this form.
  feePaid:             z.string().min(1, 'Please choose how you want to pay'),
  paymentMethod:       z.string().optional(),
  transactionId:       z.string().optional(),
  paystackRef:         z.string().optional(),
  emergencyName:       z.string().min(2, 'Emergency contact name required'),
  emergencyRelation:   z.string().min(2, 'Relationship required'),
  emergencyPhone:      z.string().min(10, 'Emergency phone required'),
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
const OptionalMark = () => <span className="text-white/25 ml-1.5 normal-case text-[9px] tracking-normal">Optional</span>;

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <span className="flex items-center gap-1 text-wff-red text-xs mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <AlertCircle size={11} /> {message}
    </span>
  ) : null;

const inputClass =
  'w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 focus:border-wff-red/70 focus:outline-none focus:bg-white/8 focus:ring-2 focus:ring-wff-red/10 transition-all duration-200';

const selectClass =
  'w-full bg-[#0d0d0d] border border-white/10 px-4 py-3 pr-10 text-sm text-white focus:border-wff-red/70 focus:outline-none focus:ring-2 focus:ring-wff-red/10 transition-all duration-200 appearance-none cursor-pointer';

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select {...props} className={selectClass}>{props.children}</select>
    <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
  </div>
);

// ── FILE UPLOAD: drag & drop, live preview, clear success state ──
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileUploadProps {
  label: string;
  required?: boolean;
  accept?: string;
  hint?: string;
  file?: File | null;
  onChange: (file: File | null) => void;
}
const FileUpload = ({ label, required, accept = 'image/*', hint, file, onChange }: FileUploadProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const preview = useMemo(() => {
    if (file && file.type.startsWith('image/')) return URL.createObjectURL(file);
    return null;
  }, [file]);

  // Revoke the previous object URL once it's no longer displayed, so we
  // don't leak memory as the athlete swaps files across the four uploads.
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onChange(dropped);
  };

  return (
    <div>
      <Label>{label}{required ? <RequiredMark /> : <OptionalMark />}</Label>
      {file ? (
        <div
          onClick={() => ref.current?.click()}
          className="flex items-center gap-3 border border-wff-green/40 bg-wff-green/5 p-3.5 cursor-pointer hover:bg-wff-green/8 transition-colors animate-in fade-in zoom-in-95 duration-200"
        >
          {preview ? (
            <img src={preview} alt="" className="w-11 h-11 object-cover flex-shrink-0 border border-white/10" />
          ) : (
            <div className="w-11 h-11 flex-shrink-0 bg-wff-green/10 border border-wff-green/30 flex items-center justify-center">
              <FileText size={16} className="text-wff-green" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/85 truncate flex items-center gap-1.5">
              <CheckCircle size={12} className="text-wff-green flex-shrink-0" /> {file.name}
            </p>
            <p className="text-[10px] text-white/35 mt-0.5">{formatBytes(file.size)} · click to replace</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="relative z-10 text-white/30 hover:text-wff-red transition-colors flex-shrink-0 p-1"
            aria-label={`Remove ${label}`}
          >
            <X size={15} />
          </button>
          <input type="file" ref={ref} className="hidden" accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} />
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border border-dashed p-5 text-center cursor-pointer transition-all duration-200 group ${
            isDragging
              ? 'border-wff-red bg-wff-red/8 scale-[1.01]'
              : 'border-white/15 hover:border-wff-red/50 hover:bg-white/3'
          }`}
        >
          <Upload size={20} className={`mx-auto mb-2 transition-colors ${isDragging ? 'text-wff-red' : 'text-white/30 group-hover:text-wff-red/60'}`} />
          <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
            {isDragging ? 'Drop it here' : 'Click or drag a file here'}
          </p>
          {hint && <p className="text-[10px] text-white/25 mt-1">{hint}</p>}
          <input type="file" ref={ref} className="hidden" accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} />
        </div>
      )}
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
  label: string; name: string; options: { value: string; label: string; sublabel?: string }[];
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
          className={`px-4 py-2.5 text-xs font-sans border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
            value === opt.value
              ? 'bg-wff-red border-wff-red text-white shadow-[0_0_0_3px_rgba(206,17,38,0.15)]'
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
function Step1({ register, errors }: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
}) {
  return (
    <div className="space-y-0">
      <SectionHeading>Identity</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Gender <RequiredMark /></Label>
          <Select {...register('gender')}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
        <div>
          <Label>Country Representing <RequiredMark /></Label>
          <input {...register('countryRepresenting')} className={inputClass} placeholder="Ghana" />
          <FieldError message={errors.countryRepresenting?.message} />
        </div>
        <div>
          <Label>Passport Number <OptionalMark /></Label>
          <input {...register('passportNumber')} className={inputClass} placeholder="G12345678" />
        </div>
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
        <div className="sm:col-span-2">
          <Label>Residential Address <RequiredMark /></Label>
          <input {...register('address')} className={inputClass} placeholder="House No., Street Name" />
          <FieldError message={errors.address?.message} />
        </div>
        <div>
          <Label>City <RequiredMark /></Label>
          <input {...register('city')} className={inputClass} placeholder="Accra" />
          <FieldError message={errors.city?.message} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
        <div>
          <Label>Country <RequiredMark /></Label>
          <input {...register('country')} className={inputClass} placeholder="Ghana" />
          <FieldError message={errors.country?.message} />
        </div>
      </div>
    </div>
  );
}

// ── STEP 2: COMPETITION + TEAM/CLUB (conditional) ──
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

  const isBodybuilding = ['mens-bodybuilding', 'classic-physique'].includes(category);
  const isPhysique     = ['mens-physique', 'womens-bikini', 'womens-fitness', 'womens-figure'].includes(category);
  const needsTeamInfo   = athleteType === 'club' || athleteType === 'national';

  return (
    <div>
      <SectionHeading>Athlete Type</SectionHeading>
      <RadioGroup
        label="I am competing as"
        name="athleteType"
        required
        value={athleteType}
        onChange={v => setValue('athleteType', v, { shouldValidate: true })}
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
              onClick={() => setValue('category', c.value, { shouldValidate: true })}
              className={`px-4 py-2.5 text-xs font-sans border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                category === c.value
                  ? 'bg-wff-red border-wff-red text-white shadow-[0_0_0_3px_rgba(206,17,38,0.15)]'
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
              onClick={() => setValue('category', c.value, { shouldValidate: true })}
              className={`px-4 py-2.5 text-xs font-sans border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${
                category === c.value
                  ? 'bg-wff-red border-wff-red text-white shadow-[0_0_0_3px_rgba(206,17,38,0.15)]'
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
        onChange={v => setValue('division', v, { shouldValidate: true })}
        error={errors.division?.message}
        options={[
          { value: 'junior',  label: 'Junior (Under 23)' },
          { value: 'senior',  label: 'Senior' },
          { value: 'masters', label: 'Masters (40+)' },
        ]}
      />

      {isBodybuilding && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <SectionHeading>Weight Class</SectionHeading>
          <RadioGroup
            label="Select your weight class"
            name="weightClass"
            value={weightClass}
            onChange={v => setValue('weightClass', v, { shouldValidate: true })}
            options={[
              { value: 'u70',  label: 'Up to 70kg' },
              { value: '70-80', label: '70 – 80kg' },
              { value: '80-90', label: '80 – 90kg' },
              { value: '90+',  label: '90kg+' },
            ]}
          />
        </div>
      )}

      {isPhysique && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <SectionHeading>Height Class</SectionHeading>
          <div>
            <Label>Height Class</Label>
            <input
              {...register('heightClass')}
              className={inputClass}
              placeholder="e.g. Under 175cm"
            />
          </div>
        </div>
      )}

      {needsTeamInfo && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <SectionHeading>Team & Club</SectionHeading>
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
      )}
    </div>
  );
}

// ── STEP 3: DOCUMENTS & VERIFICATION ──
function Step3({ watch, setValue, errors, files, onFileChange }: {
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<FormData>>['watch'];
  setValue: ReturnType<typeof useForm<FormData>>['setValue'];
  files: Record<string, File | null>;
  onFileChange: (key: string, file: File | null) => void;
}) {
  const medicalDeclaration = watch('medicalDeclaration') || false;
  const fitnessDeclaration = watch('fitnessDeclaration') || false;

  return (
    <div>
      <SectionHeading>Your Photo</SectionHeading>
      <p className="text-sm text-white/40 -mt-3 mb-5">Just one clear photo of you — that&apos;s all we need to keep moving.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
        <FileUpload
          label="Athlete Photo"
          required
          hint="Clear face photo, competition or gym"
          file={files.athletePhoto}
          onChange={f => onFileChange('athletePhoto', f)}
        />
        <FileUpload
          label="Passport / ID Copy"
          accept="image/*,.pdf"
          hint="Passport or national ID · you can also bring this on-site"
          file={files.passportDoc}
          onChange={f => onFileChange('passportDoc', f)}
        />
      </div>

      <SectionHeading>Optional</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-0">
        <FileUpload
          label="Full Body Competition Photo"
          hint="Recent competition or stage photo"
          file={files.fullBody}
          onChange={f => onFileChange('fullBody', f)}
        />
      </div>

      <SectionHeading>Medical Declarations</SectionHeading>
      <div className="space-y-4 p-5 border border-white/8 bg-white/2">
        <CheckboxField
          id="medicalDeclaration"
          checked={medicalDeclaration}
          onChange={v => setValue('medicalDeclaration', v, { shouldValidate: true })}
          label="I confirm that I am medically fit to compete in this championship."
          sublabel="I have no known medical conditions that would prevent safe participation."
          error={errors.medicalDeclaration?.message}
        />
        <CheckboxField
          id="fitnessDeclaration"
          checked={fitnessDeclaration}
          onChange={v => setValue('fitnessDeclaration', v, { shouldValidate: true })}
          label="I declare that I am in peak physical condition and ready to compete."
          sublabel="I take full personal responsibility for my participation and physical wellbeing."
          error={errors.fitnessDeclaration?.message}
        />
      </div>
    </div>
  );
}

// ── STEP 4: PAYMENT & FINAL ──
function Step4({ register, errors, watch, setValue, files, onFileChange }: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
  watch: ReturnType<typeof useForm<FormData>>['watch'];
  setValue: ReturnType<typeof useForm<FormData>>['setValue'];
  files: Record<string, File | null>;
  onFileChange: (key: string, file: File | null) => void;
}) {
  const feePaid = watch('feePaid') || '';

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
        label="How would you like to pay?"
        name="feePaid"
        required
        value={feePaid}
        onChange={v => setValue('feePaid', v, { shouldValidate: true })}
        error={errors.feePaid?.message}
        options={[
          { value: 'paystack', label: 'Pay now online' },
          { value: 'offline',  label: 'Pay by bank / mobile money transfer' },
          { value: 'onsite',   label: 'Pay when I arrive in Ghana' },
        ]}
      />

      {feePaid === 'paystack' && (
        <div className="mt-6 flex gap-3 items-start bg-wff-gold/5 border border-wff-gold/20 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Lock size={18} className="text-wff-gold mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/60 leading-relaxed">
            When you submit this form you will be taken to <span className="text-white font-bold">Paystack</span> to
            pay the entry fee by card, bank transfer or mobile money. Your entry is only
            forwarded to the selection committee once payment clears — you can close the payment
            page and come back to it, your details are already saved.
          </p>
        </div>
      )}

      {feePaid === 'offline' && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-3 items-start bg-white/[0.03] border border-white/10 p-5">
            <CreditCard size={18} className="text-white/40 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/60 leading-relaxed">
              Transfer the entry fee to the federation account, then upload your receipt below.
              An official will confirm your payment manually — this normally takes 1–2 working days.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Transaction / Reference ID</Label>
              <input {...register('transactionId')} className={inputClass} placeholder="TXN-XXXXXXXX" />
            </div>
            <div>
              <Label>Paying From (Bank / MoMo number)</Label>
              <input {...register('paymentMethod')} className={inputClass} placeholder="MTN MoMo · 024 000 0000" />
            </div>
          </div>
          <FileUpload
            label="Payment Screenshot / Receipt"
            hint="JPEG or PNG · Clear screenshot of payment confirmation"
            file={files.paymentScreenshot}
            onChange={f => onFileChange('paymentScreenshot', f)}
          />
        </div>
      )}

      {feePaid === 'onsite' && (
        <div className="mt-6 flex gap-3 items-start bg-wff-green/5 border border-wff-green/20 p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <Plane size={18} className="text-wff-green mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/60 leading-relaxed">
            No payment needed right now. Complete registration today and settle the entry fee
            in cash or mobile money when you check in at the event in Ghana. Your spot is
            provisional — bring the fee with you to confirm it at check-in.
          </p>
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

      <SectionHeading>Consents & Agreements</SectionHeading>
      <div className="space-y-4 p-5 border border-white/8 bg-white/2">
        <CheckboxField
          id="mediaConsent"
          checked={watch('mediaConsent') || false}
          onChange={v => setValue('mediaConsent', v, { shouldValidate: true })}
          label="I authorize WFF Ghana to use my photographs, videos, and competition footage for promotional purposes."
          sublabel="Including social media, press releases, and official WFF Ghana publications."
        />
        <CheckboxField
          id="termsAgreed"
          checked={watch('termsAgreed') || false}
          onChange={v => setValue('termsAgreed', v, { shouldValidate: true })}
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
  3: ['medicalDeclaration', 'fitnessDeclaration'],
  4: ['feePaid', 'emergencyName', 'emergencyRelation', 'emergencyPhone', 'termsAgreed'],
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
    useForm<FormData>({
      resolver: zodResolver(schema),
      mode: 'onBlur',
      // These fields are only ever set via setValue (button/checkbox
      // controls, never a registered input), so without an explicit
      // default they start as `undefined`. Zod then raises a generic
      // "invalid type" error instead of running our .min()/.refine()
      // message, so the athlete sees "Invalid input" instead of real
      // guidance the first time they hit Submit.
      defaultValues: {
        athleteType: '', category: '', division: '', weightClass: '', heightClass: '',
        medicalDeclaration: false, fitnessDeclaration: false,
        feePaid: '', mediaConsent: false, termsAgreed: false,
      },
    });

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
      // The athlete-documents bucket is private — these are passport and
      // ID scans. We store the object path and the admin dashboard reads
      // it through a short-lived signed URL, so nothing is world-readable.
      const uploadFile = async (file: File | null | undefined) => {
        if (!file) return null;
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const path = `registrations/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;
        const { data: udata, error } = await supabase.storage
          .from('athlete-documents')
          .upload(path, file);
        if (error) throw error;
        return udata.path;
      };

      const passportUrl = await uploadFile(files.passportDoc);
      const headshotUrl = await uploadFile(files.athletePhoto);
      const fullBodyUrl = await uploadFile(files.fullBody);
      const paymentScreenshotUrl = await uploadFile(files.paymentScreenshot);

      const { data: inserted, error } = await supabase.from('registrations').insert({
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: null,
        gender: data.gender,
        dob: data.dob,
        nationality: data.nationality,
        country_representing: data.countryRepresenting,
        passport_number: data.passportNumber || null,
        national_id: null,
        email: data.email,
        mobile: data.mobile,
        whatsapp: null,
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
        national_id_url: null,
        headshot_url: headshotUrl,
        full_body_url: fullBodyUrl,
        prev_photos_urls: [],
        certs_url: null,
        // Always 'pending' here. Only a verified Paystack transaction or
        // an admin can move this to 'paid' — RLS rejects anything else.
        // 'onsite' registrations stay 'pending' until an admin marks them
        // paid at event check-in.
        fee_paid_status: 'pending',
        payment_method: data.feePaid === 'paystack' ? 'paystack' : data.feePaid === 'onsite' ? 'onsite' : (data.paymentMethod || 'offline'),
        transaction_id: data.transactionId || null,
        paystack_ref: data.paystackRef || null,
        payment_screenshot_url: paymentScreenshotUrl,
        emergency_name: data.emergencyName,
        emergency_relation: data.emergencyRelation,
        emergency_phone: data.emergencyPhone,
        instagram: null,
        facebook: null,
        tiktok: null,
        arrival_date: null,
        departure_date: null,
        needs_pickup: null,
        needs_accommodation: null,
        media_consent: data.mediaConsent || false,
        terms_agreed: data.termsAgreed,
      }).select('id').single();

      if (error) throw error;

      // Paying online: hand off to Paystack. The entry is already saved,
      // so an abandoned payment loses nothing but the fee.
      if (data.feePaid === 'paystack' && inserted?.id) {
        const res = await fetch('/api/checkout/registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registration_id: inserted.id }),
        });
        const payment = await res.json();

        if (!res.ok) {
          throw new Error(
            `${payment.error || 'Could not start payment.'} Your entry was saved — contact us to pay the fee.`,
          );
        }

        window.location.href = payment.authorization_url;
        return;
      }

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
            Four short steps. Most athletes finish in under five minutes.
          </p>
        </div>

        {isSuccess ? (
          // ── SUCCESS STATE ──
          <div className="max-w-2xl mx-auto border border-white/10 p-12 text-center bg-[#0a0a0a] animate-in fade-in zoom-in-95 duration-500">
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
                onClick={() => { setIsSuccess(false); reset(); setFiles({}); setCurrentStep(1); scrollToTop(); }}
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
                          active  ? 'border-wff-red bg-wff-red/10 shadow-[0_0_0_4px_rgba(206,17,38,0.1)]' :
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
                  Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].blurb}
                </span>
                <span className="text-[10px] text-white/25 font-sans">{Math.round(progress)}% complete</span>
              </div>
            </div>

            {/* ── FORM PANEL ── */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-[#0a0a0a] border border-white/8 p-8 md:p-12 min-h-[500px] overflow-hidden">
                <div key={currentStep} className="animate-in fade-in slide-in-from-right-3 duration-300">
                  {currentStep === 1 && <Step1 register={register} errors={errors} />}
                  {currentStep === 2 && <Step2 register={register} errors={errors} watch={watch} setValue={setValue} />}
                  {currentStep === 3 && <Step3 errors={errors} watch={watch} setValue={setValue} files={files} onFileChange={onFileChange} />}
                  {currentStep === 4 && <Step4 register={register} errors={errors} watch={watch} setValue={setValue} files={files} onFileChange={onFileChange} />}
                </div>
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
                    className="flex items-center gap-2 font-bebas text-xl bg-wff-red text-white px-8 py-3 hover:bg-white hover:text-wff-red transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 font-bebas text-xl bg-wff-red text-white px-8 py-3 hover:bg-wff-gold hover:text-wff-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
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
