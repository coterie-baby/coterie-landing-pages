'use client';
import { ComponentProps } from 'react';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import { builder } from '@builder.io/sdk';
import DefaultErrorPage from 'next/error';
import '@/lib/builder/registry';

type BuilderPageProps = ComponentProps<typeof BuilderComponent>;

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

if (!BUILDER_API_KEY) {
  console.error('Builder.io API Key Missing');
} else {
  builder.init(BUILDER_API_KEY);
}

export function RenderBuilderContent(props: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();

  if (props.content || isPreviewing) {
    return <BuilderComponent {...props} />;
  }

  return <DefaultErrorPage statusCode={404} />;
}
