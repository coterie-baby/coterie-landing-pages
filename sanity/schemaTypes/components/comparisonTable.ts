import { defineType, defineField } from 'sanity'

export const comparisonTable = defineType({
  name: 'comparisonTable',
  title: 'Comparison Table',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Table Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Column Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
            },
            {
              name: 'highlighted',
              title: 'Highlighted',
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(2),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Row Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [
                {
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Yes', value: 'true' },
                      { title: 'No', value: 'false' },
                    ],
                  },
                },
              ],
            },
            {
              name: 'unit',
              title: 'Unit',
              type: 'string',
            },
            {
              name: 'footnote',
              title: 'Footnote',
              type: 'string',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'footnotes',
      title: 'Footnotes',
      type: 'array',
      of: [
        {
          type: 'string',
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