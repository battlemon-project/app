import Layout from '../../components/Layout'

const Labs = () => {
  return (
    <div className="container">

      <div className="inventory-container d-flex opened" style={{top: '30vh', height: '30vw', left: '32%'}}>
        <div className="inventory" style={{height: '36%'}}>
          <div className="inventory-left-buttons d-flex flex-column" style={{width: '150px', left: '-160px'}}>
        
            <div className="col d-flex py-1 mt-4 mb-4 pt-3">
              <button type="button" className="btn btn-outline-light btn-lg px-5 pt-3 pb-4" style={{fontSize: '55px'}}>+</button>
            </div>   
            <div className="col d-flex py-1">
              <button type="button" className="btn btn-outline-light btn-lg px-5 pt-3 pb-4" style={{fontSize: '55px'}}>+</button>
            </div>   
          </div>
          <div className="inventory-scroll d-flex" style={{width: '40vw'}}>
            <div className="row align-self-center w-100 d-flex">
              <div className="col text-center" style={{fontSize: '19px'}}>
                Click to PLUS for add sticker to Crafting
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className='text-center'>
        <button className="btn btn-primary btn-lg px-5 pb-3 pt-3 position-relative" style={{fontSize: '27px', lineHeight: '36px', top: '66vh'}}>Craft</button>
      </div>
    </div>
  )
}

Labs.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>
export default Labs