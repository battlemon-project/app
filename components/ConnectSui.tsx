import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";

function ConnectSui() {
  const [hasMounted, setHasMounted] = useState(false);
  const wallet = useWallet();

  const signOut = () => {
    localStorage.removeItem('WK__LAST_CONNECT_WALLET_NAME')
    wallet?.disconnect()
  }

  useEffect(() => {
    setHasMounted(true);
  }, [])

  // Render
  if (!hasMounted) return null;

  return (
    <ul className="navbar-nav mb-2 mb-lg-0 fs-5">
    <li className="nav-item dropdown" style={{position: 'relative', top: '-9px'}}>
        {wallet?.account?.address ?
          <>
            <button className="btn btn-lg btn-outline-light dropdown-toggle text-start" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="short_address">
                <span className="ellipsis">{wallet?.account?.address}</span>
                <span className="indent">{wallet?.account?.address}</span>
              </span>
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href={"#"} onClick={signOut}>Sign Out</a></li>
            </ul>
          </>
          :
          <ConnectButton label="Connect" />
        }
      </li>
    </ul>
  );
}

export default ConnectSui;