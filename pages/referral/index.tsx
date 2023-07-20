import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../hooks/useAuth';
import { BabylonLoader } from '../../components/BabylonLoader';
import { useReferral } from '../../hooks/useReferral';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext/AuthContext';

const Referral = () => {
  const { isAuthorized } = useAuth();
  const [cookies] = useCookies();
  const { createReferralCode } = useReferral();
  const { user, setUser } = useContext(AuthContext);

  if (!isAuthorized) return <BabylonLoader isConnected={false} />;

  return (
    <div className="flex gap-10 w-full container mx-auto px-4">
      <div className="basis-2/3 text-white">
        <div className="rounded-xl min-h-96 border border-white mb-10 p-7">
          <h2 className="text-3xl font-bold mb-3">
            Invite friends and get a bonus
          </h2>
          {user?.referralCode ? (
            <div className="flex items-center gap-3 px-6 py-2 border-white border w-fit rounded-xl">
              {user.referralCode}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${location.protocol}//${location.host}/referral/${user.referralCode}`
                  );
                }}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Edit / Copy">
                    <path
                      id="Vector"
                      d="M9 9V6.2002C9 5.08009 9 4.51962 9.21799 4.0918C9.40973 3.71547 9.71547 3.40973 10.0918 3.21799C10.5196 3 11.0801 3 12.2002 3H17.8002C18.9203 3 19.4801 3 19.9079 3.21799C20.2842 3.40973 20.5905 3.71547 20.7822 4.0918C21.0002 4.51962 21.0002 5.07967 21.0002 6.19978V11.7998C21.0002 12.9199 21.0002 13.48 20.7822 13.9078C20.5905 14.2841 20.2839 14.5905 19.9076 14.7822C19.4802 15 18.921 15 17.8031 15H15M9 9H6.2002C5.08009 9 4.51962 9 4.0918 9.21799C3.71547 9.40973 3.40973 9.71547 3.21799 10.0918C3 10.5196 3 11.0801 3 12.2002V17.8002C3 18.9203 3 19.4801 3.21799 19.9079C3.40973 20.2842 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H11.8036C12.9215 21 13.4805 21 13.9079 20.7822C14.2842 20.5905 14.5905 20.2839 14.7822 19.9076C15 19.4802 15 18.921 15 17.8031V15M9 9H11.8002C12.9203 9 13.4801 9 13.9079 9.21799C14.2842 9.40973 14.5905 9.71547 14.7822 10.0918C15 10.5192 15 11.079 15 12.1969L15 15"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-xl mb-2">Create code</h3>
              <Formik
                initialValues={{ code: '' }}
                onSubmit={async (d) => {
                  if (d.code.length < 4 || d.code.length > 10) {
                    toast.error('Referral code length must be from 4 to 10');
                  }
                  const token = cookies.auth_token;
                  if (token) {
                    createReferralCode(token, d.code)
                      .then((d) => setUser(d))
                      .catch((e: Error) => toast.error(e.message));
                  }
                }}
              >
                {({ handleChange, values, handleSubmit }) => (
                  <form className="flex gap-3" onSubmit={handleSubmit}>
                    <input
                      className="px-4 py-2 rounded-xl text-black"
                      type="text"
                      placeholder="Enter code"
                      name="code"
                      value={values.code}
                      onChange={handleChange}
                    />
                    <button
                      className="px-6 py-2 bg-white text-black rounded-xl"
                      type="submit"
                    >
                      Create
                    </button>
                  </form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
      <div className="basis-1/3 p-7 bg-blue bg-opacity-30 rounded-xl text-white">
        <h2 className="text-3xl font-bold mb-5">Battlemon referral program</h2>
        <p className="text-lg">
          In order to participate in our referral program and receive bonuses,
          generate your personal referral link and share it with others.
          <br />
          <br />
          As a member of the program, you will receive 5% of all commissions
          from gems crafting earned by users who sign up using your link, while
          the referral user will receive a 5% discount on all commissions
          generated by a user while crafting a gem
        </p>
      </div>
    </div>
  );
};

Referral.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;

export default Referral;
