import Hero from '@/components/Hero'
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_allHeroImg, query_topIntro, query_topShop } from "@/hook/contentful-queries"

import { Box, Container, VStack } from "@chakra-ui/react"
import TopIntro from '@/components/TopIntro'
import TopShop from '@/components/TopShop'
import PageShell from '@/components/PageShell'
import { dailyNum } from '@/utils/helpers'

import ja from '@/data/ja'
import en from '@/data/en'
import { useRouter } from 'next/router'

export default function Home(
  {
    todayImgPair,
    introTextAvatar,
    productTextImage
  }: {
    todayImgPair: AllHeroImgInterface[],
    introTextAvatar: TopIntroTextAvatar
    productTextImage: TopShopTextImage[]
  }) {

  const router = useRouter()
  const { locale } = router
  const t = locale === 'en' ? en : ja

  const { user, error, isLoading } = useUser()

  return (
    <>
      {/* <Hero todayImgPair={todayImgPair} /> */}
      <PageShell customPT={{ base: 24, lg: 32 }} customSpacing={null} >
        <Box>{t.title}</Box>
        <TopIntro />
      </PageShell>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const { topHeroImgsCollection: { items: allHeroImg } } = await fetchContentful(query_allHeroImg)
  const { topIntroCollection: { items: introTextAvatar } } = await fetchContentful(query_topIntro)
  const { topShopCollection: { items: productTextImage } } = await fetchContentful(query_topShop)

  // Arrange Portrait First & Destructuring 
  const portraitFirstAllImg = allHeroImg.map(pair => pair.imageCollection.items.sort((a, b) => a.width - b.width))
  const todayImgPair = portraitFirstAllImg[dailyNum(portraitFirstAllImg)]

  return {
    props: {
      todayImgPair,
      introTextAvatar: introTextAvatar[0],
      productTextImage
    },
    revalidate: 30,
  }
}