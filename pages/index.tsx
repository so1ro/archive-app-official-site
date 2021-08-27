import Hero from '@/components/Hero'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_archiveTopPlan } from "@/hook/contentful-queries"

import { Box, Container, VStack } from "@chakra-ui/react"
import PageShell from '@/components/PageShell'
import TopIntro from '@/components/TopIntro'
import Plan from '@/components/Plan'
import { dailyNum } from '@/utils/helpers'


export default function Home({ planText }: { planText: topPlanText }) {

  const router = useRouter()
  const { locale } = router
  const { user, error, isLoading } = useUser()

  return (
    <>
      {/* <Hero todayImgPair={todayImgPair} /> */}
      <PageShell customPT={{ base: 24, lg: 32 }} customSpacing={null} >
        <Box></Box>
        <TopIntro />
        <Plan badge={planText.plan01[locale].badge} title={planText.plan01[locale].title} text={planText.plan01[locale].text} />
        <Plan badge={planText.plan02[locale].badge} title={planText.plan02[locale].title} text={planText.plan02[locale].text} />
        <Plan badge={planText.option[locale].badge} title={planText.option[locale].title} text={planText.option[locale].text} />
      </PageShell>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const { archiveTopPlan: { text: planText } } = await fetchContentful(query_archiveTopPlan)

  return {
    props: {
      planText
    },
    revalidate: 30,
  }
}