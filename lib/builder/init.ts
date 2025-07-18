import { builder } from '@builder.io/sdk';

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

if (!BUILDER_API_KEY) {
  console.error('Builder.io API Key Missing');
} else {
  builder.init(BUILDER_API_KEY);
}

export { builder };