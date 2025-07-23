import { defineType, defineField } from 'sanity'

export const titleBanner = defineType({
  name: 'titleBanner',
  title: 'Title Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheader',
      title: 'Subheader',
      type: 'text',
    }),
    defineField({
      name: 'fullHeight',
      title: 'Full Height',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'backgroundImage',
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
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Button Label',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'href',
          title: 'Button Link',
          type: 'url',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'subheader',
      media: 'backgroundImage',
    },
  },
})