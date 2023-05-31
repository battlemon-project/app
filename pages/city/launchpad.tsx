import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useAccount } from 'wagmi';
import { useCookies } from 'react-cookie';
import styles from '../../styles/Shop.module.css';
import useSWR from 'swr';

const Vault = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const [checkFollow, setCheckFollow] = useState(false);
  const [checkRetwit, setCheckRetwit] = useState(false);
  const [checkDiscord, setCheckDiscord] = useState(false);
  const [cookies, setCookie] = useCookies([
    'check_follow',
    'check_retwit',
    'check_discord',
    'discord_code',
    'auth_token',
  ]);

  const checkTwitterFollow = () => {
    setTimeout(() => {
      setCookie('check_follow', 'true');
    }, 3000);
  };

  const checkTwitterRetwit = () => {
    setTimeout(() => {
      setCookie('check_retwit', 'true');
    }, 3000);
  };

  const checkDiscordJoin = () => {
    setTimeout(() => {
      setCookie('check_discord', 'true');
    }, 3000);
  };

  const getDiscordCode = async (token: string) => {
    const data = await fetch('/api/activation-codes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const { code }: { code: string } = await data.json();
    if (!code) return;
    setCookie('discord_code', code, {
      expires: new Date(((d) => d.setDate(d.getDate() + 365))(new Date())),
    });
  };

  const getVouchers = async (url: string) => {
    const data = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cookies.auth_token}`,
        'Content-Type': 'application/json',
      },
    });
    const { voucher }: { voucher: string } = await data.json();
    console.log(voucher);
  };

  const { data } = useSWR('/api/vouchers/access-keys', getVouchers);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (cookies.check_follow && cookies.auth_token && isConnected) {
      setCheckFollow(true);
      if (cookies.check_retwit) {
        setCheckRetwit(true);
        if (cookies.discord_code) {
          setCheckDiscord(true);
        } else {
          getDiscordCode(cookies.auth_token);
        }
      }
    } else {
      setCheckFollow(false);
      setCheckRetwit(false);
      setCheckDiscord(false);
    }
  }, [cookies, address]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return <></>;
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-5">
          <video
            loop
            autoPlay
            playsInline
            muted
            className="w-100"
            style={{ borderRadius: '15px', border: '1px solid #fff' }}
          >
            <source
              src={`${process.env.NEXT_PUBLIC_STATIC}/video/keycard.mp4`}
              type="video/mp4"
            />
          </video>

          <div className={`mt-3 ${styles.mint_container}`}>
            <button
              className={`btn btn-success btn-lg px-4 py-3 w-100 ${
                styles.mint_btn
              } ${!cookies.check_discord ? styles.bg_card_disabled : ''}`}
            >
              MINT
            </button>
          </div>
        </div>
        <div className="col-7">
          <div
            className={`shadow p-3 mb-3 rounded d-flex ${styles.bg_card} ${
              checkFollow ? styles.bg_card_done : ''
            }`}
          >
            <div className="col col-auto d-flex justify-content-center px-2">
              <svg
                fill="none"
                viewBox="0 0 26 22"
                width="40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M23.3382 5.66804C23.348 5.89575 23.3545 6.12347 23.3545 6.35441C23.3545 13.3587 17.9887 21.437 8.177 21.437C5.16425 21.437 2.36112 20.5601 0 19.0565C0.417625 19.1049 0.84175 19.1292 1.27238 19.1292C3.77163 19.1292 6.071 18.2829 7.8975 16.8601C5.56237 16.8181 3.59288 15.2854 2.91363 13.1795C3.24025 13.2408 3.57337 13.2731 3.91788 13.2731C4.40375 13.2731 4.875 13.2085 5.3235 13.0874C2.88275 12.6013 1.04487 10.4582 1.04487 7.89029V7.82246C1.76312 8.21976 2.587 8.45878 3.46125 8.48623C2.02963 7.53499 1.08712 5.9119 1.08712 4.07402C1.08712 3.10178 1.35037 2.19091 1.81025 1.40763C4.44112 4.61505 8.372 6.72587 12.805 6.94713C12.714 6.55952 12.6669 6.15415 12.6669 5.7391C12.6669 2.81108 15.0556 0.437012 18.0001 0.437012C19.5357 0.437012 20.9219 1.0814 21.8936 2.11178C23.1091 1.87437 24.2515 1.43347 25.2817 0.826229C24.8836 2.06333 24.037 3.10178 22.9369 3.75909C24.0159 3.62989 25.0429 3.34565 26 2.92413C25.285 3.98681 24.3799 4.92028 23.3382 5.66804Z"
                  fill="#fff"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="col px-2">
              <p className="m-0">
                <b>Follow us on Twitter</b>
              </p>
              <p className="m-0">
                {checkFollow ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <div className="col text-end">
              <a
                target="_blank"
                rel="noreferrer"
                className={`btn btn-lg ${styles.bg_card_btn}`}
                onClick={checkTwitterFollow}
                href="https://twitter.com/BATTLEM0N"
              >
                {checkFollow ? 'Done' : 'Follow'}
              </a>
            </div>
          </div>
          <div
            className={`shadow p-3 mb-3 rounded d-flex ${styles.bg_card} ${
              !checkFollow ? styles.bg_card_disabled : ''
            }  ${checkRetwit ? styles.bg_card_done : ''}`}
          >
            <div className="col col-auto d-flex justify-content-center px-2">
              <svg
                fill="none"
                viewBox="0 0 26 22"
                width="40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M23.3382 5.66804C23.348 5.89575 23.3545 6.12347 23.3545 6.35441C23.3545 13.3587 17.9887 21.437 8.177 21.437C5.16425 21.437 2.36112 20.5601 0 19.0565C0.417625 19.1049 0.84175 19.1292 1.27238 19.1292C3.77163 19.1292 6.071 18.2829 7.8975 16.8601C5.56237 16.8181 3.59288 15.2854 2.91363 13.1795C3.24025 13.2408 3.57337 13.2731 3.91788 13.2731C4.40375 13.2731 4.875 13.2085 5.3235 13.0874C2.88275 12.6013 1.04487 10.4582 1.04487 7.89029V7.82246C1.76312 8.21976 2.587 8.45878 3.46125 8.48623C2.02963 7.53499 1.08712 5.9119 1.08712 4.07402C1.08712 3.10178 1.35037 2.19091 1.81025 1.40763C4.44112 4.61505 8.372 6.72587 12.805 6.94713C12.714 6.55952 12.6669 6.15415 12.6669 5.7391C12.6669 2.81108 15.0556 0.437012 18.0001 0.437012C19.5357 0.437012 20.9219 1.0814 21.8936 2.11178C23.1091 1.87437 24.2515 1.43347 25.2817 0.826229C24.8836 2.06333 24.037 3.10178 22.9369 3.75909C24.0159 3.62989 25.0429 3.34565 26 2.92413C25.285 3.98681 24.3799 4.92028 23.3382 5.66804Z"
                  fill="#fff"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div className="col px-2">
              <p className="m-0">
                <b>Retwit something from us</b>
              </p>
              <p className="m-0">
                {checkRetwit ? 'Success' : 'Retwit not found'}
              </p>
            </div>
            <div className="col text-end">
              <a
                target="_blank"
                rel="noreferrer"
                className={`btn btn-lg ${styles.bg_card_btn}`}
                onClick={checkTwitterRetwit}
                href="https://twitter.com/BATTLEM0N"
              >
                {checkRetwit ? 'Done' : 'Retwit'}
              </a>
            </div>
          </div>
          <div
            className={`shadow p-3 mb-3 rounded ${styles.bg_card} ${
              !checkRetwit ? styles.bg_card_disabled : ''
            }`}
          >
            <div className="d-flex">
              <div className="col col-auto d-flex justify-content-center px-2">
                <svg
                  fill="none"
                  viewBox="0 0 24 26"
                  width="40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.6321 22.9682H18.5395L17.8263 20.5728L19.53 22.0887L21.0918 23.5362L23.9346 26V2.68302C23.8877 1.95554 23.5758 1.27373 23.0621 0.77562C22.5484 0.277514 21.8712 0.000341255 21.1677 0.00022733H3.6354C2.93568 -0.00906679 2.26045 0.266947 1.75524 0.76878C1.25003 1.27061 0.955298 1.95808 0.93457 2.68302V20.2854C0.937914 20.6463 1.01078 21.0029 1.14889 21.3342C1.28701 21.6655 1.48759 21.9649 1.73886 22.2148C1.99013 22.4647 2.28704 22.6601 2.61215 22.7895C2.93726 22.9188 3.28403 22.9796 3.6321 22.9682ZM14.66 6.15969H14.6236H14.66ZM6.67962 7.52846C7.74472 6.68674 9.03569 6.20847 10.3743 6.15969L10.5163 6.30683C8.17201 6.88514 7.10885 7.97331 7.10885 7.97331C7.10885 7.97331 7.3928 7.82959 7.88806 7.60716C9.45845 6.95553 11.1446 6.65729 12.8346 6.73222C14.5246 6.80714 16.18 7.25351 17.691 8.04175C17.691 8.04175 16.6245 7.01517 14.4255 6.37527L14.6203 6.1768C15.9377 6.2364 17.2056 6.71424 18.2523 7.54557C19.469 9.88643 20.13 12.4941 20.1805 15.1525C20.121 15.0567 18.9885 16.9559 16.0665 17.0209C16.0665 17.0209 15.5745 16.4391 15.2212 15.9361C16.9283 15.4297 17.5655 14.4134 17.5655 14.4134C17.0843 14.7074 16.5883 14.9747 16.0797 15.2141C15.4638 15.4726 14.8245 15.6663 14.1713 15.7924C11.1535 16.2988 9.46299 15.4502 7.86165 14.7658L7.31686 14.475C7.31686 14.475 7.95079 15.5015 9.58846 15.9977C9.16584 16.5213 8.73991 17.1098 8.73991 17.1098C5.82777 17.038 4.77781 15.1525 4.77781 15.1525C4.81879 12.4907 5.4707 9.87731 6.67962 7.52846Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M14.8478 13.8383C15.2069 13.8202 15.5455 13.6597 15.7935 13.3899C16.0415 13.1201 16.1798 12.7617 16.1798 12.3891C16.1798 12.0165 16.0415 11.6582 15.7935 11.3884C15.5455 11.1186 15.2069 10.958 14.8478 10.9399C14.4774 10.9399 14.1222 11.0924 13.8602 11.3639C13.5983 11.6354 13.4512 12.0035 13.4512 12.3874C13.4512 12.7713 13.5983 13.1395 13.8602 13.4109C14.1222 13.6824 14.4774 13.8349 14.8478 13.8349V13.8383Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M10.0216 13.8383C10.3807 13.8202 10.7194 13.6597 10.9673 13.3899C11.2153 13.1201 11.3536 12.7617 11.3536 12.3891C11.3536 12.0165 11.2153 11.6582 10.9673 11.3884C10.7194 11.1186 10.3807 10.958 10.0216 10.9399C9.65123 10.9399 9.29599 11.0924 9.03407 11.3639C8.77215 11.6354 8.625 12.0035 8.625 12.3874C8.625 12.7713 8.77215 13.1395 9.03407 13.4109C9.29599 13.6824 9.65123 13.8349 10.0216 13.8349V13.8383Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div className="col px-2 d-flex flex-row align-items-center">
                <p className="mb-1">
                  <b>Join Battlemon Discord Server</b>
                </p>
              </div>
              <div className="col-auto text-end">
                <a
                  href="https://discord.gg/battlemon"
                  target="_blank"
                  rel="noreferrer"
                  className={`btn btn-lg ${styles.bg_card_btn}`}
                  onClick={checkDiscordJoin}
                >
                  Join
                </a>
              </div>
            </div>
            {checkDiscord && (
              <div style={{ paddingLeft: '65px' }}>
                <p className="my-0">
                  Go to{' '}
                  <a
                    className="text-white"
                    href="https://discord.com/channels/893433519110488064/1087341135824965693"
                    target="_blank"
                    rel="noreferrer"
                  >
                    our special channel
                  </a>
                </p>
                <p className="my-0">
                  Enter command:
                  <br />
                  <span>
                    <kbd>/activate code: {cookies.discord_code}</kbd>
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className={styles.bg_card_description}>
            <p>
              Unique Key-card that gives access to the incredible game world of
              Lemoland, full of adventures and NFT treasures.{' '}
            </p>

            <p>
              Unique NFT key-pass will be available in Testnet and also
              transferred to Mainnet.
            </p>

            <div className="d-flex justify-content-between">
              <b>Contract Address</b>
              <div>0x60efdg33a...434iq357c6</div>
            </div>
            <div className="d-flex justify-content-between">
              <b>Token Standard</b>
              <div>ERC721</div>
            </div>
            <div className="d-flex justify-content-between">
              <b>Total minted</b>
              <div>25 Keys</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Vault.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
export default Vault;
