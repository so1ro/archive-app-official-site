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
  query_topHeroText,
  query_applyText,
  query_topHeroImagesJa,
  query_topHeroImagesEn,
  query_topPromoVideoId
} from "@/hook/contentful-queries"

import { Box, Container, VStack } from "@chakra-ui/react"
import PageShell from '@/components/PageShell'
import VideoVimeoLT from '@/components/VideoVimeoLT'
import Plan from '@/components/Plan'
import { dailyNum } from '@/utils/helpers'
import Philosophy from '@/components/Philosophy'
import Condition from '@/components/Condtion'
import Plan01Chart from '@/components/Plan01Chart'
import SigninApplyButton from '@/components/SigninApplyButton'
import ApplyForm from '@/components/ApplyForm'

export default function Home(
  { plan, philosophy, condition, chartText, applyAnnotation, heroText, heroImagesJa, heroImagesEn, applyText, vimeoId }:
    {
      plan: topPlanText, philosophy: topPhilosophyText, condition: topConditionText,
      chartText: topPlan1ChartText, applyAnnotation: topSigninApplyAnnotation, heroText: topHeroText,
      heroImagesJa: topHeroImages, heroImagesEn: topHeroImages, applyText: applyText, vimeoId: topPromoVideoId
    }
) {

  const router = useRouter()
  const { locale } = router
  const { user, error, isLoading } = useUser()

  return (
    <>
      <Hero heroText={heroText[locale]} heroImages={locale === 'en' ? heroImagesEn : heroImagesJa} />
      <Philosophy text={philosophy[locale]} />
      <PageShell customPT={{ base: 16, md: 12, lg: 24 }} customSpacing={{ base: 24, md: 36, lg: 48 }} >
        <VideoVimeoLT vimeoId={vimeoId[locale]} aspect={null} autoplay={false} borderRadius={12} />
        <Plan badge={plan.plan01[locale].badge} title={plan.plan01[locale].title} text={plan.plan01[locale].text} />
        <Box>
          <Plan badge={plan.plan02[locale].badge} title={plan.plan02[locale].title} text={plan.plan02[locale].text} />
          <Plan01Chart chartText={chartText[locale]} />
        </Box>
        <Plan badge={plan.option[locale].badge} title={plan.option[locale].title} text={plan.option[locale].text} />
        {!isLoading && !user && <SigninApplyButton buttonText={locale === 'en' ? 'Sign in / Apply' : 'サインイン・お申し込み'} annotation={applyAnnotation[locale]} />}
        {!isLoading && user && <Box w='full' maxW='840px'><ApplyForm userEmail={user.email} auth0_UUID={user.sub} applyText={applyText} /></Box>}
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
  const { archiveAppApplyCollection: { items: applyTextCollection } } = await fetchContentful(query_applyText) // This is for fetching Annotation under the price list
  const { archiveAppTopHeroImagesJaCollection: { items: heroImagesJaCollection } } = await fetchContentful(query_topHeroImagesJa)
  const { archiveAppTopHeroImagesEnCollection: { items: heroImagesEnCollection } } = await fetchContentful(query_topHeroImagesEn)
  const { archiveAppTopPromotionVideoCollection: { items: vimeoIdCollection } } = await fetchContentful(query_topPromoVideoId)

  const plan = planText[0].text
  const { philosophy } = philosophyText[0]
  const { condition } = conditionText[0]
  const { chartText } = plan1ChartText[0]
  const applyAnnotation = applyAnnotationText[0].signinApply.annotation
  const { heroText } = heroTexts[0]
  const { applyText } = applyTextCollection[0]
  const { vimeoId } = vimeoIdCollection[0]

  return {
    props: {
      plan,
      philosophy,
      condition,
      chartText,
      applyAnnotation,
      heroText,
      heroImagesJa: heroImagesJaCollection[0].imageCollection.items,
      heroImagesEn: heroImagesEnCollection[0].imageCollection.items,
      applyText,
      vimeoId,
    },
    revalidate: 30,
  }
}