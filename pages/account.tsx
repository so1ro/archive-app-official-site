import { useState, useEffect } from 'react'
import { GetStaticProps } from "next"
import { useRouter } from 'next/router'

import { useUser } from '@auth0/nextjs-auth0'
import { useUserMetadata } from '@/context/useUserMetadata'
import { fetchAllPrices } from '@/hook/getStaticProps'
import { postData } from '@/utils/helpers'
import PriceList from '@/components/PriceList'
import { Toast } from '@/components/Toast'
import { fetchContentful } from '@/hook/contentful'
import { query_applyText } from '@/hook/contentful-queries'

import { Circle, Button, Code, Box, Grid, Center, Text, Heading, useToast, Stack, VStack, HStack, useColorModeValue, Table, Tbody, Tr, Td, TableCaption, useBreakpointValue, Spinner } from '@chakra-ui/react'
import PageShell from '@/components/PageShell'
import LoadingSpinner from '@/components/Spinner'
import { bg_color, highlight_color, text_color, text_highlight_color } from '@/styles/colorModeValue'
import ApplyForm from '@/components/ApplyForm'

export default function Account({ applyText, allPrices, }: { applyText: applyText, allPrices: AllPrices[], }) {
  console.log('allPrices:', allPrices)

  const { user, error, isLoading } = useUser()
  const {
    User_Detail,
    isMetadataLoading,
    subscription_state,
    Subscription_Detail,
    One_Pay_Detail,
    error_metadata,
    isBeforeCancelDate,
    temporaryPaidCheck,
    setTemporaryPaidCheck,
  } = useUserMetadata()

  // Hook
  const toast = useToast()
  const router = useRouter()
  const { locale } = useRouter()
  // const { annotation } = landingPageText[0]
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' })
  const bgColor = useColorModeValue(bg_color.l, bg_color.d)
  const textColor = useColorModeValue(text_color.l, text_color.d)
  const textHighlightColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)
  const stateCss = { fontWeight: 'bold', borderRadius: '3xl', border: `2px solid `, px: 6, py: 2, d: 'inline-block', mb: 5 }

  // Stat
  // const [{ user }, setIsFavoriteArchiveLoading] = useState<{ isFavoriteArchiveLoading: boolean }>({ isFavoriteArchiveLoading: false })

  // //// useEffect
  // useEffect(() => {
  //   if (user) {
  //     const checkSession = async () => {

  //     }
  //     checkSession()
  //   }
  // }, [user]) 

  //// useEffect
  // useEffect(() => {
  //   if (user && typeof window !== 'undefined' && window.location.search.indexOf('session_id') > 0) {
  //     const urlParams = new URLSearchParams(window.location.search)
  //     const session_id = urlParams.get('session_id')
  //     const checkSession = async () => {
  //       const customerData: CustomerDataInterface = await postData({
  //         url: '/api/stripe/check-session',
  //         data: { session_id }
  //       }).then(data => data)

  //       if (customerData.customer_email === user.email) {
  //         setTemporaryPaidCheck({ temporaryPaidCheck: true })
  //       }
  //     }
  //     checkSession()
  //   }
  // }, [user])

  // Function
  // const handleCustomerPortal = async (customer_Id: string) => {
  //   const { url, error } = await postData({
  //     url: '/api/stripe/create-portal-link',
  //     data: { customer_Id }
  //   })
  //   if (error) return alert(error.message)
  //   window.location.assign(url)
  // }

  // const isPermanentSubscription = (Subscription_Detail) => {
  //   return (parseFloat(Subscription_Detail.criteria_OnePay_price) - User_Detail.past_charged_fee) <= 0
  // }

  // const indexBgColor = useColorModeValue(border_color.l, border_color.d)

  // // Component
  // const CustomerPortalButton = () => (
  //   <Center>
  //     <Button color='#fff' bg='#69b578' fontSize={{ base: 'xs', sm: 'md' }} onClick={() => {
  //       handleCustomerPortal(Subscription_Detail.customer_Id)
  //       toast({ duration: 3000, render: () => (<Toast text={"カスタマーポータルに移動中..."} />) })
  //     }}>
  //       {(Subscription_Detail.cancel_at_period_end || subscription_state === 'paused') ?
  //         `サブスクリプションの再開 ／ お支払い履歴` : `プランの変更・キャンセル・一時停止 ／ 履歴`}
  //     </Button>
  //   </Center>
  // )

  // Function
  const currentState = (): any => {
    if (!User_Detail?.isApplied) return 'applying'
    else if (User_Detail?.isApplied && !User_Detail?.isApproved) return 'checking'
    else if (User_Detail?.isApplied && User_Detail?.isApproved && (User_Detail?.plan === 'Plan_2') && !User_Detail?.isStarted) return 'payment'
    else if (User_Detail?.isApplied && User_Detail?.isApproved && User_Detail?.isStarted) return 'start'
  }


  // Render
  if (error) return <div>{error.message}</div>
  if (!isLoading && !user) { router.push('/') }

  if (!isMetadataLoading && user) {
    return (
      <PageShell customPT={null} customSpacing={null}>
        <VStack w='full' spacing={16}>
          <Box fontWeight='medium' fontSize='2xl' w='full'>
            {locale === 'en' ? `${user.email}` : `${user.email}　様`}
          </Box>
          <Stack d='block' textAlign='center' shouldWrapChildren isInline>
            <Box><Box {...stateCss} color={(currentState() === 'applying') && textHighlightColor} >{locale === 'en' ? 'Apply' : '申込'}</Box> ・・・ </Box>
            <Box><Box {...stateCss} color={(currentState() === 'checking') && textHighlightColor}>{locale === 'en' ? 'Check' : '審査'}</Box> ・・・ </Box>
            {User_Detail?.plan === 'Plan_2' &&
              <Box><Box {...stateCss} color={(currentState() === 'payment') && textHighlightColor}>{locale === 'en' ? 'Payment' : 'お支払'}</Box> ・・・ </Box>}
            <Box {...stateCss} color={(currentState() === 'start') && textHighlightColor}>{locale === 'en' ? 'Start' : 'スタート'}</Box>
          </Stack>
        </VStack>
        {(currentState() === 'applying') &&
          <Box w='full' maxW='840px'> <ApplyForm userEmail={user.email} auth0_UUID={user.sub} applyText={applyText} /> </Box>}
        {(currentState() === 'checking') &&
          <Box>
            <Text whiteSpace='pre-wrap'>{locale === 'en' ?
              'Your application was successfully sent. We are now checking your project.\nIf it is passed, you will receive an email in a week.' :
              'お申し込みを受領いたしました。\n審査に通過した場合、一週間以内にメールにてご連絡をさせていただきます。'}</Text>
            {/* ここに以下を追加。申し込みプラン、SNS url、SNS統合希望の有無、創作物のタイプ、メッセージ */}
          </Box>}
        {(currentState() === 'payment') &&
          <Box>
            <Text whiteSpace='pre-wrap'>{locale === 'en' ?
              '以下、お支払が開始されますと、ご契約成立となります。最初の2ヶ月間は無料です。' :
              'Please start paying from the link below. The payment will not happen in the first 2 months.'}</Text>
            {/* ここに以下を追加。Stripe Checkout Button 申し込みプラン、SNS url、SNS統合希望の有無、創作物のタイプ、メッセージ */}
            <PriceList user={user} allPrices={allPrices}
              annotation={null}
              isOnePayPermanent={false} />
          </Box>}
        {(currentState() === 'start') &&
          <Box>
            <Text whiteSpace='pre-wrap'>{locale === 'en' ?
              '' :
              ''}</Text>
            {/* ここに以下を追加。アーカイブアプリのURL、プラン、SNS url、SNS統合希望の有無、創作物のタイプ */}
          </Box>}
      </PageShell>
    )
  }

  return <LoadingSpinner />


  //   // サブスクリプション購入後
  //   if ((!isLoading && !isMetadataLoading) && (subscription_state === 'subscribe' && !One_Pay_Detail)) {

  //     // Status Table contents
  //     const status = [
  //       {
  //         name: 'プラン',
  //         value: `${Subscription_Detail.subscription_Price}円／月`,
  //         display: true
  //       },
  //       {
  //         name: '特典',
  //         value: Subscription_Detail.subscription_Description,
  //         display: true
  //       },
  //       {
  //         name: '現在のステータス',
  //         value: Subscription_Detail.subscription_Status,
  //         display: true
  //       },
  //       {
  //         name: '永久ご視聴まで残り',
  //         value: `${parseFloat(Subscription_Detail.criteria_OnePay_price) - User_Detail.past_charged_fee}円`,
  //         display: !isPermanentSubscription(Subscription_Detail)
  //       },
  //       {
  //         name: '永久ご視聴',
  //         value: '○',
  //         display: isPermanentSubscription(Subscription_Detail)
  //       },
  //       {
  //         name: 'キャンセル',
  //         value: `このサブスクリプションは、\n${Subscription_Detail.cancel_at + (isBeforeCancelDate ? 'までご利用いただけます。' : 'にキャンセルされました。')}`,
  //         display: Subscription_Detail.cancel_at_period_end
  //       },
  //     ]

  //     return (
  //       <PageShell customPT={null} customSpacing={null}>
  //         <Box w='full' maxW='640px'>
  //           <Box mb={8}>{user.email} 様</Box>
  //           <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={16} pt={2} pb={4} bg={bgColor}>
  //             <Table variant="striped" colorScheme="gray" size={tableSize} whiteSpace='pre-wrap'>
  //               <TableCaption placement='top' mt={0} mb={2}>プラン詳細</TableCaption>
  //               <Tbody>
  //                 {status.map((s, i) => (s.display && (<Tr key={i}><Td>{s.name}</Td><Td>{s.value}</Td></Tr>)))}
  //               </Tbody>
  //             </Table>
  //           </Box>
  //           <CustomerPortalButton />
  //         </Box>
  //       </PageShell>)
  //   }

  //   // サブスクリプション未購入、ワンペイ永久ご視聴購入済み
  //   if (!isLoading && !isMetadataLoading && One_Pay_Detail) {

  //     // Status Table contents
  //     const status = [
  //       {
  //         name: 'プラン',
  //         value: One_Pay_Detail.title,
  //       },
  //       {
  //         name: '特典',
  //         value: '期限なく、すべてのコンテンツをご視聴をいただけます。',
  //       },
  //       {
  //         name: '永久ご視聴',
  //         value: '○',
  //       },
  //     ]

  //     return (
  //       <PageShell customPT={null} customSpacing={null}>
  //         <Box w='full' maxW='640px'>
  //           <Box mb={4}>{user.email} 様</Box>
  //           <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={16} pt={2} pb={4} bg={bgColor}>
  //             <Table variant="striped" colorScheme="gray" size={tableSize}>
  //               <TableCaption placement='top' mt={0} mb={2}>プラン詳細</TableCaption>
  //               <Tbody>
  //                 {status.map((s, i) => (<Tr key={i}><Td>{s.name}</Td><Td>{s.value}</Td></Tr>))}
  //               </Tbody>
  //             </Table>
  //           </Box>
  //           {subscription_state === 'unsubscribe' && <>
  //             <Text mb={4}>サブスクリプションを開始することもできます。</Text>
  //             <PriceList user={user} allPrices={allPrices} annotation={annotation} isOnePayPermanent={!!One_Pay_Detail} /></>}
  //           {subscription_state !== 'unsubscribe' && <>
  //             <Center mb={4}>サブスクリプションの詳細は、次のボタンからご確認いただけます。</Center>
  //             <CustomerPortalButton />
  //           </>}
  //         </Box>
  //       </PageShell>)
  //   }

  //   // サブスクリプションのキャンセル後
  //   // 注：Stripe Dashboardからのキャンセルは、即日キャンセルになる
  //   if (!isLoading && !isMetadataLoading &&
  //     (Subscription_Detail && Subscription_Detail.subscription_Status === 'canceled' && !One_Pay_Detail)) {
  //     return (
  //       <PageShell customPT={null} customSpacing={null}>
  //         <Box w='full' maxW='640px'>
  //           <Box mb={4}>{user.email} 様</Box>
  //           <Box>{Subscription_Detail.cancel_at ?? Subscription_Detail.canceled_at}にキャンセルされました。</Box>
  //           {isPermanentSubscription(Subscription_Detail) && <Grid templateColumns={{ base: '1fr', md: '160px auto' }} gap={2} mb={8}>
  //             <Box>永久ご視聴</Box>
  //             <Box>○</Box>
  //           </Grid>}
  //           <Text mb={4}>新たにサブスクリプションやワンペイ永久ご視聴プランを開始することもできます。</Text>
  //           <PriceList user={user} allPrices={allPrices} annotation={annotation} isOnePayPermanent={false} />
  //         </Box>
  //       </PageShell>
  //     )
  //   }

  //   // サブスクリプションの一時停止 Paused
  //   if (!isLoading && !isMetadataLoading &&
  //     (Subscription_Detail && subscription_state === 'paused' && Subscription_Detail.pause_collection && !One_Pay_Detail)) {
  //     return (
  //       <PageShell customPT={null} customSpacing={null}>
  //         <Box w='full' maxW='640px'>
  //           <Box mb={4}>{user.email} 様</Box>
  //           {Subscription_Detail.pause_collection.resumes_at ?
  //             <Box mb={6}>サブスクリプションは、{Subscription_Detail.pause_collection.resumes_at}に再開されます。</Box> :
  //             <Box mb={6}>サブスクリプションは、現在停止中です。次のボタンから再開することができます。</Box>}
  //           {isPermanentSubscription(Subscription_Detail) && <Grid templateColumns={{ base: '1fr', md: '160px auto' }} gap={2} mb={8}>
  //             <Box>永久ご視聴</Box>
  //             <Box>○</Box>
  //           </Grid>}
  //           <CustomerPortalButton />
  //         </Box>
  //       </PageShell>
  //     )
  //   }
  //   // サブスクリプション status が incomplete / incomplete_expired / incomplete_expired / past_due の場合
  //   if (!isLoading && !isMetadataLoading &&
  //     (Subscription_Detail && subscription_state === 'paused' && !Subscription_Detail.pause_collection && !One_Pay_Detail)) {
  //     return (
  //       <PageShell customPT={null} customSpacing={null}>
  //         <Box w='full' maxW='640px'>
  //           <Box mb={4}>{user.email} 様</Box>
  //           <CustomerPortalButton />
  //         </Box>
  //       </PageShell>
  //     )
  //   }

  //   // サインアップ後、サブスクリプション・ワンペイ永久ご視聴ともに未購入
  //   if (!isLoading && !isMetadataLoading && !Subscription_Detail && !One_Pay_Detail && !temporaryPaidCheck) {
  //     return (
  //       <PageShell customPT={null} customSpacing={null}>
  //         <Box>
  //           <Text mb={10}>ご購入ボタンからサブスクリプションやワンペイ永久ご視聴プランを開始することができます。</Text>
  //           <PriceList user={user} allPrices={allPrices} annotation={annotation} isOnePayPermanent={false} />
  //         </Box>
  //       </PageShell>)
  //   }

  //   // サブスクリプション、ワンペイ永久ご視聴の情報もないが、購入成功のリターンURLの場合
  //   if (!isLoading && !isMetadataLoading && !Subscription_Detail && !One_Pay_Detail && temporaryPaidCheck) {
  //     return (
  //       <PageShell customPT={null} customSpacing={null}>
  //         <Box w='full' maxW='640px'>
  //           <Box mb={8}>{user.email} 様</Box>
  //           <Box border='1px' borderColor={indexBgColor} borderRadius={12} mb={16} pt={2} pb={4} bg={bgColor}>
  //             <Table variant="striped" colorScheme="gray" size={tableSize} whiteSpace='pre-wrap'>
  //               <TableCaption placement='top' mt={0} mb={2}>プラン詳細</TableCaption>
  //               <Tbody><Tr><Td>状態</Td><Td>一時的に購入情報が取得できなくなっております。</Td></Tr></Tbody>
  //             </Table>
  //           </Box>
  //           <CustomerPortalButton />
  //         </Box>
  //       </PageShell>)
  //   }

  //   return <LoadingSpinner />
  // }
}
export const getStaticProps: GetStaticProps = async () => {
  // get Subscription Plans from Stripe
  const { archiveAppApplyCollection: { items } } = await fetchContentful(query_applyText) // This is for fetching Annotation under the price list
  const applyText = items[0].applyText
  const allPrices = await fetchAllPrices()

  return {
    props: { applyText, allPrices: [...allPrices], },
    revalidate: 1
  }
}