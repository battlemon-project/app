import Image from 'next/image'

export default function Loader({ status }: { status: string }) {
  return (
    <div style={{background: '#000000'}} className="vh-100 w-100 position-absolute top-0 left-0 d-flex align-items-center justify-content-center" id="sceneLoaderElement">
      <div style={{display: 'inline-block', width: '256px', height: '256px', position: 'relative'}}>
        <div className="text-light mx-auto w-100 text-center h5">{status == 'loading' || status =='disconnected' ? 'You need to Sign In' : ''}</div>
        <Image src="/assets/btlmn_logo_inner_256.png" alt="Battlemon Logo inner" width={256} height={256} className="position-absolute" />
        <Image src="/assets/btlmn_logo_outer_256.png" alt="Battlemon Logo Outer" width={256} height={256} className={`position-absolute ${status == 'connected' ? 'spinner' : ''}`} />
      </div>
      
    </div>
  )
}
