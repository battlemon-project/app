import React from 'react';
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

  const onMouseEnter = () => {
    setIsOpen(true);
  };
  const onMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Link href={href}>
        <button
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={classNames(
            {
              '!bg-white !text-black': href === router.pathname,
            },
            'border border-white rounded-xl py-2 px-5 text-white text-xl font-normal hover:bg-white hover:text-black transition-all'
          )}
        >
          {name}
        </button>
      </Link>
      {subLinks.length && isOpen ? (
        <div
          className="absolute left-0 top-11 border border-white flex flex-col rounded-xl overflow-hidden min-w-full w-fit bg-midnight"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {subLinks.map((link) => (
            <Link
              className={classNames(
                {
                  'pointer-events-none': link.isDisables,
                  '!bg-white !text-black': link.href === router.pathname,
                },
                'py-1.5 px-5 text-white hover:bg-white hover:text-black whitespace-nowrap'
              )}
              key={link.href + link.name}
              href={link.href}
            >
              {link.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};
