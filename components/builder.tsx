'use client';
import { ComponentProps } from 'react';
import { BuilderComponent, useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import '@/lib/builder/init';
import '@/lib/builder/registry';

type BuilderPageProps = ComponentProps<typeof BuilderComponent>;

export function RenderBuilderContent(props: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();

  if (props.content || isPreviewing) {
    return <BuilderComponent {...props} />;
  }

  return <DefaultErrorPage statusCode={404} />;
}
