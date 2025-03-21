import DoublePartition from '@/app/components/DoublePartition'
import MainCrousel from '@/app/components/MainCrousel'
import Seasonal from '@/app/components/Seasonal'
import TopAnime from '@/app/components/TopAnime'
import Upcoming from '@/app/components/Upcoming'
import React from 'react'


const page = () => {
  return (
    <>
      <MainCrousel/>
      <TopAnime/>
      <Seasonal homepage={true}/>
      <DoublePartition/>
    </>
  )
}

export default page