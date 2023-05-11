import Layout from '../../components/Layout'
import FarmingCard, {FarmingCardType} from "../../components/FarmingCard/FarmingCard";
import Pick1 from "../../public/resources/assets/256/IcePick-1.png";
import Gem1 from "../../public/resources/assets/256/Gem-Blue.png"
import Pick2 from "../../public/resources/assets/256/IcePick-2.png";
import Gem2 from "../../public/resources/assets/256/Gem-Green.png"
import Pick3 from "../../public/resources/assets/256/IcePick-3.png";
import Gem3 from "../../public/resources/assets/256/Gem-Orange.png"


const farmingCards: FarmingCardType[] = [
  {
    title: 'Mining Low',
    gemURL: Gem1,
    pickURL: Pick1
  },
  {
    title: 'Mining Medium',
    gemURL: Gem2,
    pickURL: Pick2
  },
  {
    title: 'Mining High',
    gemURL: Gem3,
    pickURL: Pick3
  }
];

const Defi = () => {
  return (
    <div className="container">
      <h1 className="text-center text-light mb-5 pb-5 mt-5 pt-5">Farming</h1>
      <div className="row justify-content-center">
        {farmingCards.map((card, i) => (
          <div className="col-4" key={i}>
            <FarmingCard {...card}/>
          </div>
        ))}
      </div>
    </div>
  )
}


Defi.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>
export default Defi