import { defineType, defineField } from 'sanity'

export const safetyStandards = defineType({
  name: 'safetyStandards',
  title: 'Safety Standards',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Safety Standards',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'standards',
      title: 'Safety Standards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
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
            {
              name: 'title',
              title: 'Standard Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Standard Description',
              type: 'text',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Button Label',
          type: 'string',
        },
        {
          name: 'href',
          title: 'Button Link',
          type: 'url',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})