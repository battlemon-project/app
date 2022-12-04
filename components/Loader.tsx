import Image from 'next/image'

export default function Loader() {
  return (
    <div style={{background: '#000000'}} className="vh-100 w-100 position-absolute top-0 left-0 d-flex align-items-center justify-content-center" id="sceneLoaderElement">
      <Image src="/assets/btlmn_logo_inner_256.png" alt="Battlemon Logo inner" width={256} height={256} />
    </div>
  )
}
