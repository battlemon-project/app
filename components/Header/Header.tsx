import React from 'react';
import Logo from '../Logo';
import { useWindowResize } from '../../hooks/useWindowResize';
import { NavLink } from './components/NavLink';
import { ConnectSui } from '../ConnectSui';
import { ConnectEth } from '../ConnectEth';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';

interface HeaderProps {
  network: 'sui' | 'eth';
}

export interface LinkType {
  name: string;
  href: string;
  isDisables?: boolean;
}

const navLinks = [
  {
    name: 'NFT Hub',
    href: '/hub',
    subLinks: [] as LinkType[],
  },
  {
    name: 'Defi',
    href: '/city/defi',
    subLinks: [
      {
        name: 'Farming',
        href: '/city/defi',
      },
      {
        name: 'Bridge',
        href: '',
        isDisables: true,
      },
    ] as LinkType[],
  },
  {
    name: 'Labs',
    href: '/city/labs',
    subLinks: [
      {
        name: 'Crafting',
        href: '/city/labs',
      },
      {
        name: 'Mixing',
        href: '/city/mixing',
      },
      {
        name: 'Grading',
        href: '',
        isDisables: true,
      },
    ] as LinkType[],
  },
  {
    name: 'Vault',
    href: '/city/vault',
    subLinks: [
      {
        name: 'NFT Pool',
        href: '/city/vault',
      },
      {
        name: 'LJC Pool',
        href: '',
        isDisables: true,
      },
    ] as LinkType[],
  },
  {
    name: 'Shop',
    href: '/city/marketplace',
    subLinks: [
      {
        name: 'Launchpad',
        href: '/city/launchpad',
      },
      {
        name: 'Marketplace',
        href: '/city/marketplace',
      },
    ] as LinkType[],
  },
];

export const Header: React.FC<HeaderProps> = ({ network }) => {
  const { size } = useWindowResize();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const onBurgerToggle = () => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.width = '100vw';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.width = '';
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <header
      className={classNames(
        { 'bg-midnight': size < 1200 && isOpen },
        'py-4 relative'
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Logo />
        {size > 1200 ? (
          <>
            {router.asPath !== '/' ? (
              <div className="flex gap-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name + link.href}
                    name={link.name}
                    href={link.href}
                    subLinks={link.subLinks}
                  />
                ))}
              </div>
            ) : null}

            {network == 'sui' ? <ConnectSui /> : <ConnectEth />}
          </>
        ) : (
          <>
            <button
              className="flex flex-col w-12 h-10 border border-white border-opacity-40 justify-between p-2.5 rounded-md"
              onClick={onBurgerToggle}
            >
              <span className="w-full h-0.5 bg-white bg-opacity-40"></span>
              <span className="w-full h-0.5 bg-white bg-opacity-40"></span>
              <span className="w-full h-0.5 bg-white bg-opacity-40"></span>
            </button>
            {isOpen ? (
              <div className="px-4 w-screen h-screen left-0 absolute top-24 bg-midnight flex flex-col items-center">
                <div className="flex flex-col gap-8 mb-8 items-center">
                  {navLinks.map((link) => (
                    <Link
                      className="block w-full text-center text-white text-2xl"
                      key={link.href + link.name}
                      href={link.href}
                      onClick={onBurgerToggle}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                {network == 'sui' ? <ConnectSui /> : <ConnectEth />}
              </div>
            ) : null}
          </>
        )}
      </div>
    </header>
  );
};
