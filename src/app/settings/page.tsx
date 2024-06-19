import { auth } from '@/auth';
import ProfileForm from '@/components/ProfileForm';
import { fetchProfile } from '@/lib/data';
import { notFound } from 'next/navigation';
import React from 'react'

const page = async() => {
  const session = await auth();
  const profile = await fetchProfile(session?.user.username!);

  if (!profile) {
    notFound();
  }

  return (
    <div className="px-12">
      <h1 className="text-2xl font-medium">Edit profile</h1>

      <ProfileForm profile={profile} />
    </div>
  );
}

export default page
