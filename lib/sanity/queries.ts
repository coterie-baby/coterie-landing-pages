import { groq } from 'next-sanity'

export const PRODUCTS_QUERY = groq`*[_type == "product"]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  badge,
  image
}`

export const PRODUCT_QUERY = groq`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  price,
  description,
  category,
  badge,
  image
}`

export const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  content
}`