// Sanity component types
export interface SanityComponent {
  _type: string;
  _key?: string;
  [key: string]: unknown;
}

export interface SanityProductCard {
  product?: {
    _id?: string;
    id?: string;
    title?: string;
    price?: string;
    slug?: {
      current: string;
    };
  };
  title?: string;
  description?: string;
  category?: string;
  badge?: string;
  thumbnail?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
}

export interface SanityBackgroundType {
  type?: 'color' | 'image' | 'video';
  color?: {
    hex: string;
  };
  image?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
  video?: {
    asset?: {
      url: string;
    };
  };
  poster?: {
    asset?: {
      url: string;
    };
  };
}

export interface SanityStandard {
  icon?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
  title?: string;
  description?: string;
}