import Image from 'next/image';

interface PressStatement {
  id: string;
  outlet: string;
  logo?: string;
  quote?: string;
  showStars?: boolean;
  starText?: string;
}

interface PressStatementsProps {
  statements?: PressStatement[];
}

const defaultStatements: PressStatement[] = [
  {
    id: 'today',
    outlet: 'TODAY',
    quote:
      'An online pet food company that makes feeding real food to dogs really easy.',
  },
  {
    id: 'fast-company',
    outlet: 'FAST COMPANY',
    quote:
      'Researchers concluded that fresh diets do demonstrate a number of pet health benefits.',
  },
  {
    id: 'google',
    outlet: 'Google',
    showStars: true,
    starText: 'Customer reviews',
  },
  {
    id: 'vogue',
    outlet: 'VOGUE',
    quote: 'It never sits on a shelf. All you do is open the pack and pour.',
  },
  {
    id: 'cbs-news',
    outlet: 'CBS NEWS',
    quote: 'Owners can get healthy dog food shipped right to their door.',
  },
];

function StarIcon() {
  return (
    <Image
      src="/star.svg"
      alt="Star rating"
      width={16}
      height={16}
      className="w-4 h-4"
    />
  );
}

export default function PressStatements({
  statements = defaultStatements,
}: PressStatementsProps) {
  return (
    <div className="bg-[#FAFAFA] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {statements.map((statement) => (
            <div
              key={statement.id}
              className="flex flex-col items-center text-center"
            >
              {/* Logo/Outlet Name */}
              <div className="mb-4">
                {statement.logo ? (
                  <div className="h-8 flex items-center justify-center">
                    <Image src={statement.logo} alt={statement.outlet} width={120} height={32} className="h-8 w-auto object-contain" />
                  </div>
                ) : (
                <h3 className="text-xl font-semibold text-gray-800 tracking-tight">
                  {statement.outlet === 'TODAY' && (
                    <span className="relative inline-block">
                      T
                      <span className="relative inline-block mx-0.5">
                        O
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <span className="block w-3 h-3 border-2 border-gray-800 rounded-full">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gray-800 rounded-full"></span>
                          </span>
                        </span>
                      </span>
                      DAY
                    </span>
                  )}
                  {statement.outlet === 'FAST COMPANY' && (
                    <span className="relative inline-block">
                      FAST C
                      <span className="relative inline-block mx-0.5">
                        O
                        <svg
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-800"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="7"
                            cy="7"
                            r="5.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            fill="none"
                          />
                          <path
                            d="M7 2.5 L9.5 5 L7 7.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                          <path
                            d="M4.5 5 L7 2.5"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </span>
                      MPANY
                    </span>
                  )}
                  {statement.outlet === 'Google' && (
                    <span className="font-serif">Google</span>
                  )}
                  {statement.outlet === 'VOGUE' && (
                    <span className="font-serif">VOGUE</span>
                  )}
                  {statement.outlet === 'CBS NEWS' && (
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 border-2 border-gray-800 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-gray-800 rounded-full"></span>
                      </span>
                      <span>CBS NEWS</span>
                    </span>
                  )}
                  {![
                    'TODAY',
                    'FAST COMPANY',
                    'Google',
                    'VOGUE',
                    'CBS NEWS',
                  ].includes(statement.outlet) && statement.outlet}
                </h3>
                )}
              </div>

              {/* Stars for Google */}
              {statement.showStars && (
                <div className="mb-3 flex justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      <StarIcon />
                    </span>
                  ))}
                </div>
              )}

              {/* Quote or Star Text */}
              <p className="text-sm text-gray-500 font-serif leading-relaxed">
                {statement.showStars ? statement.starText : statement.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
