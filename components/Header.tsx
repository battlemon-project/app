import { ethos } from 'ethos-connect'
import Logo from './Logo'

function Header() {
  const { wallet } = ethos.useWallet();
  
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark">
      <div className="container">
        <Logo />
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> 
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-5">
            {/* <li className="nav-item">
              <a className="nav-link" href="/hub">NFT Hub</a>
            </li> */}
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0 fs-5">
            <li className="nav-item dropdown">
              {wallet?.address ?
                <>
                  <button className="btn btn-lg btn-outline-light dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">{wallet?.address}</button>
                  <ul className="dropdown-menu w-100" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href={"#"} onClick={wallet.disconnect}>Sign Out</a></li>
                  </ul>
                </>
                :
                <button onClick={ethos.showSignInModal} className="btn btn-lg btn-outline-light">Sign In</button>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;