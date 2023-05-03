import Layout from '../../components/Layout'

const Vault = () => {
  return (
    <div className="container text-center">
      <video loop autoPlay playsInline muted className="position-absolute" style={{margin: ' 0 auto', borderRadius: '15px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <source src="/resources/video/mixing.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

Vault.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>
export default Vault
