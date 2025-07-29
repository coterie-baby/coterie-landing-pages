import ContentBanner from '@/components/content-banner';
import ListicleContent from '@/components/listicle-content';

export default function ListiclePage() {
  return (
    <div className="flex flex-col gap-15">
      <ContentBanner
        headline="5 Reasons why Coterie is the Best!"
        subheader=""
        backgroundImage="https://cdn.sanity.io/images/e4q6bkl9/production/903c7cd48d3641e9f85c07fceec85f36d4016ae8-6720x4480.jpg?rect=1644,0,3432,4480&w=960&h=1253&q=100&fit=crop&auto=format"
        overlay={20}
        position="bottom"
      />
      {/* Create listicle content container component */}
      <div className="flex flex-col gap-8">
        <ListicleContent />
        <ListicleContent reverse />
        <ListicleContent />
        <ListicleContent reverse />
        <ListicleContent />
      </div>
    </div>
  );
}
