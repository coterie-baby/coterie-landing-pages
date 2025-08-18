export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  url?: string;
}

export interface SanityColor {
  hex: string;
  alpha?: number;
}

export interface SanityButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface TitleBannerComponent {
  _type: 'titleBanner';
  _key: string;
  headline?: string;
  subheader?: string;
  fullHeight?: boolean;
  backgroundImage?: SanityImage;
  backgroundColor?: SanityColor;
  button?: SanityButton;
}

export interface ProductCardHeroComponent {
  _type: 'productCardHero';
  _key: string;
  headline?: string;
  subheading?: string;
  variant?: string;
  cards?: SanityProductCard[];
  background?: {
    type: 'color' | 'image' | 'video';
    color?: SanityColor;
    image?: SanityImage;
    video?: {
      asset: {
        url: string;
      };
    };
    poster?: SanityImage;
  };
}

export interface SanityProductCard {
  _key: string;
  title: string;
  description?: string;
  category?: string;
  badge?: string;
  thumbnail?: SanityImage;
  product?: {
    _id: string;
    id?: string;
    title: string;
    price?: string;
    slug?: {
      current: string;
    };
  };
}

export interface ComparisonTableComponent {
  _type: 'comparisonTable';
  _key: string;
  title?: string;
  columns?: Array<{
    name: string;
    subtitle?: string;
    highlighted?: boolean;
  }>;
  rows?: Array<{
    label: string;
    description?: string;
    values: (string | boolean | { value: string })[];
    unit?: string;
    footnote?: string;
  }>;
  footnotes?: (string | { footnote: string })[];
}

export interface DiptychMediaTitleComponent {
  _type: 'diptychMediaTitle';
  _key: string;
  imageUrl?: SanityImage;
  mainHeading?: string;
  leftColumnTitle?: string;
  leftColumnContent?: string;
  rightColumnTitle?: string;
  rightColumnContent?: string;
  imagePosition?: 'left' | 'right';
  backgroundColor?: SanityColor;
}

export interface USP2Component {
  _type: 'usp2';
  _key: string;
  headline?: string;
  cards?: 2 | 3;
  productCards?: Array<{
    _key: string;
    _type: string;
    featuredImage: SanityImage;
    headline: string;
    bodyCopy?: string;
  }>;
}

export interface SafetyStandardsComponent {
  _type: 'safetyStandards';
  _key: string;
  title?: string;
  description?: string;
  standards?: Array<{
    icon: SanityImage;
    title: string;
    description: string;
  }>;
  ctaButton?: SanityButton;
}

export interface ContentBannerComponent {
  _type: 'contentBanner';
  _key: string;
  headline?: string;
  subheader?: string;
  backgroundImage?: SanityImage;
  backgroundColor?: SanityColor;
  overlay?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;
  position?: 'top' | 'middle' | 'bottom';
  button?: SanityButton;
}

export interface ListicleContentComponent {
  _type: 'listicleContent';
  _key: string;
  headline: string;
  description: string;
  featuredImage: SanityImage;
  button?: SanityButton;
  reverse?: boolean;
}

export interface ListicleComponent {
  _type: 'listicle';
  _key: string;
  banner: ContentBannerComponent;
  listItems: ListicleContentComponent[];
}

export type SanityComponent =
  | TitleBannerComponent
  | ContentBannerComponent
  | ProductCardHeroComponent
  | ComparisonTableComponent
  | DiptychMediaTitleComponent
  | USP2Component
  | SafetyStandardsComponent
  | ListicleComponent;

export interface TargetingRule {
  parameterType: 'query' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content';
  parameterName?: string;
  value: string;
  matchType: 'exact' | 'contains' | 'startsWith';
}

export interface AudienceVariant {
  name: string;
  description?: string;
  targetingRules: TargetingRule[];
  components: SanityComponent[];
}

export interface AudienceTargeting {
  enabled: boolean;
  variants: AudienceVariant[];
}

export interface LandingPage {
  _id: string;
  _type: 'page';
  title: string;
  slug: {
    current: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    noIndex?: boolean;
  };
  audienceTargeting?: AudienceTargeting;
  components?: SanityComponent[];
}
