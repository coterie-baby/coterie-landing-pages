import TitleBanner from '@/components/title-banner';

export default function Home() {
  return (
    <div>
      <TitleBanner
        headline="This is the headline"
        subheader="This is the subheader."
        fullHeight={false}
        backgroundImage="/bg-placeholder.png"
      />
    </div>
  );
}
