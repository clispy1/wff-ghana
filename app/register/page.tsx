import Registration from '@/components/Registration';

export const metadata = {
  title: 'Athlete Registration | WFF Ghana 2026 All Africa Championship',
  description:
    'Register to compete in the 2026 WFF All Africa Championship. Complete your athlete profile, competition details, documents, and payment in one place.',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-wff-dark pt-28">
      <Registration />
    </main>
  );
}
