import { defineType, defineField } from 'sanity'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'path',
      title: 'URL Path',
      type: 'string',
      description: 'The full URL path where this page should be accessible (e.g., "/about", "/products/diapers", "/")',
      validation: (Rule) => 
        Rule.required()
          .custom((path) => {
            if (!path) return 'Path is required';
            if (!path.startsWith('/')) return 'Path must start with "/"';
            if (path !== '/' && path.endsWith('/')) return 'Path should not end with "/" unless it is the root path';
            if (path.includes('//')) return 'Path cannot contain double slashes';
            // Check for invalid characters
            if (!/^\/[a-zA-Z0-9\-_\/]*$/.test(path)) return 'Path can only contain letters, numbers, hyphens, underscores, and forward slashes';
            return true;
          })
          .custom(async (path, context) => {
            if (!path) return true; // Let the required validation handle this
            
            // Import validation function
            const { validateUniquePath } = await import('../lib/pathValidation');
            const result = await validateUniquePath(path, context.document?._id);
            
            return result === true ? true : result;
          }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (Auto-generated)',
      type: 'slug',
      description: 'Auto-generated from path for internal use',
      options: {
        source: 'path',
        maxLength: 96,
        slugify: (input: string) => {
          // Convert path to slug by removing leading slash and replacing remaining slashes with hyphens
          return input
            .replace(/^\/+/, '') // Remove leading slashes
            .replace(/\/+$/, '') // Remove trailing slashes
            .replace(/\/+/g, '-') // Replace slashes with hyphens
            .toLowerCase();
        },
      },
      readOnly: true,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'SEO Description',
          type: 'text',
        },
      ],
    }),
    defineField({
      name: 'components',
      title: 'Page Components',
      type: 'array',
      of: [
        { type: 'titleBanner' },
        { type: 'productCardHero' },
        { type: 'comparisonTable' },
        { type: 'diptychMediaTitle' },
        { type: 'safetyStandards' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      path: 'path',
    },
    prepare({ title, path }) {
      return {
        title,
        subtitle: path || '/',
      };
    },
  },
})