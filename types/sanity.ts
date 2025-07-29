export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  url?: string
}

export interface SanityColor {
  hex: string
  alpha?: number
}

export interface SanityButton {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
}

export interface TitleBannerComponent {
  _type: 'titleBanner'
  _key: string
  headline?: string
  subheader?: string
  fullHeight?: boolean
  backgroundImage?: SanityImage
  backgroundColor?: SanityColor
  button?: SanityButton
}

export interface ProductCardHeroComponent {
  _type: 'productCardHero'
  _key: string
  headline?: string
  subheading?: string
  variant?: string
  cards?: SanityProductCard[]
  background?: {
    type: 'color' | 'image' | 'video'
    color?: SanityColor
    image?: SanityImage
    video?: {
      asset: {
        url: string
      }
    }
    poster?: SanityImage
  }
}

export interface SanityProductCard {
  _key: string
  title: string
  description?: string
  category?: string
  badge?: string
  thumbnail?: SanityImage
  product?: {
    _id: string
    id?: string
    title: string
    price?: string
    slug?: {
      current: string
    }
  }
}

export interface ComparisonTableComponent {
  _type: 'comparisonTable'
  _key: string
  title?: string
  columns?: any[]
  rows?: any[]
  footnotes?: string[]
}

export interface DiptychMediaTitleComponent {
  _type: 'diptychMediaTitle'
  _key: string
  imageUrl?: SanityImage
  mainHeading?: string
  leftColumnTitle?: string
  leftColumnContent?: string
  rightColumnTitle?: string
  rightColumnContent?: string
  imagePosition?: 'left' | 'right'
  backgroundColor?: SanityColor
}

export interface SafetyStandardsComponent {
  _type: 'safetyStandards'
  _key: string
  title?: string
  description?: string
  standards?: Array<{
    icon: SanityImage
    title: string
    description: string
  }>
  ctaButton?: SanityButton
}

export interface ContentBannerComponent {
  _type: 'contentBanner'
  _key: string
  headline?: string
  subheader?: string
  backgroundImage?: SanityImage
  overlay?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90
  position?: 'top' | 'middle' | 'bottom'
  button?: SanityButton
}

export type SanityComponent =
  | TitleBannerComponent
  | ContentBannerComponent
  | ProductCardHeroComponent
  | ComparisonTableComponent
  | DiptychMediaTitleComponent
  | SafetyStandardsComponent

export interface LandingPage {
  _id: string
  _type: 'page'
  title: string
  slug: {
    current: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    noIndex?: boolean
  }
  components?: SanityComponent[]
}