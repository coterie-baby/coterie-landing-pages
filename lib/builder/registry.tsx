import { Builder } from '@builder.io/react';
import dynamic from 'next/dynamic';

Builder.registerComponent(
  dynamic(() => import('@/components/title-banner')),
  {
    name: 'Title Banner',
    inputs: [
      {
        name: 'headline',
        type: 'string',
        required: true,
      },
      {
        name: 'subheader',
        type: 'longText',
      },
      {
        name: 'fullHeight',
        type: 'boolean',
        defaultValue: false,
      },
      {
        name: 'backgroundImage',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
      },
      {
        name: 'backgroundColor',
        type: 'color',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/comparison-table')),
  {
    name: 'Comparison Table',
    inputs: [
      {
        name: 'title',
        type: 'string',
        required: true,
        defaultValue: 'Comparison Table',
      },
      {
        name: 'columns',
        type: 'list',
        required: true,
        subFields: [
          {
            name: 'name',
            type: 'string',
            required: true,
            defaultValue: 'Column Name',
          },
          {
            name: 'subtitle',
            type: 'string',
          },
          {
            name: 'highlighted',
            type: 'boolean',
            defaultValue: false,
          },
        ],
        defaultValue: [
          {
            name: 'Our Product',
            subtitle: 'Premium',
            highlighted: true,
          },
          {
            name: 'Competitor',
            subtitle: 'Standard',
            highlighted: false,
          },
        ],
      },
      {
        name: 'rows',
        type: 'list',
        required: true,
        subFields: [
          {
            name: 'label',
            type: 'string',
            required: true,
            defaultValue: 'Feature',
          },
          {
            name: 'description',
            type: 'string',
          },
          {
            name: 'values',
            type: 'list',
            subFields: [
              {
                name: 'value',
                type: 'string',
                required: true,
              },
            ],
            defaultValue: [{ value: 'Yes' }, { value: 'No' }],
          },
          {
            name: 'unit',
            type: 'string',
          },
          {
            name: 'footnote',
            type: 'string',
          },
        ],
        defaultValue: [
          {
            label: 'Premium Quality',
            description: '(higher is better)',
            values: [{ value: 'true' }, { value: 'false' }],
            unit: '',
            footnote: '',
          },
          {
            label: 'Price Point',
            description: '',
            values: [{ value: '$29.99' }, { value: '$19.99' }],
            unit: '',
            footnote: '',
          },
        ],
      },
      {
        name: 'footnotes',
        type: 'list',
        subFields: [
          {
            name: 'footnote',
            type: 'longText',
            required: true,
          },
        ],
        defaultValue: [
          {
            footnote: 'Based on industry standard testing methodology.',
          },
        ],
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/reviews')),
  {
    name: 'Product Reviews',
    inputs: [
      {
        name: 'productId',
        type: 'string',
        required: true,
        defaultValue: '4471557914690',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/usp2')),
  {
    name: 'USP2',
    inputs: [
      {
        name: 'cards',
        type: 'number',
        defaultValue: 3,
      },
      {
        name: 'productCards',
        type: 'list',
        subFields: [
          {
            name: 'image',
            type: 'file',
            allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
            required: true,
          },
          {
            name: 'headline',
            type: 'string',
            required: true,
          },
          {
            name: 'bodyCopy',
            type: 'longText',
            required: true,
          },
        ],
        defaultValue: [
          {
            image: "https://cdn.sanity.io/images/e4q6bkl9/production/5da7c8766e7d65c99fd249291e84f0faaef4adb8-1000x1000.png?w=960&h=960&q=100&fit=crop&auto=format",
            headline: "The Diaper",
            bodyCopy: "Designed to be highly absorbent and fast-wicking to minimize leaks"
          }
        ],
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/product-card-hero')),
  {
    name: 'ProductCardHero',
    inputs: [
      {
        name: 'headline',
        type: 'string',
        required: true,
        defaultValue: 'Your Headline Here',
      },
      {
        name: 'subheading',
        type: 'string',
        defaultValue: 'Your subheading text here',
      },
      {
        name: 'variant',
        type: 'string',
        enum: ['3-card', '2-card'],
        defaultValue: '3-card',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/diptych-media-title')),
  {
    name: 'Diptych Media Title',
    inputs: [
      {
        name: 'imageUrl',
        type: 'file',
        allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg', 'webp'],
        defaultValue: '/images/child-outdoor.png',
      },
      {
        name: 'imageAlt',
        type: 'string',
        defaultValue: 'Child wearing tie-dye shirt outdoors',
      },
      {
        name: 'mainHeading',
        type: 'string',
        defaultValue: 'Our products undergo dual safety testing:',
      },
      {
        name: 'leftColumnTitle',
        type: 'string',
        defaultValue: 'Chemical compound testing',
      },
      {
        name: 'leftColumnContent',
        type: 'richText',
        defaultValue:
          'Our products are proven to be free, below detectable levels, or (when regulation exists) significantly below allowed levels of 200+ chemicals that may be considered toxic or harmful for use. We continually update what we test for as regulations and awareness of ingredient safety evolve.',
      },
      {
        name: 'rightColumnTitle',
        type: 'string',
        defaultValue: 'Clinical HRIPT testing',
      },
      {
        name: 'rightColumnContent',
        type: 'richText',
        defaultValue:
          "All materials that may come in contact with your baby's skin undergo clinical testing for allergenicity and sensitization, and are proven hypoallergenic in independent labs under the supervision of board-certified dermatologists.",
      },
      {
        name: 'imagePosition',
        type: 'string',
        enum: ['left', 'right'],
        defaultValue: 'left',
      },
      {
        name: 'backgroundColor',
        type: 'color',
        defaultValue: '#ffffff',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/product-cross-sell')),
  {
    name: 'Product Cross Sell',
    inputs: [
      {
        name: 'headline',
        type: 'string',
        required: true,
        defaultValue: 'Shop More Diapering Essentials',
      },
      {
        name: 'products',
        type: 'list',
        subFields: [
          {
            name: 'product',
            type: 'reference',
            model: 'product',
            required: true,
            helperText: 'Select a product from your product catalog',
          },
        ],
        defaultValue: [],
        helperText: 'Add products to display in the cross-sell section',
      },
    ],
  }
);

Builder.registerComponent(
  dynamic(() => import('@/components/three-column-table')),
  {
    name: 'Three Column Table',
  }
);
