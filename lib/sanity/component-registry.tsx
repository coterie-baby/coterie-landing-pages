import TitleBanner from '@/components/title-banner';
import ContentBanner from '@/components/content-banner';
import ProductCardHero from '@/components/product-card-hero';
import ComparisonTable from '@/components/comparison-table';
import DiptychMediaTitle from '@/components/diptych-media-title';
import SafetyStandards from '@/components/safety-standards';
import Listicle from '@/components/listicle';
import USP2 from '@/components/usp2';
import CTABanner from '@/components/cta-banner';
import PressTestimonials from '@/components/press-testimonials';
import AwardSlideshow from '@/components/award-slideshow';
import SocialPosts from '@/components/social-posts';
import DiaperIssueBreakdown from '@/components/diaper-issue-breakdown';
import DiaperMythReality from '@/components/diaper-myth-reality';
import DiaperProblemSolver from '@/components/diaper-problem-solver';
import Quote from '@/components/quote';
import SimplePDPHero from '@/components/simple-pdp-hero';
import AnnouncementBar from '@/components/announcement-bar';
import Quiz from '@/components/quiz';
import ProductCrossSell from '@/components/product-cross-sell';
import UGCVideo from '@/components/ugc-video';
import FlexAnnouncementBar from '@/components/flex-announcement-bar';
import PressStatements from '@/components/press-statements';
import TestimonialGrid from '@/components/testimonial-grid';
import SimpleStats from '@/components/simple-stats';
import SteppedStats from '@/components/stepped-stats';
import ThreeColumnTable from '@/components/three-column-table';
import PDPHeroV2 from '@/components/pdp-hero-v2';
import Reviews from '@/components/reviews';
import { ReviewsToggleSection } from '@/components/reviews-toggle';
import { urlFor } from './image';
import type {
  SanityComponent,
  SanityTitleBanner,
  SanityContentBanner,
  SanityProductCardHero,
  SanityComparisonTable,
  SanityDiptychMediaTitle,
  SanitySafetyStandards,
  SanityListicle,
  SanityUSP2,
  SanityCTABanner,
  SanityPressTestimonials,
  SanityAwardSlideshow,
  SanitySocialPosts,
  SanityDiaperIssueBreakdown,
  SanityDiaperMythReality,
  SanityDiaperProblemSolver,
  SanityQuote,
  SanitySimplePdpHero,
  SanityAnnouncementBar,
  SanityQuiz,
  SanityProductCrossSell,
  SanityUGCVideo,
  SanityFlexAnnouncementBar,
  SanityPressStatements,
  SanityTestimonialGrid,
  SanitySimpleStats,
  SanitySteppedStats,
  SanityThreeColumnTable,
  SanityPdpHeroV2,
  SanityReviews,
  SanityReviewsToggle,
  SanityImage,
  SanityColor,
} from './types';

function resolveImageUrl(image?: SanityImage): string | undefined {
  if (!image?.asset) return undefined;
  return urlFor(image).url();
}

function resolveColor(color?: SanityColor): string | undefined {
  return color?.hex;
}

// --- Original 8 transforms ---

function transformTitleBanner(data: SanityTitleBanner) {
  return {
    headline: data.headline,
    subheader: data.subheader,
    fullHeight: data.fullHeight,
    backgroundImage: resolveImageUrl(data.backgroundImage),
    backgroundColor: resolveColor(data.backgroundColor),
    button: data.button,
  };
}

function transformContentBanner(data: SanityContentBanner) {
  return {
    headline: data.headline,
    subheader: data.subheader,
    backgroundImage: resolveImageUrl(data.backgroundImage),
    backgroundColor: resolveColor(data.backgroundColor),
    overlay: data.overlay as 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | undefined,
    position: data.position,
    button: data.button,
  };
}

function transformProductCardHero(data: SanityProductCardHero) {
  const cards = (data.cards || []).map((card) => {
    const product = card.product;
    const price = product?.pricing?.autoRenew ?? product?.pricing?.oneTimePurchase;

    return {
      product: {
        id: product?._id || '',
        title: product?.title || card.title || '',
        description: product?.shortDescription || card.description,
        href: product?.slug?.current ? `/${product.slug.current}` : undefined,
        price: price != null ? String(price) : '0',
      },
      title: card.title,
      description: card.description,
      category: card.category,
      badge: card.badge,
      thumbnail: {
        src: resolveImageUrl(card.thumbnail) || '',
        altText: card.thumbnail?.alt || card.title || '',
      },
    };
  });

  let background: { type: 'color'; color: string } | { type: 'image'; src: string } | { type: 'video'; src: string; poster?: string } | undefined;

  if (data.background) {
    switch (data.background.type) {
      case 'color':
        if (data.background.color?.hex) {
          background = { type: 'color', color: data.background.color.hex };
        }
        break;
      case 'image': {
        const src = resolveImageUrl(data.background.image);
        if (src) background = { type: 'image', src };
        break;
      }
      case 'video':
        if (data.background.video?.asset?.url) {
          background = {
            type: 'video',
            src: data.background.video.asset.url,
            poster: resolveImageUrl(data.background.poster),
          };
        }
        break;
    }
  }

  return {
    headline: data.headline,
    subheading: data.subheading,
    variant: data.variant,
    cards,
    background,
  };
}

function transformComparisonTable(data: SanityComparisonTable) {
  return {
    title: data.title,
    columns: data.columns,
    rows: data.rows?.map((row) => ({
      ...row,
      values: row.values?.map((v) => {
        if (v === 'true') return { value: 'true' };
        if (v === 'false') return { value: 'false' };
        return v;
      }),
    })),
    footnotes: data.footnotes,
  };
}

function transformDiptychMediaTitle(data: SanityDiptychMediaTitle) {
  const imageUrl = resolveImageUrl(data.imageUrl);
  return {
    imageUrl: imageUrl || undefined,
    imageAlt: data.imageUrl?.alt,
    mainHeading: data.mainHeading,
    leftColumnTitle: data.leftColumnTitle,
    leftColumnContent: data.leftColumnContent,
    rightColumnTitle: data.rightColumnTitle,
    rightColumnContent: data.rightColumnContent,
    imagePosition: data.imagePosition,
    backgroundColor: resolveColor(data.backgroundColor),
  };
}

function transformSafetyStandards(data: SanitySafetyStandards) {
  return {
    button: data.ctaButton
      ? { label: data.ctaButton.label, href: data.ctaButton.href }
      : undefined,
  };
}

function transformListicle(data: SanityListicle) {
  return {
    banner: transformContentBanner({
      ...data.banner,
      _type: 'contentBanner',
      _key: '',
    }),
    listItems: (data.listItems || []).map((item) => ({
      headline: item.headline,
      description: item.description,
      featuredImage: resolveImageUrl(item.featuredImage) || '',
      button: item.button,
      reverse: item.reverse,
      index: 0,
    })),
  };
}

function transformUSP2(data: SanityUSP2) {
  return {
    headline: data.headline,
    cards: data.cards,
    productCards: data.productCards?.map((card) => ({
      image: resolveImageUrl(card.featuredImage) || '',
      headline: card.headline,
      bodyCopy: card.bodyCopy,
    })),
  };
}

// --- New 19 transforms ---

function transformCTABanner(data: SanityCTABanner) {
  return {
    headline: data.headline,
    button: data.button,
    backgroundColor: resolveColor(data.backgroundColor),
    textColor: resolveColor(data.textColor),
  };
}

function transformPressTestimonials(data: SanityPressTestimonials) {
  return {
    testimonials: data.testimonials?.map((t, i) => ({
      id: String(i + 1),
      quote: t.quote,
      source: t.source,
      publication: t.publication,
    })),
  };
}

function transformAwardSlideshow(data: SanityAwardSlideshow) {
  return {
    eyebrowText: data.eyebrowText,
    autoPlayInterval: data.autoPlayInterval,
    awards: (data.awards || []).map((a, i) => ({
      id: String(i + 1),
      heroText: a.heroText,
      subText: a.subText,
      backgroundImage: resolveImageUrl(a.backgroundImage) || '',
      backgroundAlt: a.heroText,
    })),
    awardIcons: (data.awardIcons || []).map((icon) => resolveImageUrl(icon) || '').filter(Boolean),
  };
}

function transformSocialPosts(data: SanitySocialPosts) {
  return {
    title: data.title,
    subtitle: data.subtitle,
    backgroundColor: resolveColor(data.backgroundColor),
    posts: data.posts?.map((p, i) => ({
      id: String(i + 1),
      username: p.username,
      imageUrl: resolveImageUrl(p.image) || '',
      imageAlt: p.username,
    })),
  };
}

function transformDiaperIssueBreakdown(data: SanityDiaperIssueBreakdown) {
  return {
    issues: data.issues?.map((issue, i) => ({
      id: String(i + 1),
      issue: issue.issue,
      parentThought: issue.parentThought,
      actualCause: issue.actualCause,
      howCoterieHelps: issue.howCoterieHelps,
    })),
  };
}

function transformDiaperMythReality(data: SanityDiaperMythReality) {
  return {
    items: data.items?.map((item, i) => ({
      id: String(i + 1),
      myth: item.myth,
      reality: item.reality,
      explanation: item.explanation,
    })),
  };
}

function transformDiaperProblemSolver(data: SanityDiaperProblemSolver) {
  return {
    problems: data.problems?.map((p, i) => ({
      id: String(i + 1),
      problem: p.problem,
      symptom: p.symptom,
      rootCause: p.rootCause,
      solution: p.solution,
    })),
  };
}

function transformQuote(data: SanityQuote) {
  return {
    quote: data.quote,
  };
}

function transformSimplePdpHero(data: SanitySimplePdpHero) {
  return {
    imageUrl: resolveImageUrl(data.image),
    title: data.title,
    description: data.description,
    price: data.price,
    rating: data.rating,
    reviewCount: data.reviewCount,
  };
}

function transformAnnouncementBar(data: SanityAnnouncementBar) {
  return {
    announcement: data.announcement,
  };
}

function transformQuiz(data: SanityQuiz) {
  return {
    title: data.title,
    questions: data.questions?.map((q, i) => ({
      id: String(i + 1),
      question: q.question,
      options: q.options?.map((o, j) => ({
        id: String(j + 1),
        label: o.label,
        value: o.value,
      })) || [],
    })),
  };
}

function transformProductCrossSell(data: SanityProductCrossSell) {
  return {
    headline: data.headline || 'Shop More Diapering Essentials',
    products: data.products?.map((p) => {
      const price = p.pricing?.autoRenew ?? p.pricing?.oneTimePurchase;
      return {
        id: p._id,
        title: p.title,
        description: p.shortDescription || '',
        price: price != null ? String(price) : '',
        category: p.category || '',
        imageUrl: resolveImageUrl(p.thumbnail) || '',
      };
    }),
  };
}

function transformUGCVideo(data: SanityUGCVideo) {
  return {
    videoUrl: data.videoUrl,
    posterUrl: resolveImageUrl(data.posterImage),
  };
}

function transformFlexAnnouncementBar(data: SanityFlexAnnouncementBar) {
  return {
    announcement: data.announcement,
    showStars: data.showStars,
    rating: data.rating,
  };
}

function transformPressStatements(data: SanityPressStatements) {
  return {
    statements: data.statements?.map((s, i) => ({
      id: String(i + 1),
      outlet: s.outlet,
      logo: resolveImageUrl(s.logo),
      quote: s.quote,
      showStars: s.showStars,
      starText: s.starText,
    })),
  };
}

function transformTestimonialGrid(data: SanityTestimonialGrid) {
  return {
    eyebrow: data.eyebrow,
    headline: data.headline,
    testimonials: data.testimonials?.map((t) => ({
      body: t.body,
      author: {
        name: t.authorName,
        handle: t.authorHandle,
        imageUrl: resolveImageUrl(t.authorImage) || '',
      },
    })),
  };
}

function transformSimpleStats(data: SanitySimpleStats) {
  return {
    stats: data.stats?.map((s) => ({
      value: s.value,
      name: s.name,
    })),
  };
}

function transformSteppedStats(data: SanitySteppedStats) {
  return {
    headline: data.headline,
    description: data.description,
    stats: data.stats?.map((s) => ({
      value: s.value,
      title: s.title,
      description: s.description,
      color: s.color,
    })),
  };
}

function transformThreeColumnTable(data: SanityThreeColumnTable) {
  return {
    headline: data.headline,
    sidebarLabels: data.sidebarLabels,
    tabs: data.tabs?.map((tab) => ({
      title: tab.title,
      buttonText: tab.buttonText || 'Learn More',
      col2Header: tab.col2Header,
      col3Header: tab.col3Header,
      rows: tab.rows?.map((row) => ({
        label: row.label,
        col2: row.col2 || '',
        col3: row.col3 || '',
      })) || [],
    })),
  };
}

function transformReviews(data: SanityReviews) {
  return {
    productId: data.product?.shopifyProductId,
  };
}

function transformPdpHeroV2(data: SanityPdpHeroV2) {
  const product = data.product;

  // Override images take priority over product images
  const imageSource = data.images?.length ? data.images : product?.images;
  const images = (imageSource || [])
    .map((img) => ({
      src: resolveImageUrl(img.image) || '',
      alt: img.alt || product?.title || 'Product image',
    }))
    .filter((img) => img.src);

  // Build sizeKey → featured image URL lookup
  const sizeImages: Record<string, string> = {};
  for (const size of product?.sizes || []) {
    const url = resolveImageUrl(size.featuredImage);
    if (url) {
      sizeImages[size.sizeKey] = url;
    }
  }

  // Merge page-level orderTypes over product-level, field-by-field
  const pageOT = data.orderTypes;
  const prodOT = product?.orderTypes;
  const mergedAutoRenew = pageOT?.autoRenew || prodOT?.autoRenew
    ? {
        badgeText: pageOT?.autoRenew?.badgeText ?? prodOT?.autoRenew?.badgeText,
        title: pageOT?.autoRenew?.title ?? prodOT?.autoRenew?.title,
        benefits: pageOT?.autoRenew?.benefits ?? prodOT?.autoRenew?.benefits,
        showTrialPack: (pageOT?.autoRenew?.showTrialPack ?? prodOT?.autoRenew?.showTrialPack) ?? undefined,
        trialPackImage: resolveImageUrl(pageOT?.autoRenew?.trialPackImage ?? prodOT?.autoRenew?.trialPackImage),
        trialPackTitle: (pageOT?.autoRenew?.trialPackTitle ?? prodOT?.autoRenew?.trialPackTitle) ?? undefined,
        trialPackDescription: (pageOT?.autoRenew?.trialPackDescription ?? prodOT?.autoRenew?.trialPackDescription) ?? undefined,
      }
    : undefined;
  const mergedOneTime = pageOT?.oneTimePurchase || prodOT?.oneTimePurchase
    ? {
        title: pageOT?.oneTimePurchase?.title ?? prodOT?.oneTimePurchase?.title,
        benefits: pageOT?.oneTimePurchase?.benefits ?? prodOT?.oneTimePurchase?.benefits,
      }
    : undefined;

  return {
    rating: data.rating,
    reviewCount: data.reviewCount,
    productTitle: data.titleOverride || product?.title,
    images: images.length > 0 ? images : undefined,
    sizeImages: Object.keys(sizeImages).length > 0 ? sizeImages : undefined,
    orderTypeConfig: mergedAutoRenew || mergedOneTime
      ? {
          autoRenew: mergedAutoRenew,
          oneTimePurchase: mergedOneTime,
        }
      : undefined,
    upsellProducts: data.upsellProducts?.length
      ? data.upsellProducts.map((item) => ({
          title: item.product.title,
          onetimePrice: item.product.pricing?.oneTimePurchase,
          subscriptionPrice: item.product.pricing?.autoRenew,
          imageUrl: resolveImageUrl(item.variantImage ?? item.product.thumbnail) || '',
          shopifyVariantId: item.shopifyVariantId,
          shopifySellingPlanId: item.product.shopifySellingPlanId,
        }))
      : undefined,
    hideSizeSelector: data.hideSizeSelector,
    preselectedSize: data.preselectedSize,
    bundleItems: data.bundleItems,
    features: data.features?.length
      ? data.features.map((f) => ({
          icon: resolveImageUrl(f.icon) || '',
          label: f.label,
        }))
      : undefined,
    accordionItems: data.accordionItems?.length ? data.accordionItems : undefined,
  };
}

export function renderSanityComponent(component: SanityComponent) {
  const key = component._key;

  switch (component._type) {
    case 'titleBanner':
      return <TitleBanner key={key} {...transformTitleBanner(component)} />;
    case 'contentBanner':
      return <ContentBanner key={key} {...transformContentBanner(component)} />;
    case 'productCardHero':
      return <ProductCardHero key={key} {...transformProductCardHero(component)} />;
    case 'comparisonTable':
      return <ComparisonTable key={key} {...transformComparisonTable(component)} />;
    case 'diptychMediaTitle':
      return <DiptychMediaTitle key={key} {...transformDiptychMediaTitle(component)} />;
    case 'safetyStandards':
      return <SafetyStandards key={key} {...transformSafetyStandards(component)} />;
    case 'listicle':
      return <Listicle key={key} {...transformListicle(component)} />;
    case 'usp2':
      return <USP2 key={key} {...transformUSP2(component)} />;
    case 'ctaBanner':
      return <CTABanner key={key} {...transformCTABanner(component)} />;
    case 'pressTestimonials':
      return <PressTestimonials key={key} {...transformPressTestimonials(component)} />;
    case 'awardSlideshow':
      return <AwardSlideshow key={key} {...transformAwardSlideshow(component)} />;
    case 'socialPosts':
      return <SocialPosts key={key} {...transformSocialPosts(component)} />;
    case 'diaperIssueBreakdown':
      return <DiaperIssueBreakdown key={key} {...transformDiaperIssueBreakdown(component)} />;
    case 'diaperMythReality':
      return <DiaperMythReality key={key} {...transformDiaperMythReality(component)} />;
    case 'diaperProblemSolver':
      return <DiaperProblemSolver key={key} {...transformDiaperProblemSolver(component)} />;
    case 'quote':
      return <Quote key={key} {...transformQuote(component)} />;
    case 'simplePdpHero':
      return <SimplePDPHero key={key} {...transformSimplePdpHero(component)} />;
    case 'announcementBar':
      return <AnnouncementBar key={key} {...transformAnnouncementBar(component)} />;
    case 'quiz':
      return <Quiz key={key} {...transformQuiz(component)} />;
    case 'productCrossSell':
      return <ProductCrossSell key={key} {...transformProductCrossSell(component)} />;
    case 'ugcVideo':
      return <UGCVideo key={key} {...transformUGCVideo(component)} />;
    case 'flexAnnouncementBar':
      return <FlexAnnouncementBar key={key} {...transformFlexAnnouncementBar(component)} />;
    case 'pressStatements':
      return <PressStatements key={key} {...transformPressStatements(component)} />;
    case 'testimonialGrid':
      return <TestimonialGrid key={key} {...transformTestimonialGrid(component)} />;
    case 'simpleStats':
      return <SimpleStats key={key} {...transformSimpleStats(component)} />;
    case 'steppedStats':
      return <SteppedStats key={key} {...transformSteppedStats(component)} />;
    case 'threeColumnTable':
      return <ThreeColumnTable key={key} {...transformThreeColumnTable(component)} />;
    case 'pdpHeroV2':
      return <PDPHeroV2 key={key} {...transformPdpHeroV2(component)} />;
    case 'reviews':
      return <Reviews key={key} {...transformReviews(component)} />;
    case 'reviewsToggle':
      return <ReviewsToggleSection key={key} headline={component.headline} categoryDescriptions={component.categoryDescriptions} testimonials={component.testimonials ?? []} />;
    default:
      console.warn(`Unknown component type: ${(component as { _type: string })._type}`);
      return null;
  }
}
