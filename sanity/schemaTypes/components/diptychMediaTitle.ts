import { defineType, defineField } from 'sanity'

export const diptychMediaTitle = defineType({
  name: 'diptychMediaTitle',
  title: 'Diptych Media Title',
  type: 'object',
  fields: [
    defineField({
      name: 'imageUrl',
      title: 'Image',
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
      name: 'mainHeading',
      title: 'Main Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leftColumnTitle',
      title: 'Left Column Title',
      type: 'string',
    }),
    defineField({
      name: 'leftColumnContent',
      title: 'Left Column Content',
      type: 'text',
    }),
    defineField({
      name: 'rightColumnTitle',
      title: 'Right Column Title',
      type: 'string',
    }),
    defineField({
      name: 'rightColumnContent',
      title: 'Right Column Content',
      type: 'text',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'color',
    }),
  ],
  preview: {
    select: {
      title: 'mainHeading',
      media: 'imageUrl',
    },
  },
})