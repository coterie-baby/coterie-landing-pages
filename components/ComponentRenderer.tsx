import TitleBanner from './title-banner';
import ProductCardHero from './product-card-hero';
import ComparisonTable from './comparison-table';
import DiptychMediaTitle from './diptych-media-title';
import SafetyStandards from './safety-standards';
import { urlFor } from '@/lib/sanity/image';

interface ComponentRendererProps {
  component: {
    _type: string;
    _key?: string;
    [key: string]: any;
  };
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { _type, ...props } = component;

  switch (_type) {
    case 'titleBanner':
      return (
        <TitleBanner
          headline={props.headline}
          subheader={props.subheader}
          fullHeight={props.fullHeight}
          backgroundImage={props.backgroundImage ? urlFor(props.backgroundImage).url() : undefined}
          backgroundColor={props.backgroundColor?.hex}
          button={props.button}
        />
      );

    case 'productCardHero':
      const cards = props.cards?.map((card: any) => ({
        product: {
          id: card.product?._id || card.product?.id || '',
          title: card.product?.title || card.title || '',
          price: card.product?.price || '',
          href: card.product?.slug?.current ? `/products/${card.product.slug.current}` : '#',
        },
        title: card.title,
        description: card.description,
        category: card.category,
        badge: card.badge,
        thumbnail: {
          src: card.thumbnail ? urlFor(card.thumbnail).url() : '/placeholder.jpg',
          altText: card.thumbnail?.alt || card.title || 'Product image',
        },
      })) || [];

      let background;
      if (props.background?.type === 'color') {
        background = { type: 'color', color: props.background.color?.hex || '#ffffff' };
      } else if (props.background?.type === 'image') {
        background = { 
          type: 'image', 
          src: urlFor(props.background.image).url(),
          altText: props.background.image?.alt || ''
        };
      } else if (props.background?.type === 'video') {
        background = { 
          type: 'video', 
          src: props.background.video?.asset?.url || '',
          poster: props.background.poster ? urlFor(props.background.poster).url() : undefined
        };
      }

      return (
        <ProductCardHero
          headline={props.headline}
          subheading={props.subheading}
          variant={props.variant}
          cards={cards}
          background={background}
        />
      );

    case 'comparisonTable':
      return (
        <ComparisonTable
          title={props.title}
          columns={props.columns}
          rows={props.rows}
          footnotes={props.footnotes}
        />
      );

    case 'diptychMediaTitle':
      return (
        <DiptychMediaTitle
          imageUrl={props.imageUrl}
          imageAlt={props.imageUrl?.alt}
          mainHeading={props.mainHeading}
          leftColumnTitle={props.leftColumnTitle}
          leftColumnContent={props.leftColumnContent}
          rightColumnTitle={props.rightColumnTitle}
          rightColumnContent={props.rightColumnContent}
          imagePosition={props.imagePosition}
          backgroundColor={props.backgroundColor?.hex}
        />
      );

    case 'safetyStandards':
      const standards = props.standards?.map((standard: any) => ({
        icon: standard.icon ? urlFor(standard.icon).url() : undefined,
        title: standard.title,
        description: standard.description,
      })) || [];

      return (
        <SafetyStandards
          title={props.title}
          description={props.description}
          standards={standards}
          ctaButton={props.ctaButton}
        />
      );

    default:
      console.warn(`Unknown component type: ${_type}`);
      return null;
  }
}