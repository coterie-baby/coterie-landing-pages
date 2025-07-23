import TitleBanner from '@/components/title-banner';
import USP2 from '@/components/usp2';

export default async function HomePage() {
  return (
    <div>
      <TitleBanner
        headline="Welcome to the homepage"
        subheader="This is the subheader. Blah blah subheaders are kinda boring but whatever."
        backgroundImage="/bg-placeholder.png"
        button={{
          label: 'Shop The Diaper',
          href: '#',
        }}
      />
      <USP2 />
    </div>
  );
}
