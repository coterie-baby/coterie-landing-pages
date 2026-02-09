'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePurchaseFlow } from '../context';

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '12-hour leak protection',
    description: 'Ultra-absorbent core keeps baby dry',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Clean ingredients',
    description: 'No chlorine, fragrance, or lotions',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Save 10% with Auto-Renew',
    description: 'Plus free shipping on every order',
  },
];

export default function WelcomeStep() {
  const { nextStep } = usePurchaseFlow();

  return (
    <div className="flex flex-col items-center animate-fade-up">
      {/* Hero Image */}
      <div className="relative w-full max-w-sm aspect-square mb-6">
        <Image
          src="https://cdn.sanity.io/images/e4q6bkl9/production/328d487a67fbe313e45cb6a0cbbc54c162aadfdb-6720x4480.png?rect=1120,0,4480,4480&w=800&h=800&q=90&fit=crop&auto=format"
          alt="Coterie Diapers and Wipes"
          fill
          className="object-cover rounded-2xl"
          priority
        />

        {/* Floating badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-xs font-semibold text-[#0000C9]">Save 10%</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-2xl font-semibold mb-2">Build Your Bundle</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Premium diapers and wipes, delivered monthly. Customize your order in just a few steps.
        </p>
      </div>

      {/* Features */}
      <div className="w-full space-y-3 mb-8 px-4">
        {FEATURES.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <div className="text-[#0000C9] mt-0.5">{feature.icon}</div>
            <div>
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="w-full px-4">
        <Button
          onClick={nextStep}
          className="w-full bg-[#0000C9] hover:bg-[#0000A0] text-white py-4 text-base"
        >
          Get Started
        </Button>
        <p className="text-center text-xs text-gray-500 mt-3">
          Free shipping on all orders
        </p>
      </div>
    </div>
  );
}
