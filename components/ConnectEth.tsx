import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'


function ConnectEth() {
  const [hasMounted, setHasMounted] = useState(false);
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const signOut = () => {
    disconnect()
  }

  useEffect(() => {
    setHasMounted(true);
  }, [])

  // Render
  if (!hasMounted) return null;

  return (
    <ul className="navbar-nav mb-2 mb-lg-0 fs-5">
      <li className="nav-item dropdown" style={{position: 'relative', top: '-9px'}}>
        {isConnected && address ?
          <>
            <button className="btn btn-lg btn-outline-light dropdown-toggle text-start" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <span className="short_address">
                <span className="ellipsis">{address}</span>
                <span className="indent">{address}</span>
              </span>
            </button>
            <ul className="dropdown-menu w-100" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href={"#"} onClick={signOut}>Sign Out</a></li>
            </ul>
          </>
          :
          <button className="btn btn-lg btn-outline-light" onClick={() => connect()}>
            Connect
          </button>
        }
      </li>
    </ul>
  );
}

export default ConnectEth;