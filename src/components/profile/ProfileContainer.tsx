import ProfileHeader from "./ProfileHeader";
import PreferencesForm from "./PreferencesForm";
import DataManagementCard from "./DataManagementCard";

interface ProfileContainerProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt: string | Date;
    defaultMood: string;
  };
}

export default function ProfileContainer({ user }: ProfileContainerProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* 1. Identity Spotlight Block */}
      <ProfileHeader user={user} />

      {/* 2. Operational Configurations Card */}
      <PreferencesForm initialDefaultMood={user.defaultMood} />

      {/* 3. Portability and Lifecycle Actions Block */}
      <DataManagementCard />
    </div>
  );
}
