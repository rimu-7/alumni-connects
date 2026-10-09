import AlumniDirectoryClient from "./AlumniDirectoryClient";
import { getAlumniList } from "@/lib/alumni";

// Revalidate page in background every 60s, or instantly via revalidatePath('/directory') on new submissions
export const revalidate = 60;

export const metadata = {
  title: "অ্যালামনাই ডিরেক্টরি | বাঁশগ্রাম হাইস্কুল",
  description: "বাঁশগ্রাম উচ্চ বিদ্যালয়ের সকল প্রাক্তন শিক্ষার্থীদের তালিকা ও যোগাযোগের তথ্য।",
};

export default async function AlumniDirectoryPage() {
  const { alumni, error } = await getAlumniList({ limit: 1000 });

  return <AlumniDirectoryClient initialAlumni={alumni} initialError={error} />;
}