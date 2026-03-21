import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import SectionPanel from "../components/SectionPanel";
import ProfileForm from "../components/ProfileForm";
import UtilityPanel from "../components/UtilityPanel";
import InfoBanner from "../components/InfoBanner";
import { useAppContext } from "../context/AppContext";

function ProfilePage() {
  const { profile, saveProfile, utilityPanel } = useAppContext();

  return (
    <AppShell railContent={<UtilityPanel title={utilityPanel.title} items={utilityPanel.items} />}>
      <div className="page-stack">
        <PageHeader
          title="My Details"
          subtitle="Maintain your personal, contact and employment information."
        />
        <InfoBanner
          title="Profile review"
          message="Keep your mobile number and email current so payment and security notices can reach you."
          tone="warning"
        />
        <SectionPanel title="Customer details">
          <ProfileForm profile={profile} onSave={saveProfile} />
        </SectionPanel>
      </div>
    </AppShell>
  );
}

export default ProfilePage;
