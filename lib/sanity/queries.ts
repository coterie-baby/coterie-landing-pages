import { groq } from 'next-sanity'

// Product queries
export const productsQuery = groq`
  *[_type == "product"] {
    _id,
    title,
    slug,
    price,
    description,
    category,
    badge,
    image {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    price,
    description,
    category,
    badge,
    image {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`

// Landing page queries
export const landingPagesQuery = groq`
  *[_type == "landingPage"] {
    _id,
    title,
    path,
    slug,
    seo {
      title,
      description
    },
    components[] {
      _type,
      _key,
      ...,
      backgroundImage {
        asset->{
          _id,
          url
        },
        alt
      }
    }
  }
`

export const landingPageByPathQuery = groq`
  *[_type == "landingPage" && path == $path][0] {
    _id,
    title,
    path,
    slug,
    seo {
      title,
      description
    },
    components[] {
      _type,
      _key,
      ...,
      backgroundImage {
        asset->{
          _id,
          url
        },
        alt
      },
      cards[] {
        ...,
        thumbnail {
          asset->{
            _id,
            url
          },
          alt
        }
      }
    }
  }
`

export const allPagePathsQuery = groq`
  *[_type == "landingPage" && defined(path)] {
    path
  }
`

// Backward compatibility
export const landingPageBySlugQuery = landingPageByPathQuery;

// Blog queries
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    author->{
      name,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    body,
    author->{
      name,
      bio,
      image {
        asset->{
          _id,
          url
        },
        alt
      }
    },
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`