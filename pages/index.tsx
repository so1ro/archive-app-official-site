import Hero from '@/components/Hero'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import { query_archiveTopPlan, query_archiveTopPhilosophy } from "@/hook/contentful-queries"

import { Box, Container, VStack } from "@chakra-ui/react"
import PageShell from '@/components/PageShell'
import TopIntro from '@/components/TopIntro'
import Plan from '@/components/Plan'
import { dailyNum } from '@/utils/helpers'
import Philosophy from '@/components/Philosophy'


export default function Home({ plan, philosophy }: { plan: topPlanText, philosophy: topPhilosophyText }) {

  const router = useRouter()
  const { locale } = router
  const { user, error, isLoading } = useUser()

  return (
    <>
      {/* <Hero todayImgPair={todayImgPair} /> */}
      <Philosophy text={philosophy[locale]} />
      <PageShell customPT={{ base: 24, lg: 32 }} customSpacing={null} >
        <TopIntro />
        <Plan badge={plan.plan01[locale].badge} title={plan.plan01[locale].title} text={plan.plan01[locale].text} />
        <Plan badge={plan.plan02[locale].badge} title={plan.plan02[locale].title} text={plan.plan02[locale].text} />
        <Plan badge={plan.option[locale].badge} title={plan.option[locale].title} text={plan.option[locale].text} />
      </PageShell>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const { archiveTopPlanCollection: { items: planText } } = await fetchContentful(query_archiveTopPlan)
  const { archiveAppTopPhilosophyCollection: { items: philosophyText } } = await fetchContentful(query_archiveTopPhilosophy)
  const plan = planText[0].text
  const philosophy = philosophyText[0].philosophy

  return {
    props: {
      plan,
      philosophy
    },
    revalidate: 30,
  }
}