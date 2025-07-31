import ContentBanner, { ContentBannerProps } from './content-banner';
import ListicleContent, { ListicleContentProps } from './listicle-content';

interface ListicleProps {
  banner: ContentBannerProps;
  listItems: ListicleContentProps[];
}

export default function Listicle({ banner, listItems }: ListicleProps) {
  return (
    <div>
      <ContentBanner {...banner} />
      <div className="mt-12">
        {listItems.map((item, i) => {
          return <ListicleContent key={i} {...item} index={i} />;
        })}
      </div>
    </div>
  );
}
