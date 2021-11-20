import { Box, Container, useColorMode } from '@chakra-ui/react'
import Image from 'next/image'
import HeroSnsIcons from '@/components/HeroSnsIcons'
import HeroArchiveLink from '@/components/HeroArchiveLink'
import { useWindowSizeOrientation } from '@/utils/useWindowSize'
import { useMediaQuery } from '@/utils/useMediaQuery'
import { HeroWaveD, HeroWaveL } from '@/styles/icons'

export default function Hero({ heroText }) {

    const { colorMode } = useColorMode()
    const isLargerThan1280 = useMediaQuery("(min-width: 1280px)")

    return (
        <Box pt={{ base: '80px', md: '160px' }}
            pos='relative' overflow='hidden'
            bg={`linear-gradient(180deg, rgba(255,255,255,0) ${colorMode === 'light' ? '60%' : '70%'}, rgba(${colorMode === 'light' ? '246,153,87' : '255,255,255'}, 0.24) 100%)`}>
            <Box as='h2'
                m='0 auto' maxW="1200px"
                d={{ base: 'none', md: 'block' }}
                fontSize={{ base: 'xl', sm: '3xl', md: '48px', lg: '64px', '2xl': '72px' }}
                fontWeight='semibold' textAlign={{ base: 'center', md: 'left' }}
                whiteSpace='pre-wrap'
                pb='160px' pl={{ base: 0, md: (!isLargerThan1280 ? 20 : 0) }}>
                {heroText}
            </Box>
            <Box pos='absolute' bottom={0} w='full' h='84px' minW='1440px' >
                {colorMode === 'light' && <HeroWaveL w='full' p='absolute' />}
                {colorMode === 'dark' && <HeroWaveD w='full' p='absolute' />}
            </Box>
        </Box >
    )
}

