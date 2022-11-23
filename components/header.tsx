import { ethos } from 'ethos-connect'
import Link from 'next/link'

function Header() {
  const { wallet } = ethos.useWallet();
  
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
    <div className="container">
      <div className="navbar-brand">
        <Link className="navbar-brand" href="/" title="battlemon">Battlemon</Link>
      </div>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button> 
      <div className="collapse navbar-collapse" id="navbarMain">
        <ul className="navbar-nav ms-auto pe-4">
          <li className="nav-item dropdown text-white">
            {wallet?.address}
          </li>
        </ul>
        <ul className="navbar-nav mb-2 mb-lg-0 fs-5">
          <li className="nav-item dropdown">
            {wallet?.address ?
              <button onClick={wallet.disconnect} className="btn btn-outline-light px-5">Sign Out</button>
              :
              <button onClick={ethos.showSignInModal} className="btn btn-outline-light px-5">Sign In</button>
            }
          </li>
        </ul>
      </div>
    </div>
  </nav>
  );
}

export default Header;