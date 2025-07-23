import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schemaTypes'

const plugins = [structureTool(), colorInput()]

// Only add visionTool in development
if (process.env.NODE_ENV === 'development') {
  const { visionTool } = require('@sanity/vision')
  plugins.push(visionTool())
}

export default defineConfig({
  name: 'default',
  title: 'Coterie Landing Pages',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  plugins,

  schema: {
    types: schemaTypes,
  },
})