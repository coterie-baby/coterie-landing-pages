import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  alt?: string;
}

export interface SanityColor {
  _type: 'color';
  hex: string;
  rgb?: { r: number; g: number; b: number; a: number };
  hsl?: { h: number; s: number; l: number; a: number };
}

export interface SanityButton {
  label: string;
  href: string;
}

// Component types matching Sanity schemas

export interface SanityTitleBanner {
  _type: 'titleBanner';
  _key: string;
  headline: string;
  subheader?: string;
  fullHeight?: boolean;
  backgroundImage?: SanityImage;
  backgroundColor?: SanityColor;
  button?: SanityButton;
}

export interface SanityContentBanner {
  _type: 'contentBanner';
  _key: string;
  headline: string;
  subheader?: string;
  backgroundImage?: SanityImage;
  backgroundColor?: SanityColor;
  overlay?: number;
  position?: 'top' | 'middle' | 'bottom';
  button?: SanityButton;
}

export interface SanityProductCardHero {
  _type: 'productCardHero';
  _key: string;
  headline: string;
  subheading?: string;
  variant?: '2-card' | '3-card';
  cards: {
    product?: {
      _id: string;
      title: string;
      slug?: { current: string };
      shortDescription?: string;
      pricing?: {
        oneTimePurchase?: number;
        autoRenew?: number;
      };
    };
    title?: string;
    description?: string;
    category?: string;
    badge?: string;
    thumbnail?: SanityImage;
  }[];
  background?: {
    type: 'color' | 'image' | 'video';
    color?: SanityColor;
    image?: SanityImage;
    video?: { asset: { url: string } };
    poster?: SanityImage;
  };
}

export interface SanityComparisonTable {
  _type: 'comparisonTable';
  _key: string;
  title: string;
  columns: {
    name: string;
    subtitle?: string;
    highlighted?: boolean;
  }[];
  rows: {
    label: string;
    description?: string;
    values: string[];
    unit?: string;
    footnote?: string;
  }[];
  footnotes?: string[];
}

export interface SanityDiptychMediaTitle {
  _type: 'diptychMediaTitle';
  _key: string;
  imageUrl?: SanityImage;
  mainHeading: string;
  leftColumnTitle?: string;
  leftColumnContent?: string;
  rightColumnTitle?: string;
  rightColumnContent?: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: SanityColor;
}

export interface SanitySafetyStandards {
  _type: 'safetyStandards';
  _key: string;
  title?: string;
  description?: string;
  standards?: {
    icon?: SanityImage;
    title: string;
    description?: string;
  }[];
  ctaButton?: SanityButton;
}

export interface SanityListicleContent {
  _type: 'listicleContent';
  _key: string;
  headline: string;
  description: string;
  featuredImage: SanityImage;
  button?: SanityButton;
  reverse?: boolean;
}

export interface SanityListicle {
  _type: 'listicle';
  _key: string;
  banner: SanityContentBanner;
  listItems: SanityListicleContent[];
}

export interface SanityUSP2 {
  _type: 'usp2';
  _key: string;
  headline: string;
  cards?: number;
  productCards?: {
    headline: string;
    bodyCopy?: string;
    featuredImage?: SanityImage;
  }[];
}

// New component types

export interface SanityCTABanner {
  _type: 'ctaBanner';
  _key: string;
  headline?: string;
  button?: SanityButton;
  backgroundColor?: SanityColor;
  textColor?: SanityColor;
}

export interface SanityPressTestimonials {
  _type: 'pressTestimonials';
  _key: string;
  testimonials?: {
    quote: string;
    source: string;
    publication?: string;
  }[];
}

export interface SanityAwardSlideshow {
  _type: 'awardSlideshow';
  _key: string;
  eyebrowText?: string;
  autoPlayInterval?: number;
  awards?: {
    heroText: string;
    subText: string;
    backgroundImage?: SanityImage;
  }[];
  awardIcons?: SanityImage[];
}

export interface SanitySocialPosts {
  _type: 'socialPosts';
  _key: string;
  title?: string;
  subtitle?: string;
  backgroundColor?: SanityColor;
  posts?: {
    username: string;
    image?: SanityImage;
  }[];
}

export interface SanityDiaperIssueBreakdown {
  _type: 'diaperIssueBreakdown';
  _key: string;
  title?: string;
  subtitle?: string;
  issues?: {
    issue: string;
    parentThought: string;
    actualCause: string;
    howCoterieHelps: string;
  }[];
}

export interface SanityDiaperMythReality {
  _type: 'diaperMythReality';
  _key: string;
  title?: string;
  subtitle?: string;
  items?: {
    myth: string;
    reality: string;
    explanation: string;
  }[];
}

export interface SanityDiaperProblemSolver {
  _type: 'diaperProblemSolver';
  _key: string;
  title?: string;
  subtitle?: string;
  problems?: {
    problem: string;
    symptom: string;
    rootCause: string;
    solution: string;
  }[];
}

export interface SanityQuote {
  _type: 'quote';
  _key: string;
  quote: string;
  authorName?: string;
  authorPosition?: string;
  authorImage?: SanityImage;
}

export interface SanitySimplePdpHero {
  _type: 'simplePdpHero';
  _key: string;
  image?: SanityImage;
  title?: string;
  description?: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
}

export interface SanityAnnouncementBar {
  _type: 'announcementBar';
  _key: string;
  announcement?: string;
}

export interface SanityQuiz {
  _type: 'quiz';
  _key: string;
  title?: string;
  questions?: {
    question: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
}

export interface SanityProductCrossSell {
  _type: 'productCrossSell';
  _key: string;
  headline?: string;
  products?: {
    _id: string;
    title: string;
    slug?: { current: string };
    shortDescription?: string;
    category?: string;
    thumbnail?: SanityImage;
    pricing?: {
      oneTimePurchase?: number;
      autoRenew?: number;
    };
  }[];
}

export interface SanityUGCVideo {
  _type: 'ugcVideo';
  _key: string;
  videoUrl: string;
  posterImage?: SanityImage;
}

export interface SanityFlexAnnouncementBar {
  _type: 'flexAnnouncementBar';
  _key: string;
  announcement?: string;
  showStars?: boolean;
  rating?: number;
}

export interface SanityPressStatements {
  _type: 'pressStatements';
  _key: string;
  statements?: {
    outlet: string;
    logo?: SanityImage;
    quote?: string;
    showStars?: boolean;
    starText?: string;
  }[];
}

export interface SanityTestimonialGrid {
  _type: 'testimonialGrid';
  _key: string;
  eyebrow?: string;
  headline?: string;
  testimonials?: {
    body: string;
    authorName: string;
    authorHandle: string;
    authorImage?: SanityImage;
  }[];
}

export interface SanitySimpleStats {
  _type: 'simpleStats';
  _key: string;
  stats?: {
    value: string;
    name: string;
  }[];
}

export interface SanitySteppedStats {
  _type: 'steppedStats';
  _key: string;
  headline?: string;
  description?: string;
  stats?: {
    value: string;
    title: string;
    description?: string;
    color?: 'light' | 'dark' | 'brand';
  }[];
}

export interface SanityThreeColumnTable {
  _type: 'threeColumnTable';
  _key: string;
  headline?: string;
  sidebarLabels?: string[];
  tabs?: {
    title: string;
    buttonText?: string;
    col2Header?: string;
    col3Header?: string;
    rows?: {
      label: string;
      col2?: string;
      col3?: string;
    }[];
  }[];
}

export interface BundleItem {
  _key: string;
  productTitle: string;
  sizeLabel?: string;
  shopifyVariantId?: string;
  shopifySellingPlanId?: string;
  quantity: number;
}

export interface SanityPdpHeroV2 {
  _type: 'pdpHeroV2';
  _key: string;
  product?: {
    _id: string;
    title: string;
    images?: {
      image?: SanityImage;
      alt?: string;
    }[];
    sizes?: {
      sizeKey: string;
      featuredImage?: SanityImage;
    }[];
    orderTypes?: {
      autoRenew?: {
        badgeText?: string;
        title?: string;
        benefits?: string[];
        showTrialPack?: boolean;
        trialPackImage?: SanityImage;
        trialPackTitle?: string;
        trialPackDescription?: string;
      };
      oneTimePurchase?: {
        title?: string;
        benefits?: string[];
      };
    };
  };
  rating?: number;
  reviewCount?: number;
  titleOverride?: string;
  images?: {
    image?: SanityImage;
    alt?: string;
  }[];
  upsellProducts?: {
    product: {
      _id: string;
      title: string;
      thumbnail?: SanityImage;
      pricing?: {
        oneTimePurchase?: number;
        autoRenew?: number;
      };
      shopifySellingPlanId?: string;
    };
    sizeKey?: string;
    variantImage?: SanityImage;
    shopifyVariantId?: string;
  }[];
  hideSizeSelector?: boolean;
  preselectedSize?: string;
  bundleItems?: BundleItem[];
  features?: {
    icon?: SanityImage;
    label: string;
  }[];
  accordionItems?: {
    title: string;
    content?: PortableTextBlock[];
  }[];
  orderTypes?: {
    autoRenew?: {
      badgeText?: string;
      title?: string;
      benefits?: string[];
      showTrialPack?: boolean;
      trialPackImage?: SanityImage;
      trialPackTitle?: string;
      trialPackDescription?: string;
    };
    oneTimePurchase?: {
      title?: string;
      benefits?: string[];
    };
  };
}

export interface SanityReviews {
  _type: 'reviews';
  _key: string;
  product?: { _id: string; shopifyProductId?: string };
}

export interface SanityReviewsTestimonial {
  category: string;
  text: string;
  author: string;
  rating: number;
}

export interface SanityReviewsToggle {
  _type: 'reviewsToggle';
  _key: string;
  headline?: string;
  categoryDescriptions?: { category: string; description: string }[];
  testimonials?: SanityReviewsTestimonial[];
}

export type SanityComponent =
  | SanityTitleBanner
  | SanityContentBanner
  | SanityProductCardHero
  | SanityComparisonTable
  | SanityDiptychMediaTitle
  | SanitySafetyStandards
  | SanityListicle
  | SanityUSP2
  | SanityCTABanner
  | SanityPressTestimonials
  | SanityAwardSlideshow
  | SanitySocialPosts
  | SanityDiaperIssueBreakdown
  | SanityDiaperMythReality
  | SanityDiaperProblemSolver
  | SanityQuote
  | SanitySimplePdpHero
  | SanityAnnouncementBar
  | SanityQuiz
  | SanityProductCrossSell
  | SanityUGCVideo
  | SanityFlexAnnouncementBar
  | SanityPressStatements
  | SanityTestimonialGrid
  | SanitySimpleStats
  | SanitySteppedStats
  | SanityThreeColumnTable
  | SanityPdpHeroV2
  | SanityReviews
  | SanityReviewsToggle
  | SanityScrollTimeline
  | SanityValuePropCards;

export interface SanityValuePropCard {
  title: string;
  subtitle?: string;
  image?: SanityImage;
  label?: string;
  modalDescription?: string;
  modalSectionLabel?: string;
  modalSectionText?: string;
  modalImage?: SanityImage;
  modalLinkText?: string;
  modalLinkUrl?: string;
}

export interface SanityValuePropCards {
  _type: 'valuePropCards';
  _key: string;
  headline?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  cards?: SanityValuePropCard[];
}

export interface SanityScrollTimeline {
  _type: 'scrollTimeline';
  _key: string;
  image?: SanityImage;
  title?: string;
  description?: string;
  items?: { subheading: string; description: string }[];
}

export interface FunnelRoute {
  _key: string;
  name: string;
  destinationType?: 'page' | 'url';
  targetSlug?: string;
  targetUrl?: string;
  weight: number;
}

export interface Funnel {
  sourcePath: string;
  targetSlug: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  routes?: FunnelRoute[];
}

export interface SiteSettings {
  desktopRedirect?: {
    enabled?: boolean;
    destinationUrl?: string;
    requireUtmParams?: boolean;
  };
}

export interface SanityPage {
  _id: string;
  _type: 'page';
  title: string;
  slug: { current: string };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImage;
    noIndex?: boolean;
  };
  components: SanityComponent[];
}
