interface ReviewsParams {
  productId?: string;
  page?: number;
  scores?: number[];
  customFilters?: Record<string, string | number | boolean>;
}

export async function getReviews({ productId, page = 1, scores, customFilters = {} }: ReviewsParams) {
  try {
    const url = `https://www.coterie.com/api/yotpo/${productId}/search-reviews`;
    const payload: Record<string, unknown> = {
      page,
      customFilters,
    };

    if (scores && scores.length > 0) {
      payload.scores = scores;
    }

    const reviews = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return reviews;
  } catch {
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
