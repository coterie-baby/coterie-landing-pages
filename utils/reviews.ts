interface ReviewsParams {
  productId?: string;
  page?: number;
  customFilters?: Record<string, string | number | boolean>;
}

export async function getReviews({ productId, page = 1, customFilters = {} }: ReviewsParams) {
  try {
    const url = `https://www.coterie.com/api/yotpo/${productId}/search-reviews`;
    const payload = {
      page,
      customFilters,
    };

    const reviews = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return reviews;
  } catch (error) {
    // Silently fail - caller handles error state
  }
}

export async function voteReview(reviewId: number, voteType: 'up' | 'down') {
  try {
    const url = `https://www.coterie.com/api/yotpo/${reviewId}/vote/${voteType}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
}
