import Link from 'next/link';

const legal = [
  {
    label: 'Privacy Policy',
    href: 'https://www.coterie.com/legal/privacy-policy',
  },
  {
    label: 'Terms of Service',
    href: 'https://www.coterie.com/legal/terms-of-service',
  },
  {
    label: 'Consumer Health Policy',
    href: 'https://www.coterie.com/legal/consumer-health-policy',
  },
];

export default function Footer() {
  return (
    <footer className="py-8 px-4 md:px-10">
      <div className="flex flex-col gap-10">
        <div className="text-[#0000c9] flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 88.5 18.5"
            role="presentation"
            className="w-[200px]"
          >
            <path
              fill="currentColor"
              d="M0 9.016C0 3.79 4.03 0 9.482 0c4.686 0 7.576 2.178 9.065 4.944L15.919 6.26c-1.204-2.374-3.503-3.767-6.295-3.767-4.423.01-6.755 3.32-6.755 6.522 0 3.779 2.912 6.469 6.711 6.469 2.781 0 5.08-1.177 6.263-3.42l2.496 1.274c-.985 1.786-3.328 4.628-8.562 4.628C4.14 17.99 0 14.374 0 9.017ZM26.605 5.14c4.106 0 6.942 2.7 6.942 6.446 0 3.746-2.803 6.403-6.92 6.403s-6.92-2.635-6.92-6.446c0-3.616 2.913-6.403 6.898-6.403Zm.022 10.562c2.43 0 4.292-1.764 4.292-4.05 0-2.45-1.861-4.204-4.292-4.204-2.43 0-4.292 1.764-4.292 4.051 0 2.44 1.861 4.203 4.292 4.203ZM36.59 5.466V1.361h2.781v4.084h4.883V7.73h-4.948v5.293c0 1.807.941 2.45 2.496 2.45.694 0 1.372-.205 1.949-.588l1.412 2.145c-.591.435-1.883.958-3.591.958-2.606 0-4.993-1.503-4.993-4.791V7.797h-2.584l-.054-2.33h2.65Zm15.635-.326c3.966 0 6.55 2.918 6.55 6.773v.174l-10.557.044c.273 2.156 1.752 3.571 4.335 3.571a4.238 4.238 0 0 0 1.997-.485 4.213 4.213 0 0 0 1.529-1.366l2.411 1.154c-.528.893-2.32 2.962-5.915 2.995-4.105.022-6.963-2.614-6.963-6.49 0-3.931 2.868-6.37 6.613-6.37Zm3.66 5.03c-.32-1.807-1.905-2.82-3.66-2.82-1.818 0-3.416.958-3.876 2.831l7.536-.01Zm4.902-4.704h2.63v1.906c1.117-1.503 3.011-1.906 4.533-1.906h.328V8.21h-.306c-2.934 0-4.555 1.481-4.555 3.681v5.771h-2.63V5.466ZM71.782.218a1.618 1.618 0 0 1 1.223.451 1.6 1.6 0 0 1 .485 1.204 1.593 1.593 0 0 1-.481 1.211 1.61 1.61 0 0 1-1.227.455c-1.03 0-1.73-.675-1.73-1.655a1.625 1.625 0 0 1 .5-1.209 1.642 1.642 0 0 1 1.23-.457Zm-1.336 5.248h2.636v12.196h-2.627l-.009-12.196ZM81.9 5.14c3.963 0 6.547 2.918 6.547 6.773v.174l-10.555.044c.274 2.156 1.752 3.571 4.336 3.571a4.238 4.238 0 0 0 1.996-.485 4.213 4.213 0 0 0 1.53-1.366l2.408 1.154c-.525.893-2.321 2.962-5.912 2.995-4.106.022-6.963-2.614-6.963-6.49 0-3.931 2.868-6.37 6.612-6.37Zm3.656 5.03c-.306-1.807-1.916-2.83-3.657-2.83-1.817 0-3.415.958-3.875 2.83h7.532Z"
            ></path>
          </svg>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-20 text-[11px] text-gray-600">
          <div className="flex-1">
            <p>
              © 2025 Coterie Baby, Inc. Coterie is a United States registered
              trademark of Coterie Baby, Inc.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-8">
            {legal.map((link) => (
              <Link key={link.href} href={link.href} target="_blank">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
