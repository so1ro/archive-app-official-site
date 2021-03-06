import { useRouter } from 'next/router'

import { postData } from '@/utils/helpers'
import { getStripe } from '@/utils/stripe-client'

import { Grid, Box, VStack, Text, HStack, useToast, Center, useColorMode, useColorModeValue, Flex, Link } from '@chakra-ui/react'
import { MotionButton, MotionLink } from '@/components/Chakra_Framer/element'
import { price_card_color, highlight_color } from '@/styles/colorModeValue'
import { Toast } from '@/components/Toast'

export default function PriceList({ user, allPrices, annotation, isOnePayPermanent }) {

    const toast = useToast()
    const { locale } = useRouter()
    const { colorMode } = useColorMode()
    const priceCardColor = useColorModeValue(price_card_color.l, price_card_color.d)
    const oneTimeCardColor = '#e63946'
    const cardBorder = colorMode === 'light' ? '1px' : '0px'
    const highlighColor = useColorModeValue(highlight_color.l, highlight_color.d)
    // const criteriaOnePayPrice = allPrices.find(price => price.type === 'one_time').unit_amount

    const currency = locale === 'en' ? 'usd' : 'jpy'
    const allFilteredPrices = allPrices.filter(price => price.currency === currency)

    const handleCheckout = async (price, type) => {
        // setPriceIdLoading(price.id)
        try {
            const { sessionId } = await postData({
                url: '/api/stripe/create-checkout-session',
                data: {
                    price,
                    type,
                    user_uuid: user.sub,
                    user_email: user.email,
                    lang: locale === 'en' ? 'en' : 'ja',
                    // criteriaOnePayPrice
                }
                // token: session.access_token
            })

            const stripe = await getStripe()
            stripe.redirectToCheckout({ sessionId })
        } catch (e) {
            return console.error(e.message)
        } finally {
            // setPriceIdLoading(false)
        }
    }

    // Compo in Compo
    const SignupPurchaseButton = ({ price }) => {

        const ConditionalButton = () => {
            return (
                <MotionButton
                    borderRadius='full'
                    bg={price.type === "recurring" ? priceCardColor : oneTimeCardColor}
                    px={{ base: 4, md: 6 }}
                    py={2}
                    color='#fff'
                    fontSize={{ base: 'sm', lg: 'md' }}
                    fontWeight='normal'
                    _hover={{ bg: price.type === "recurring" ? priceCardColor : oneTimeCardColor }}
                    _active={{ bg: price.type === "recurring" ? priceCardColor : oneTimeCardColor }}
                    // Framer //
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                        toast({
                            duration: 3000,
                            render: () => (<Toast text={user ?
                                (locale === 'en' ? 'Moving to Checkout...' : '????????????????????????????????????????????????...') :
                                (locale === 'en' ? 'Moving to Sign in...' : '???????????????????????????...')} />)
                        })
                        if (user) handleCheckout(price.id, price.type)
                    }}>
                    {user ?
                        (locale === 'en' ? 'Subscribe' : '??????') :
                        (locale === 'en' ? 'Sign in' : '????????????????????????')}
                </MotionButton>
            )
        }

        if (user) return <ConditionalButton />
        return (
            <Link
                href="/api/auth/login?param=signup"
                color={highlighColor}
                fontSize={["10px", "11px"]}>
                <ConditionalButton />
            </Link>
        )
    }

    return (
        <Box>
            <Grid
                gap={3} gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} mb={3}
                d={allFilteredPrices.length === 1 ? 'block' : 'grid'} maxW={allFilteredPrices.length === 1 ? '360px' : ''}
                margin={allFilteredPrices.length === 1 ? '0 auto' : '0'}>
                {allFilteredPrices.map(price => (
                    <Flex
                        direction='column'
                        key={price.id}
                        color="gray.600" // pending
                        bg='#fff'
                        border={cardBorder}
                        borderTop='8px'
                        borderColor={price.type === "recurring" ? priceCardColor : oneTimeCardColor}
                        borderRadius={14}
                        align='center'
                        d={price.type !== "recurring" && isOnePayPermanent ? 'none' : 'flex'}
                    >
                        <HStack spacing={1} align='baseline' py={{ base: 2, md: 4 }}>
                            {locale === 'en' && <Text fontSize={{ base: '2xl' }}>$</Text>}
                            <Text letterSpacing='-1px' fontSize={{ base: '3xl', lg: '4xl' }}>
                                {locale === 'en' ? (price.unit_amount / 100).toFixed(2) : price.unit_amount}
                            </Text>
                            <Text>{
                                price.type === "recurring" ?
                                    (locale === 'en' ? '/ month' : '?????????') :
                                    (locale === 'en' ? '' : '???')
                            }</Text>
                        </HStack>
                        <Center fontSize='xs' py={0} color='#fff' w='full' bg={price.type === "recurring" ? priceCardColor : oneTimeCardColor}>
                            {locale === 'en' ? 'Subscription' : '???????????????????????????'}
                            {/* {price.type === "recurring" ? '???????????????????????????' : '???????????????????????????'} */}
                        </Center>
                        <Box px={6} py={6} flexGrow={1}>{price.nickname}</Box>
                        <Box pb={6}><SignupPurchaseButton price={price} /></Box>
                    </Flex>
                ))}
            </Grid>
            {!isOnePayPermanent && <Text fontSize={{ base: 'xs', md: 'sm' }} color={useColorModeValue(highlight_color.l, highlight_color.d)}>{annotation}</Text>}
        </Box>
    )
}
