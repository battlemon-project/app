import React, { useRef } from 'react';
import Link from 'next/link';
import { type LinkType } from '../Header';
import classNames from 'classnames';
import { useRouter } from 'next/router';

interface NavLinkProps {
  name: string;
  href: string;
  subLinks: LinkType[];
}

export const NavLink: React.FC<NavLinkProps> = ({ name, href, subLinks }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const outerRef = useRef<HTMLButtonElement | null>(null);

  const onMouseEnter = () => {
    setIsOpen(true);
  };
  const onMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <Link href={href}>
        <button
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={outerRef}
          className={classNames(
            {
              '!text-opacity-100': href === router.pathname,
            },
            'w-full text-white text-opacity-50 text-xl font-normal hover:text-opacity-100'
          )}
        >
          {isOpen || href === router.pathname ? (
            <svg
              className="absolute left-0 bottom-0"
              width={127}
              height={36}
              viewBox={`0 0 127 36`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.22871 19.6363C11.8194 9.7821 19.6111 0 29.8002 0H97.1998C107.389 0 115.181 9.7821 117.771 19.6363C119.216 25.1309 121.967 30.9713 127 36H0C5.03296 30.9713 7.78416 25.1309 9.22871 19.6363Z"
                fill="white"
                fillOpacity="0.3"
              />
            </svg>
          ) : null}
          {name}
        </button>
      </Link>
      {subLinks.length && isOpen ? (
        <div
          className="absolute left-0 top-full p-1 w-full text-center"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div
            className="border-2 border-white border-opacity-50 flex flex-col rounded-xl overflow-hidden min-w-full w-fit backdrop-blur-lg px-3"
            style={{
              background:
                'linear-gradient(105.54deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 100%)',
            }}
          >
            {subLinks.map((link, i) => {
              return (
                <Link
                  className={classNames(
                    {
                      'pointer-events-none': link.isDisabled,
                      '': link.href === router.pathname,
                      'border-b border-b-white': i + 1 < subLinks.length,
                    },
                    'relative py-2 text-white whitespace-nowrap  border-opacity-50'
                  )}
                  key={link.href + link.name}
                  href={link.href}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
