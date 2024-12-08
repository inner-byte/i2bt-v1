import { AuthForm } from '@/components/forms/auth-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Computer Science Student Organization',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8 glass-effect p-8 rounded-2xl">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
