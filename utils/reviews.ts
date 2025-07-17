interface ReviewsParams {
  productId?: string;
  page?: number;
  customFilters?: Record<string, string | number | boolean>;
}

export async function getReviews({ productId, page = 1, customFilters = {} }: ReviewsParams) {
  console.log('getReviews called with:', { productId, page, customFilters });
  
  try {
    const url = `https://www.coterie.com/api/yotpo/${productId}/search-reviews`;
    const payload = {
      page,
      customFilters,
    };
    
    console.log('Making fetch request to:', url);
    console.log('Request payload:', payload);
    
    const reviews = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Fetch response:', reviews.status, reviews.statusText);
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews', error);
  }
}

export async function voteReview(reviewId: number, voteType: 'up' | 'down') {
  console.log('voteReview called with:', { reviewId, voteType });
  
  try {
    const url = `https://www.coterie.com/api/yotpo/${reviewId}/vote/${voteType}`;
    
    console.log('Making vote request to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Vote response:', response.status, response.statusText);
    return response;
  } catch (error) {
    console.error('Error voting on review:', error);
    throw error;
  }
}
