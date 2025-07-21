import SafetyStandards from '@/components/safety-standards';
import TitleBanner from '@/components/title-banner';
import USP2 from '@/components/usp2';

export default function Home() {
  return (
    <div>
      <SafetyStandards />
      <TitleBanner
        headline="This is the headline"
        subheader="This is the subheader."
        fullHeight={false}
        backgroundImage="/bg-placeholder.png"
      />
      <USP2 />
    </div>
  );
}
