'use client';

import { track } from '@vercel/analytics';

interface FirstVisitPopupProps {
  onClaim: () => void;
  onClose: () => void;
}

export default function FirstVisitPopup({ onClaim, onClose }: FirstVisitPopupProps) {
  const handleClaim = () => {
    track('discount_claimed', { discount_code: 'BETTERSLEEP15' });
    onClaim();
  };

  const handleClose = () => {
    track('discount_not_claimed');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-5 mt-2">
          {/* <div className="w-14 h-14 rounded-full bg-[#EEF0FF] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#0000C9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div> */}
          <p className="text-2xl text-black mb-2">You've got 10% off!</p>
          <p className="text-sm text-[#515151]">
            Save on your first <strong>Auto-Renew</strong> order.
            <br />
            Applied automatically at checkout.
          </p>
        </div>

        <button
          onClick={handleClaim}
          className="w-full bg-[#0000C9] text-white py-3.5 rounded-full font-medium text-sm hover:bg-[#0000AA] transition-colors"
        >
          Claim it
        </button>

        <button
          onClick={handleClose}
          className="mt-3 text-xs text-[#515151] hover:text-gray-600 underline"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
