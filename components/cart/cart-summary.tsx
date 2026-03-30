'use client';

import CartShippingBar from './cart-shipping-bar';
import { trackSelectPurchaseType } from '@/lib/gtm/ecommerce';

interface CartSummaryProps {
  isAR: boolean;
  onToggleAR: (value: boolean) => void;
  arSubtotal: number;
  otpSubtotal: number;
  totalSavings: number;
  yearlySavingsProjection: number;
  hasFreeShipping: boolean;
  subtotalForShipping: number;
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none" className="flex-shrink-0">
      <path d="M14.4995 4.17042C14.6155 4.17042 14.7225 4.21041 14.8075 4.2774L14.8745 4.34039L14.8915 4.36039C15.4724 5.08034 15.8421 5.94735 15.9595 6.86493C16.077 7.78252 15.9375 8.71469 15.5567 9.55773C15.1758 10.4008 14.5685 11.1216 13.8024 11.64C13.0362 12.1584 12.1413 12.4541 11.2171 12.4941L11.0001 12.4981H5.00101C4.89996 12.4982 4.79893 12.4952 4.69806 12.4891L6.35481 14.1439C6.43747 14.2267 6.48845 14.3359 6.49886 14.4525C6.50927 14.5691 6.47847 14.6856 6.4118 14.7818L6.35481 14.8518C6.27196 14.9344 6.16274 14.9854 6.04618 14.9958C5.92961 15.0062 5.81309 14.9754 5.7169 14.9088L5.64691 14.8518L3.1473 12.3522C3.06464 12.2693 3.01366 12.1601 3.00324 12.0435C2.99283 11.927 3.02364 11.8104 3.09031 11.7143L3.1473 11.6443L5.64691 9.14465C5.73509 9.05608 5.85324 9.00375 5.97809 8.99797C6.10293 8.99219 6.22541 9.03339 6.32139 9.11343C6.41737 9.19348 6.47989 9.30657 6.49662 9.43043C6.51336 9.55428 6.48309 9.67991 6.4118 9.78255L6.35481 9.85254L4.71806 11.4883L4.85804 11.4963L5.00101 11.4983H11.0001C11.7554 11.4984 12.4952 11.2846 13.134 10.8817C13.7728 10.4788 14.2845 9.9032 14.6098 9.2216C14.9351 8.54 15.0608 7.78021 14.9723 7.03015C14.8838 6.2801 14.5847 5.57044 14.1096 4.98329C14.0509 4.90979 14.0141 4.82121 14.0035 4.72774C13.9929 4.63427 14.0089 4.5397 14.0496 4.4549C14.0904 4.3701 14.1542 4.29852 14.2338 4.24837C14.3134 4.19823 14.4055 4.17055 14.4995 4.17042ZM9.6463 0.146039C9.72914 0.063377 9.83836 0.0123983 9.95492 0.00198407C10.0715 -0.00843011 10.188 0.0223804 10.2842 0.0890483L10.3542 0.146039L12.8538 2.64565L12.9108 2.71564C12.9684 2.79913 12.9993 2.89816 12.9993 2.9996C12.9993 3.10104 12.9684 3.20007 12.9108 3.28356L12.8538 3.35355L10.3542 5.85316L10.2842 5.91015C10.2007 5.96777 10.1017 5.99862 10.0002 5.99862C9.89881 5.99862 9.79977 5.96777 9.71629 5.91015L9.6463 5.85316L9.58931 5.78317C9.53169 5.69969 9.50083 5.60065 9.50083 5.49921C9.50083 5.39778 9.53169 5.29874 9.58931 5.21526L9.6463 5.14527L11.283 3.50952L11.1431 3.50152L11.0001 3.49952H5.00101C4.24511 3.49948 3.50467 3.71365 2.86551 4.11723C2.22636 4.5208 1.71466 5.09725 1.38973 5.77976C1.0648 6.46227 0.93995 7.22288 1.02964 7.97345C1.11933 8.72401 1.41989 9.43379 1.89649 10.0205C1.97618 10.1267 2.01041 10.2602 1.99166 10.3917C1.97291 10.5231 1.90271 10.6417 1.79651 10.7214C1.74392 10.7609 1.68408 10.7896 1.6204 10.8059C1.55671 10.8222 1.49044 10.8259 1.42535 10.8166C1.29391 10.7978 1.1753 10.7276 1.09562 10.6214C0.518734 9.90038 0.15283 9.03365 0.038481 8.11734C-0.075868 7.20103 0.0658066 6.27096 0.447794 5.43025C0.829781 4.58955 1.43715 3.87107 2.20256 3.35449C2.96796 2.83791 3.86149 2.54342 4.78405 2.50368L5.00101 2.49968H11.0001C11.1021 2.49968 11.2031 2.50268 11.303 2.50868L9.6463 0.85393L9.58931 0.783941C9.52264 0.687757 9.49183 0.571232 9.50224 0.454666C9.51266 0.3381 9.56364 0.228882 9.6463 0.146039Z" fill="#0000C9"/>
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
      <path d="M16.875 9.75375C16.1325 8.85375 14.6925 7.11 14.58 6.96375C14.2763 6.57 13.9275 6.40125 13.4213 6.40125H12.24V4.96125C12.24 4.39875 11.7788 3.9375 11.2163 3.9375H2.09251C1.53001 3.9375 1.06876 4.39875 1.06876 4.96125V11.0025C1.06876 11.565 1.53001 12.0262 2.09251 12.0262H2.27251C2.27251 13.14 3.17251 14.04 4.28626 14.04C5.40001 14.04 6.30001 13.14 6.30001 12.0262H11.6438C11.6438 13.14 12.5438 14.04 13.6575 14.04C14.7713 14.04 15.6713 13.14 15.6713 12.0262H16.515C16.74 12.0262 16.9313 11.835 16.9313 11.61V9.9225C16.9313 9.855 16.9088 9.79875 16.8638 9.7425L16.875 9.75375ZM4.28626 13.5C3.48751 13.5 2.83501 12.8475 2.83501 12.0487C2.83501 11.25 3.48751 10.5975 4.28626 10.5975C5.08501 10.5975 5.73751 11.25 5.73751 12.0487C5.73751 12.8475 5.08501 13.5 4.28626 13.5ZM4.28626 10.0237C3.37501 10.0237 2.61001 10.6425 2.36251 11.475H2.09251C1.83376 11.475 1.63126 11.2725 1.63126 11.0138V4.9725C1.63126 4.71375 1.83376 4.51125 2.09251 4.51125H11.2163C11.475 4.51125 11.6775 4.71375 11.6775 4.9725V11.475H6.22126C5.97376 10.6425 5.20876 10.0237 4.29751 10.0237H4.28626ZM13.6688 13.5C12.87 13.5 12.2175 12.8475 12.2175 12.0487C12.2175 11.25 12.87 10.5975 13.6688 10.5975C14.4675 10.5975 15.12 11.25 15.12 12.0487C15.12 12.8475 14.4675 13.5 13.6688 13.5ZM16.3688 11.475H15.5813C15.3338 10.6425 14.5688 10.0237 13.6575 10.0237C13.095 10.0237 12.5888 10.2487 12.2288 10.62V6.96375H13.41C13.7475 6.96375 13.9275 7.05375 14.1188 7.30125C14.2538 7.48125 15.9975 9.585 16.3575 10.0237V11.4637L16.3688 11.475Z" fill="#141414"/>
    </svg>
  );
}


export default function CartSummary({
  isAR,
  onToggleAR,
  arSubtotal,
  otpSubtotal,
  totalSavings,
  yearlySavingsProjection,
  hasFreeShipping,
  subtotalForShipping,
}: CartSummaryProps) {
  const displaySubtotal = isAR ? arSubtotal : otpSubtotal;

  return (
    <div className="rounded-tl-2xl rounded-tr-2xl border border-[#E7E7E7] overflow-hidden">
      {/* AR toggle row */}
      <button
        onClick={() => {
          const next = !isAR;
          onToggleAR(next);
          trackSelectPurchaseType({ location: 'Cart', isSubscription: next });
        }}
        className="w-full flex flex-col px-4 py-4 text-left gap-3"
      >
        {/* Row 1: checkbox + title */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
            {isAR ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3" stroke="#0000C9"/>
                <mask id="mask0_496_33" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
                  <rect width="16" height="16" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_496_33)">
                  <path d="M6.4832 10.3377L11.6845 5.1364C11.7373 5.08262 11.7996 5.05356 11.8715 5.04923C11.9434 5.04501 12.0105 5.07406 12.0729 5.1364C12.1353 5.19884 12.1665 5.26195 12.1665 5.32573C12.1665 5.3894 12.1375 5.45023 12.0795 5.50823L6.82686 10.7621C6.7312 10.8586 6.6197 10.9069 6.49236 10.9069C6.36492 10.9069 6.25286 10.8586 6.1562 10.7621L3.93953 8.5454C3.88575 8.49162 3.85458 8.43117 3.84603 8.36406C3.83747 8.29695 3.86442 8.23217 3.92686 8.16973C3.9892 8.1074 4.0527 8.07623 4.11736 8.07623C4.18203 8.07623 4.2437 8.1074 4.30236 8.16973L6.4832 10.3377Z" fill="#0000C9"/>
                </g>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3" stroke="#141414"/>
              </svg>
            )}
          </div>
          <p className="text-sm font-normal leading-[140%] tracking-[-0.14px] text-[#141414]">
            Subscribe and save 10% with Auto&#8209;Renew
          </p>
        </div>

        {/* Row 2: ships icon + text + savings */}
        <div className="flex items-center justify-between w-full">
          {isAR ? (
            <>
              <span className="flex items-center gap-2 text-sm font-normal leading-[140%] text-[#141414]">
                <RefreshIcon />
                Ships every 4 weeks
              </span>
              <span className="text-sm text-[#0000C9] font-normal">10% savings</span>
            </>
          ) : (
            <span className="flex items-center gap-2 text-sm font-normal leading-[140%] text-[#141414]">
              <TruckIcon />
              Ships once
            </span>
          )}
        </div>
      </button>

      {/* Free shipping + subtotals wrapper */}
      <div className="border-t border-[#E7E7E7] pt-1 pb-4 flex flex-col gap-2 w-full">
        {/* Free shipping bar */}
        <div className="px-4">
          <CartShippingBar subtotal={subtotalForShipping} hasFreeShipping={hasFreeShipping} />
        </div>

        {/* Outer container: subtotals + shipping note */}
        <div className="flex flex-col items-start gap-2 w-full px-4">
          {/* Saved + Subtotal container */}
          <div className="flex flex-col items-start gap-1 w-full">
            {/* Savings (AR only) */}
            {isAR && totalSavings > 0 && (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-normal leading-[140%] text-[#0000C9]">Saved</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-normal leading-[140%] text-[#525252]">
                    That&apos;s ${yearlySavingsProjection.toFixed(0)}/yr
                  </span>
                  <span className="text-xs font-normal leading-[140%] text-[#0000C9]">
                    ${totalSavings.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold leading-[140%] text-[#141414]">Subtotal</span>
              <span className="text-sm font-semibold leading-[140%] text-[#141414]">
                ${displaySubtotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Shipping note */}
          <p className="text-xs font-normal leading-[140%] text-[#525252]">
            Shipping + taxes calculated at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
