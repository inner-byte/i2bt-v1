import { MemberList } from '@/components/sections/member-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members | Computer Science Student Organization',
  description: 'Browse and connect with other members',
};

export default function MembersPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Members Directory</h1>
      <MemberList />
    </div>
  );
}
