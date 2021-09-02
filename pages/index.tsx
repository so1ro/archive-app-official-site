import Hero from '@/components/Hero'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'
import { GetStaticProps } from "next"

import { fetchContentful } from "@/hook/contentful"
import {
  query_archiveTopPlan,
  query_topPhilosophy,
  query_topCondition,
  query_topChartText,
  query_topSigninApplyAnnotation,
  query_topHeroText
} from "@/hook/contentful-queries"

import { Box, Container, VStack } from "@chakra-ui/react"
import PageShell from '@/components/PageShell'
import TopIntro from '@/components/TopIntro'
import Plan from '@/components/Plan'
import { dailyNum } from '@/utils/helpers'
import Philosophy from '@/components/Philosophy'
import Condition from '@/components/Condtion'
import Plan01Chart from '@/components/Plan01Chart'
import SigninApplyButton from '@/components/SigninApplyButton'


export default function Home(
  { plan, philosophy, condition, chartText, applyAnnotation, heroText }:
    {
      plan: topPlanText, philosophy: topPhilosophyText, condition: topConditionText,
      chartText: topPlan1ChartText, applyAnnotation: topSigninApplyAnnotation, heroText: topHeroText
    }
) {

  const router = useRouter()
  const { locale } = router
  const { user, error, isLoading } = useUser()

  return (
    <>
      <Hero heroText={heroText[locale]} />
      <Philosophy text={philosophy[locale]} />
      <PageShell customPT={{ base: 24, lg: 32 }} customSpacing={null} >
        <TopIntro />
        <Box>
          <Plan badge={plan.plan01[locale].badge} title={plan.plan01[locale].title} text={plan.plan01[locale].text} />
          <Plan01Chart chartText={chartText[locale]} />
        </Box>
        <Plan badge={plan.plan02[locale].badge} title={plan.plan02[locale].title} text={plan.plan02[locale].text} />
        <Plan badge={plan.option[locale].badge} title={plan.option[locale].title} text={plan.option[locale].text} />
        <SigninApplyButton buttonText={locale === 'en' ? 'Sing in / Apply' : 'サインイン・お申し込み'} annotation={applyAnnotation[locale]} />
        <Condition condition={condition} />
      </PageShell>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // get Archivce data from Contentful
  const { archiveTopPlanCollection: { items: planText } } = await fetchContentful(query_archiveTopPlan)
  const { archiveAppTopPhilosophyCollection: { items: philosophyText } } = await fetchContentful(query_topPhilosophy)
  const { archiveAppTopConditionCollection: { items: conditionText } } = await fetchContentful(query_topCondition)
  const { archiveAppTopPlan1ChartCollection: { items: plan1ChartText } } = await fetchContentful(query_topChartText)
  const { archiveAppTopSignInApplyCollection: { items: applyAnnotationText } } = await fetchContentful(query_topSigninApplyAnnotation)
  const { archiveAppTopHeroCollection: { items: heroTexts } } = await fetchContentful(query_topHeroText)

  const plan = planText[0].text
  const philosophy = philosophyText[0].philosophy
  const condition = conditionText[0].condition
  const chartText = plan1ChartText[0].chartText
  const applyAnnotation = applyAnnotationText[0].signinApply.annotation
  const heroText = heroTexts[0].heroText

  return {
    props: {
      plan,
      philosophy,
      condition,
      chartText,
      applyAnnotation,
      heroText
    },
    revalidate: 30,
  }
}