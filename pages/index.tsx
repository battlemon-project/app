import BabylonLoader from '../components/BabylonLoader'
import dynamic from 'next/dynamic'
import { Suspense, useEffect } from 'react'
import Layout from '../components/Layout'

const HomeScene = dynamic(() => import('../scenes/HomeScene'), {
  suspense: true,
})

const Index = () => {

  useEffect(() => {
    document?.body.classList.add('babylon-page');
  
    return function cleanup() {
      document?.body.classList.remove('babylon-page');
    };
  }, []);

  return (
    <Suspense fallback={<BabylonLoader isConnected={true} />}>
      <HomeScene />
    </Suspense>
  )
}

Index.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>
export default Index