import Layout from '../../components/Layout'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import alchemy, { Gem_CONTRACT, getGems, mintGem, craftGems } from '../../helpers/alchemy'
import { useAlert } from 'react-alert'
import { useEffect, useState } from 'react'
import CssLoader from '../../components/CssLoader'
import BabylonLoader from '../../components/BabylonLoader'

interface INft {
  id: string,
  image: string,
  grade: number
}
    
const gemImages: {[key: number]: string }= {
  0: 'BTLN_Gem_Green_A_128.png',
  1: 'BTLN_Gem_Blue_A_128.png',
  2: 'BTLN_Gem_Yellow_A_128.png',
  3: 'BTLN_Gem_Purple_A_128.png',
  4: 'BTLN_Gem_Orange_A_128.png',
  5: 'BTLN_Gem_Red_A_128.png',
  6: 'BTLN_Gem_Sky_A_128.png',
}

const Labs = () => {
  const { address } = useAccount()
  const [ loader, setLoader ] = useState<boolean>(true);
  const [ animationForGem, setAnimationForGem ] = useState<[boolean, number]>([false, 0]);
  const [ userGems, setUserGems ] = useState<INft[]>([]);
  const [ selectedGems, setSelectedGems ] = useState<[string | null, string | null]>([null, null]);
  const { config: configMint } = usePrepareContractWrite(mintGem(address))
  const { data: dataMintGem, write: sendMintGem, isError: errorMintGem } = useContractWrite(configMint)
  const { config: configCraft } = usePrepareContractWrite(craftGems(selectedGems[0], selectedGems[1]))
  const { data: dataCraftGems, write: sendCraftGems, isError: errorCraftGems } = useContractWrite(configCraft)
  const [hasMounted, setHasMounted] = useState(false);
  const alert = useAlert();
  
  const { isSuccess: successMintGem } = useWaitForTransaction({
    hash: dataMintGem?.hash,
  })

  const { isSuccess: successCraftGems } = useWaitForTransaction({
    hash: dataCraftGems?.hash,
  })

  useEffect(() => {
    if (errorMintGem || successMintGem) {
      setSelectedGems([null, null])
      setLoader(true)
      refreshGems();
    }
  }, [successMintGem, errorMintGem])

  useEffect(() => {
    if (successCraftGems || errorCraftGems) {
      if (successCraftGems) {
        setAnimationForGem([true, (userGems.find(g => g.id == selectedGems[0])?.grade || 0) + 1])
        setTimeout(() => {
          setAnimationForGem([false, 0])
        }, 4000)
      }
      setSelectedGems([null, null])
      setLoader(true)
      refreshGems();
    }
  }, [errorCraftGems, successCraftGems])

  const refreshGems = async () => {
    if (process.env.NEXT_PUBLIC_PRODUCTION == 'true') {
      return;
    }
    if (!address) return;
    const gems = await getGems(address);

    let nfts: INft[] = gems.ownedNfts.map(nft => {
      const grade = parseInt((nft.tokenUri?.gateway || "https://example.com/nft/0").split('/').at(-1) as string)
      return {
        id: nft.tokenId,
        grade: grade,
        image: gemImages[grade]
      }
    })
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

  const handleSelectGem = (id: string) => () => {
    if (selectedGems[0] == id) {
      selectedGems[0] = null
    } else if (selectedGems[1] == id) {
      selectedGems[1] = null
    } else if (selectedGems[0] == null) {
      selectedGems[0] = id
    } else if (selectedGems[0] != null) {
      selectedGems[1] = id
    }
    setSelectedGems([selectedGems[0], selectedGems[1]])
  }

  const handleCraft = async () => {
    setLoader(true)
    try {
      await sendCraftGems?.();
    } catch (e) {
      const { message } = e as Error
      alert.show(message, { type: 'error' })
      setLoader(false)
    }
  }

  useEffect(() => {
    setHasMounted(true)
    if (!address) return
    refreshGems()
  }, [address])

  if (!hasMounted) return <></>

  return (
    <>
      { !address && <BabylonLoader isConnected={false} /> }
      <div className={`container ${address ? '' : 'd-none'}`}>
        <div className="inventory-container d-flex opened" style={{top: '30vh', height: '30vw', left: '32%'}}>
          <div className="inventory" style={{height: '36%'}}>
            <div className="inventory-left-buttons d-flex flex-column" style={{width: '150px', left: '-160px'}}>
          
              <div className="d-flex py-1 mt-5 mb-2 d-flex justify-content-center me-3" style={{ border: '1px solid #fff', borderRadius: '12px', minHeight: '135px'}}>
                { selectedGems[0] != null ? (
                  <img src={`/resources/assets/gems/${userGems.find(g => g.id == selectedGems[0])?.image}`} alt='gem1' className="img-fluid" />
                ):(
                  <div style={{fontSize: '75px'}} className='text-white'>+</div>
                )}
              </div>   
              <div className="d-flex py-1 mt-2 mb-4 d-flex justify-content-center me-3" style={{ border: '1px solid #fff', borderRadius: '12px', minHeight: '135px'}}>
                { selectedGems[1] != null ? (
                  <img src={`/resources/assets/gems/${userGems.find(u => u.id == selectedGems[1])?.image}`} alt='gem1' className="img-fluid" />
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
                      You have not gems yet
                      {/* Click to PLUS for add sticker to Crafting */}
                    </div> 
                  ):(
                    <>
                      {userGems.map((gem) => 
                        <div className={`col col-3 col-xl-2 border px-1 px-1 ${ selectedGems.includes(gem.id) && 'selected' }`} key={gem.id}>
                          <div className="link text-center py-2" onClick={handleSelectGem(gem.id)}  style={{cursor: 'pointer'}}>
                            <img src={`/resources/assets/gems/${gem.image}`} alt={gem.id} className="img-fluid" />
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

        
        <div className='text-center position-relative' style={{top: '66vh'}}>
          <button className="btn btn-secondary btn-lg px-3 pb-2 pt-2 me-3" style={{fontSize: '19px', lineHeight: '36px', opacity: 0.9}} onClick={handleMintGem}>Get Gems (Testnet)</button>
          <button className={`btn btn-lg px-5 pb-3 pt-3 ${!selectedGems.includes(null) && userGems.find( g=> g.id == selectedGems[0])?.image == userGems.find( g=> g.id == selectedGems[1])?.image ? 'btn-primary' : 'disabled btn-dark'}`} style={{fontSize: '27px', lineHeight: '36px'}} onClick={handleCraft}>Craft</button>
        </div>
      </div>
      
      <div className="modal" style={{display: animationForGem[0] ? 'block' : 'none'}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content position-relative" style={{width: 'auto', margin: '0 auto'}}>
            <img src={`/resources/video/Appearing_VFX_A.gif`} alt='gem1' className="img-fluid" />
            <img src={`/resources/assets/gems/${gemImages[animationForGem[1]]}`} alt='gem1' className="img-fluid position-absolute" style={{transform: 'translate(-50%, -50%)', left: '50%', top: '50%'}} />
          </div>
        </div>
      </div>
    </>
  )
}

Labs.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>
export default Labs