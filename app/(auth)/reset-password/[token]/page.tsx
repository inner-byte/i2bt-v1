import { Metadata } from 'next';
import { PasswordResetForm } from '@/components/forms/password-reset-form';

export const metadata: Metadata = {
  title: 'Reset Password | Computer Science Student Organization',
  description: 'Reset your password',
};

interface ResetPasswordTokenPageProps {
  params: {
    token: string;
  };
}

export default function ResetPasswordTokenPage({ params }: ResetPasswordTokenPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8 glass-effect p-8 rounded-2xl">
        <PasswordResetForm mode="reset" token={params.token} />
      </div>
    </div>
  );
}
