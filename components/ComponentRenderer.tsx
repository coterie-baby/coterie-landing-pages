import dynamic from 'next/dynamic';
import { urlFor } from '@/lib/sanity/image';
import type {
  SanityComponent,
  SanityProductCard,
  TitleBannerComponent,
  ContentBannerComponent,
  ProductCardHeroComponent,
  ComparisonTableComponent,
  DiptychMediaTitleComponent,
  USP2Component,
  SafetyStandardsComponent,
  ListicleComponent,
  ListicleContentComponent,
} from '@/types/sanity';

// Dynamic imports for code splitting - heavy components loaded on demand
const TitleBanner = dynamic(() => import('./title-banner'));
const ContentBanner = dynamic(() => import('./content-banner'));
const ProductCardHero = dynamic(() => import('./product-card-hero'));
const ComparisonTable = dynamic(() => import('./comparison-table'));
const DiptychMediaTitle = dynamic(() => import('./diptych-media-title'));
const USP2 = dynamic(() => import('./usp2'));
const SafetyStandards = dynamic(() => import('./safety-standards'));
const Listicle = dynamic(() => import('./listicle'));

interface ComponentRendererProps {
  component: SanityComponent;
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { _type } = component;

  switch (_type) {
    case 'titleBanner': {
      const titleBannerProps = component as TitleBannerComponent;
      return (
        <TitleBanner
          headline={titleBannerProps.headline}
          subheader={titleBannerProps.subheader}
          fullHeight={titleBannerProps.fullHeight}
          backgroundImage={
            titleBannerProps.backgroundImage
              ? urlFor(titleBannerProps.backgroundImage).url()
              : undefined
          }
          backgroundColor={titleBannerProps.backgroundColor?.hex}
          button={titleBannerProps.button}
        />
      );
    }

    case 'contentBanner': {
      const contentBannerProps = component as ContentBannerComponent;
      return (
        <ContentBanner
          headline={contentBannerProps.headline}
          subheader={contentBannerProps.subheader}
          backgroundImage={
            contentBannerProps.backgroundImage
              ? urlFor(contentBannerProps.backgroundImage).url()
              : undefined
          }
          overlay={contentBannerProps.overlay}
          position={contentBannerProps.position}
          button={contentBannerProps.button}
        />
      );
    }

    case 'productCardHero': {
      const productCardProps = component as ProductCardHeroComponent;
      const cards =
        productCardProps.cards?.map((card: SanityProductCard) => ({
          product: {
            id: card.product?._id || card.product?.id || '',
            title: card.product?.title || card.title || '',
            price: card.product?.price || '',
            href: card.product?.slug?.current
              ? `/products/${card.product.slug.current}`
              : '#',
          },
          title: card.title,
          description: card.description,
          category: card.category,
          badge: card.badge,
          thumbnail: {
            src: card.thumbnail
              ? urlFor(card.thumbnail).url()
              : '/placeholder.jpg',
            altText: card.thumbnail?.alt || card.title || 'Product image',
          },
        })) || [];

      let background:
        | { type: 'color'; color: string }
        | { type: 'image'; src: string; altText?: string }
        | { type: 'video'; src: string; poster?: string }
        | undefined;
      if (productCardProps.background?.type === 'color') {
        background = {
          type: 'color' as const,
          color: productCardProps.background.color?.hex || '#ffffff',
        };
      } else if (productCardProps.background?.type === 'image') {
        background = {
          type: 'image' as const,
          src: urlFor(productCardProps.background.image!).url(),
          altText: productCardProps.background.image?.alt || '',
        };
      } else if (productCardProps.background?.type === 'video') {
        background = {
          type: 'video' as const,
          src: productCardProps.background.video?.asset?.url || '',
          poster: productCardProps.background.poster
            ? urlFor(productCardProps.background.poster).url()
            : undefined,
        };
      }

      return (
        <ProductCardHero
          headline={productCardProps.headline}
          subheading={productCardProps.subheading}
          variant={productCardProps.variant}
          cards={cards}
          background={background}
        />
      );
    }

    case 'comparisonTable': {
      const comparisonProps = component as ComparisonTableComponent;
      return (
        <ComparisonTable
          title={comparisonProps.title}
          columns={comparisonProps.columns}
          rows={comparisonProps.rows}
          footnotes={comparisonProps.footnotes}
        />
      );
    }

    case 'diptychMediaTitle': {
      const diptychProps = component as DiptychMediaTitleComponent;
      return (
        <DiptychMediaTitle
          imageUrl={
            diptychProps.imageUrl
              ? urlFor(diptychProps.imageUrl).url()
              : undefined
          }
          imageAlt={diptychProps.imageUrl?.alt}
          mainHeading={diptychProps.mainHeading}
          leftColumnTitle={diptychProps.leftColumnTitle}
          leftColumnContent={diptychProps.leftColumnContent}
          rightColumnTitle={diptychProps.rightColumnTitle}
          rightColumnContent={diptychProps.rightColumnContent}
          imagePosition={diptychProps.imagePosition}
          backgroundColor={diptychProps.backgroundColor?.hex}
        />
      );
    }

    case 'usp2': {
      const usp2Props = component as USP2Component;
      const productCards = usp2Props.productCards?.map((card) => ({
        image: card.featuredImage ? urlFor(card.featuredImage).url() : 'https://cdn.sanity.io/images/e4q6bkl9/production/5da7c8766e7d65c99fd249291e84f0faaef4adb8-1000x1000.png?w=960&h=960&q=100&fit=crop&auto=format',
        headline: card.headline,
        bodyCopy: card.bodyCopy,
      }));
      
      return (
        <USP2
          headline={usp2Props.headline || ''}
          cards={usp2Props.cards || productCards?.length || 3}
          productCards={productCards}
        />
      );
    }

    case 'safetyStandards': {
      const safetyProps = component as SafetyStandardsComponent;
      return <SafetyStandards button={safetyProps.ctaButton} />;
    }

    case 'listicle': {
      const listicleProps = component as ListicleComponent;
      
      // Transform the banner props
      const bannerProps = {
        headline: listicleProps.banner.headline,
        subheader: listicleProps.banner.subheader,
        backgroundImage: listicleProps.banner.backgroundImage
          ? urlFor(listicleProps.banner.backgroundImage).url()
          : undefined,
        backgroundColor: listicleProps.banner.backgroundColor?.hex,
        overlay: listicleProps.banner.overlay,
        position: listicleProps.banner.position,
        button: listicleProps.banner.button,
      };
      
      // Transform the list items
      const listItems = listicleProps.listItems.map((item: ListicleContentComponent, index: number) => ({
        headline: item.headline,
        description: item.description,
        featuredImage: urlFor(item.featuredImage).url(),
        button: item.button,
        reverse: item.reverse,
        index: index,
      }));
      
      return <Listicle banner={bannerProps} listItems={listItems} />;
    }

    default:
      console.warn(`Unknown component type: ${_type}`);
      return null;
  }
}
