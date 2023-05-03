import Layout from '../../components/Layout'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'
import alchemy, { Gem_CONTRACT, getGems, mintGem } from '../../helpers/alchemy'
import { useAlert } from 'react-alert'
import { useEffect, useState } from 'react'
import CssLoader from '../../components/CssLoader'

const Labs = () => {
  const { address } = useAccount()
  const { config } = usePrepareContractWrite(mintGem(address))
  const { write: sendMintGem } = useContractWrite(config)
  const [ loader, setLoader ] = useState<boolean>(true);
  const [ userGems, setUserGems ] = useState<string[]>([]);
  const [ selectedGems, setSelectedGems ] = useState<[number | null, number | null]>([null, null]);
  const alert = useAlert();


  const refreshGems = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      return;
    }
    if (!address) return;
    const gems = await getGems(address);
    let nfts = gems.ownedNfts.map(nft => (nft.tokenUri?.gateway || "https://example.com/nft/0").split('/').at(-1) as string)
    const gemImages: {[key: string]: string }= {
      0: 'BTLN_Gem_Green_A_128.png',
      1: 'BTLN_Gem_Blue_A_128.png',
      2: 'BTLN_Gem_Yellow_A_128.png',
      3: 'BTLN_Gem_Purple_A_128.png',
      4: 'BTLN_Gem_Orange_A_128.png',
      5: 'BTLN_Gem_Red_A_128.png',
      6: 'BTLN_Gem_Sky_A_128.png',
    }
    nfts = nfts.map(num => gemImages[num])
    console.log(nfts)
    setUserGems(nfts);
    setLoader(false);
  }

  const handleMintGem = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      return false
    }
    setLoader(true)

    try {
      await sendMintGem?.();
    } catch (e) {
      const { message } = e as Error
      alert.show(message, { type: 'error' })
      setLoader(false)
    }
  }

  const handleSelectGem = (idx: number) => () => {
    if (selectedGems[0] == idx) {
      selectedGems[0] = null
    } else if (selectedGems[1] == idx) {
      selectedGems[1] = null
    } else if (selectedGems[0] == null) {
      selectedGems[0] = idx
    } else if (selectedGems[0] != null) {
      selectedGems[1] = idx
    }
    setSelectedGems([selectedGems[0], selectedGems[1]])
  }

  useEffect(() => {
    setSelectedGems([null, null])
    refreshGems();
    alchemy.ws.on({ 
      address: Gem_CONTRACT 
    }, (tx) => {
      setLoader(true)
      refreshGems();
    });
  }, [])

  return (
    <div className="container">
      
      <div className='text-center'>
        <button className="btn btn-success position-relative" onClick={handleMintGem}>Get Gems (Testnet)</button>
      </div>

      <div className="inventory-container d-flex opened" style={{top: '30vh', height: '30vw', left: '32%'}}>
        <div className="inventory" style={{height: '36%'}}>
          <div className="inventory-left-buttons d-flex flex-column" style={{width: '150px', left: '-160px'}}>
        
            <div className="d-flex py-1 mt-5 mb-2 d-flex justify-content-center me-3" style={{ border: '1px solid #fff', borderRadius: '12px', minHeight: '135px'}}>
              { selectedGems[0] != null ? (
                <img src={`/resources/assets/gems/${userGems[selectedGems[0]]}`} alt='gem1' className="img-fluid" />
              ):(
                <div style={{fontSize: '75px'}} className='text-white'>+</div>
              )}
            </div>   
            <div className="d-flex py-1 mt-2 mb-4 d-flex justify-content-center me-3" style={{ border: '1px solid #fff', borderRadius: '12px', minHeight: '135px'}}>
              { selectedGems[1] != null ? (
                <img src={`/resources/assets/gems/${userGems[selectedGems[1]]}`} alt='gem1' className="img-fluid" />
              ):(
                <div style={{fontSize: '75px'}} className='text-white'>+</div>
              )}
            </div>   
          </div>
          <div className="inventory-scroll d-flex" style={{width: '40vw'}}>
            <div className={`row w-100 d-flex ${!loader && userGems.length ? 'align-self-start' : 'align-self-center'}`}>
              {loader ? (
                <CssLoader />
              ):(
                !userGems.length ? (
                  <div className="col text-center" style={{fontSize: '19px'}}>
                    You haven't gems yet
                    {/* Click to PLUS for add sticker to Crafting */}
                  </div> 
                ):(
                  <>
                    {userGems.map((gem, idx) => 
                      <div className={`col col-3 col-xl-2 border px-1 px-1 ${ selectedGems.includes(idx) && 'selected' }`} key={`${gem}${idx}`}>
                        <div className="link text-center py-2" onClick={handleSelectGem(idx)}  style={{cursor: 'pointer'}}>
                          <img src={`/resources/assets/gems/${gem}`} alt={gem} className="img-fluid" />
                        </div>
                      </div>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      
      <div className='text-center'>
        <button className={`btn btn-lg px-5 pb-3 pt-3 position-relative ${selectedGems.includes(null) ? 'disabled btn-dark' : 'btn-primary'}`} style={{fontSize: '27px', lineHeight: '36px', top: '66vh'}}>Craft</button>
      </div>
    </div>
  )
}

Labs.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>
export default Labs