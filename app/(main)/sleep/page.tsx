import TitleBanner from '@/components/title-banner';

export default function SleepPage() {
  return (
    <div>
      <TitleBanner
        headline="A diaper designed for sleep"
        subheader="Premium baby care products for modern parents"
        backgroundImage="/images/baby-sleep.jpg"
        position="bottom"
        overlay={30}
      />
    </div>
  );
}
