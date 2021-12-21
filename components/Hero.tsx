import { useRouter } from 'next/router'
import { Box, Container, useColorMode } from '@chakra-ui/react'
import SlickSlider from '@/components/SlickSlider'
import { useMediaQuery } from '@/utils/useMediaQuery'
import { HeroWaveD, HeroWaveL } from '@/styles/icons'

export default function Hero({ heroText, heroImages }) {

    const router = useRouter()
    const { locale } = router
    const { colorMode } = useColorMode()
    const isLargerThan1280 = useMediaQuery("(min-width: 1280px)")
    const height = { base: '80vh', md: '56vh', lg: '72vh' }

    return (
        <Box
            pos='relative' overflow='hidden'
            bg={`linear-gradient(180deg, rgba(255,255,255,0) ${colorMode === 'light' ? '60%' : '70%'}, rgba(${colorMode === 'light' ? '246,153,87' : '255,255,255'}, 0.48) 100%)`} h={height}>
            <Box as='h2'
                d={{ base: 'none', md: 'block' }}
                fontSize={{ base: '48px', lg: '64px', '2xl': '72px' }}
                fontWeight='semibold' textAlign={'left'}
                whiteSpace='pre-wrap'
                pos='absolute'
                top='50%'
                left={locale === 'en' ? '8%' : '12%'}
                transform='translateY(-60%)'
            >
                {heroText}
            </Box>
            {/* <Box as='h2'
                m='0 auto' maxW="1200px"
                d={{ base: 'none', md: 'block' }}
                fontSize={{ base: 'xl', sm: '3xl', md: '48px', lg: '64px', '2xl': '72px' }}
                fontWeight='semibold' textAlign={{ base: 'center', md: 'left' }}
                whiteSpace='pre-wrap'
                pb='160px' pl={{ base: 0, md: (!isLargerThan1280 ? 20 : 0) }}>
                {heroText}
            </Box> */}
            <SlickSlider imgs={heroImages} h={height} />
            <Box pos='absolute' bottom={0} w='full' h='84px' minW='1440px' >
                {colorMode === 'light' && <HeroWaveL w='full' p='absolute' />}
                {colorMode === 'dark' && <HeroWaveD w='full' p='absolute' />}
            </Box>
        </Box >
    )
}

