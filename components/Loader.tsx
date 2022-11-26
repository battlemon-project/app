import Image from 'next/image'

export default function Loader() {
  return (
    <div style={{background: '#000000'}} className="vh-100 w-100 position-absolute top-0 left-0 d-flex align-items-center justify-content-center">
      <Image src="/babylon.svg" alt="Babylon.js" width={260} height={260} />
    </div>
  )
}
