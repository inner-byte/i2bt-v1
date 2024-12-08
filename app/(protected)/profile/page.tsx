import { getServerSession } from 'next-auth/next';
import { ProfileForm } from '@/components/forms/profile-form';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Computer Science Student Organization',
  description: 'Manage your profile settings',
};

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
    },
  });

  return (
    <div className="container max-w-2xl py-8">
      <div className="glass-effect p-8 rounded-2xl space-y-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        
        <div className="border-b border-secondary/20 pb-8">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <AvatarUpload currentImage={user?.image} userId={user?.id || ''} />
        </div>

        <ProfileForm initialData={user?.profile || undefined} />
      </div>
    </div>
  );
}
