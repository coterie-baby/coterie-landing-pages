'use client';

import { useState, useEffect, useCallback } from 'react';
import { getReviews, voteReview } from '../../utils/reviews';
import { ReviewCard } from './review-card';
import { StarRating } from './star-rating';
import { FilterDropdown } from './filter-dropdown';

export interface Review {
  id: number;
  score: number;
  votes_up: number;
  votes_down: number;
  content: string;
  title: string;
  created_at: string;
  verified_buyer: boolean;
  custom_fields: {
    [key: string]: {
      title: string;
      value: string;
    };
  };
  user: {
    display_name: string;
  };
}

interface ApiResponse {
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
  products: Array<{
    name: string;
  }>;
  reviews: Review[];
}

interface ReviewsProps {
  reviews?: Review[];
  totalReviews?: number;
  averageRating?: number;
  productId?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        className="p-1 disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded text-sm ${
            page === currentPage
              ? 'bg-black text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <span className="text-gray-400 px-2">...</span>
      )}

      <button
        className="p-1 disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

export default function Reviews({
  reviews = [],
  totalReviews = 1234,
  averageRating = 4.3,
  productId,
}: ReviewsProps) {
  console.log('Reviews component props:', {
    productId,
    reviews,
    totalReviews,
    averageRating,
  });

  const [ratingFilter, setRatingFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [fetchedReviews, setFetchedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiTotalReviews, setApiTotalReviews] = useState<number | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    page: number;
    per_page: number;
    total: number;
  } | null>(null);

  const fetchReviews = useCallback(
    async (page: number = 1) => {
      console.log('fetchReviews called with:', { productId, page });

      if (!productId) {
        console.log('No productId provided, skipping API call');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Making API call to getReviews with:', { productId, page });
        const response = await getReviews({
          productId,
          page,
          customFilters: {},
        });

        console.log('API response:', response);

        if (response && response.ok) {
          const data: ApiResponse = await response.json();
          console.log('API data received:', data);

          setFetchedReviews(data.reviews);
          setApiTotalReviews(data.pagination.total);
          setPagination(data.pagination);
          setProductName(data.products?.[0]?.name || 'Product');
          setCurrentPage(page);
        } else {
          console.log(
            'API response not ok:',
            response?.status,
            response?.statusText
          );
        }
      } catch (err) {
        setError('Failed to fetch reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  const handleVote = useCallback(
    async (reviewId: number, voteType: 'up' | 'down') => {
      try {
        console.log('Voting on review:', reviewId, voteType);
        const response = await voteReview(reviewId, voteType);

        if (response && response.ok) {
          // Optimistically update the UI
          setFetchedReviews((prev) =>
            prev.map((review) => {
              if (review.id === reviewId) {
                return {
                  ...review,
                  votes_up:
                    voteType === 'up' ? review.votes_up + 1 : review.votes_up,
                  votes_down:
                    voteType === 'down'
                      ? review.votes_down + 1
                      : review.votes_down,
                };
              }
              return review;
            })
          );
        } else {
          console.error('Vote failed:', response?.status, response?.statusText);
        }
      } catch (error) {
        console.error('Error voting:', error);
      }
    },
    []
  );

  const displayTotalReviews =
    apiTotalReviews !== null ? apiTotalReviews : totalReviews;

  const displayAverageRating =
    fetchedReviews.length > 0
      ? fetchedReviews.reduce((sum, review) => sum + review.score, 0) /
        fetchedReviews.length
      : averageRating;

  if (loading) {
    return (
      <div className="px-4 py-10">
        <div className="text-center">
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 md:px-10 md:pt-20 md:pb-16">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col gap-6 mb-10 md:items-start">
          <h3 className="text-2xl font-normal mb-4 md:w-[225px] md:text-[42px] md:tracking-[-0.84px]">
            What do parents think?
          </h3>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex justify-center">
              <StarRating rating={Math.floor(displayAverageRating)} />
            </div>
            <p className="text-sm text-[#272727B2] md:text-[10px]">
              {displayAverageRating.toFixed(1)}/5 based on{' '}
              {displayTotalReviews.toLocaleString()} reviews
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex gap-4 mb-6">
            <FilterDropdown
              label="Rating"
              options={['5 stars', '4 stars', '3 stars', '2 stars', '1 star']}
              value={ratingFilter}
              onChange={setRatingFilter}
            />
            <FilterDropdown
              label="Size"
              options={['Small', 'Medium', 'Large', 'X-Large']}
              value={sizeFilter}
              onChange={setSizeFilter}
            />
          </div>
          <div className="">
            {fetchedReviews.length > 0 &&
              fetchedReviews.map((review) => (
                <div key={review.id}>
                  <ReviewCard
                    review={review}
                    productName={productName}
                    onVote={handleVote}
                  />
                </div>
              ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={
              pagination ? Math.ceil(pagination.total / pagination.per_page) : 1
            }
            onPageChange={fetchReviews}
          />
        </div>
      </div>
    </div>
  );
}
