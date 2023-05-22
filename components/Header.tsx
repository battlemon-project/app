import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConnectSui } from './ConnectSui';
import { ConnectEth } from './ConnectEth';

interface HeaderProps {
  network: 'sui' | 'eth';
}

export const Header: React.FC<HeaderProps> = ({ network }) => {
  const router = useRouter();

  return (
    <header className="navbar navbar-expand-lg sticky-top navbar-dark">
      <div className="container">
        <Logo />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul
            className="navbar-nav mx-auto mb-2 mb-lg-0 fs-5 nav-main"
            style={{ position: 'relative', top: '-12px' }}
          >
            {router.pathname !== '/' && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      router.pathname == '/hub' ? 'active' : ''
                    }`}
                    href="/hub"
                  >
                    NFT Hub
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      router.pathname == '/city/defi' ? 'active' : ''
                    }`}
                    href="/city/defi"
                  >
                    DeFi
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className={`dropdown-item ${
                          router.pathname == '/city/defi' ? 'active' : ''
                        }`}
                        href="/city/defi"
                      >
                        Farming
                      </Link>
                    </li>
                    <li style={{ pointerEvents: 'none' }}>
                      <Link className="dropdown-item" href="/">
                        Bridge
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      router.pathname == '/city/labs' ? 'active' : ''
                    }`}
                    href="/city/labs"
                  >
                    Labs
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className={`dropdown-item ${
                          router.pathname == '/city/labs' ? 'active' : ''
                        }`}
                        href="/city/labs"
                      >
                        Crafting
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item ${
                          router.pathname == '/city/mixing' ? 'active' : ''
                        }`}
                        href="/city/mixing"
                      >
                        Mixing
                      </Link>
                    </li>
                    <li style={{ pointerEvents: 'none' }}>
                      <Link className="dropdown-item" href="/">
                        Grading
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      router.pathname == '/city/vault' ? 'active' : ''
                    }`}
                    href="/city/vault"
                  >
                    Vault
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className={`dropdown-item ${
                          router.pathname == '/city/vault' ? 'active' : ''
                        }`}
                        href="/city/vault"
                      >
                        NFT Pool
                      </Link>
                    </li>
                    <li style={{ pointerEvents: 'none' }}>
                      <Link className="dropdown-item" href="/">
                        LJC Pool
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className={`nav-link ${
                      router.pathname == '/city/marketplace' ? 'active' : ''
                    }`}
                    href="/city/marketplace"
                  >
                    Shop
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className={`dropdown-item ${
                          router.pathname == '/city/launchpad' ? 'active' : ''
                        }`}
                        href="/city/launchpad"
                      >
                        Launchpad
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item ${
                          router.pathname == '/city/marketplace' ? 'active' : ''
                        }`}
                        href="/city/marketplace"
                      >
                        Marketplace
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
          {network == 'sui' ? <ConnectSui /> : <ConnectEth />}
        </div>
      </div>
    </header>
  );
};
