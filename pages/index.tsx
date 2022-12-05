import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useRecoilState } from 'recoil';
import { loaderState } from '../atoms/loaderState';

const HomeScene = dynamic(() => import('../scenes/HomeScene'), {
  suspense: true,
})

export default function Home() {
  const [ loader ] = useRecoilState(loaderState);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <Suspense fallback={<Loader />}>
        <HomeScene />
      </Suspense>
      {loader[1] && <Loader />}

      <Footer />
    </>
  )
}
