import { revalidatePath, revalidateTag } from 'next/cache';

export function revalidatePage(path: string) {
  // Revalidate the specific path
  revalidatePath(path);
  
  // Also revalidate the catch-all route
  revalidatePath('/[...page]', 'page');
  
  // Revalidate homepage if it's the root path
  if (path === '/') {
    revalidatePath('/');
  }
  
  console.log(`Revalidated path: ${path}`);
}

export function revalidateAllPages() {
  // Revalidate all pages
  revalidateTag('landing-pages');
  revalidatePath('/[...page]', 'page');
  revalidatePath('/');
  
  console.log('Revalidated all pages');
}