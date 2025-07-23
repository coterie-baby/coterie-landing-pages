import { NextRequest, NextResponse } from 'next/server';
import { revalidatePage, revalidateAllPages } from '@/lib/sanity/revalidation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook secret if provided
    const secret = request.nextUrl.searchParams.get('secret');
    if (process.env.SANITY_REVALIDATE_SECRET && secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Handle different types of updates
    const { _type, path } = body;

    if (_type === 'landingPage') {
      if (path) {
        // Revalidate specific page
        revalidatePage(path);
        return NextResponse.json({ 
          message: `Revalidated page: ${path}`,
          revalidated: true 
        });
      } else {
        // If no path provided, revalidate all pages
        revalidateAllPages();
        return NextResponse.json({ 
          message: 'Revalidated all pages',
          revalidated: true 
        });
      }
    }

    // Default: revalidate all pages
    revalidateAllPages();
    return NextResponse.json({ 
      message: 'Revalidated all pages',
      revalidated: true 
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}