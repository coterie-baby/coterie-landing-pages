import { defineType, defineField } from 'sanity'

export const productCardHero = defineType({
  name: 'productCardHero',
  title: 'Product Card Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: '2 Cards', value: '2-card' },
          { title: '3 Cards', value: '3-card' },
        ],
      },
      initialValue: '3-card',
    }),
    defineField({
      name: 'cards',
      title: 'Product Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product Reference',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'title',
              title: 'Custom Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Custom Description',
              type: 'text',
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
            },
            {
              name: 'badge',
              title: 'Badge',
              type: 'string',
            },
            {
              name: 'thumbnail',
              title: 'Thumbnail Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                },
              ],
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Background Type',
          type: 'string',
          options: {
            list: [
              { title: 'Color', value: 'color' },
              { title: 'Image', value: 'image' },
              { title: 'Video', value: 'video' },
            ],
          },
          initialValue: 'color',
        },
        {
          name: 'color',
          title: 'Background Color',
          type: 'color',
          hidden: ({ parent }) => parent?.type !== 'color',
        },
        {
          name: 'image',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
          hidden: ({ parent }) => parent?.type !== 'image',
        },
        {
          name: 'video',
          title: 'Background Video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
          hidden: ({ parent }) => parent?.type !== 'video',
        },
        {
          name: 'poster',
          title: 'Video Poster Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
          ],
          hidden: ({ parent }) => parent?.type !== 'video',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'subheading',
    },
  },
})