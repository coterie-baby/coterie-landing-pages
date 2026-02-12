import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { client } from '@/lib/sanity/client';

const token = process.env.SANITY_API_READ_TOKEN;

export async function GET(request: Request) {
  if (!token) {
    return new Response('Preview token not configured', { status: 500 });
  }

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    client.withConfig({ token }),
    request.url
  );

  if (!isValid) {
    return new Response('Invalid preview URL', { status: 401 });
  }

  (await draftMode()).enable();
  redirect(redirectTo);
}
