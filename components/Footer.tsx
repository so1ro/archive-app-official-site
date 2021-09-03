import React from 'react'
import { Flex, VStack, Text, useColorMode, Link } from '@chakra-ui/react'
import { bg_color, text_BW } from '@/styles/colorModeValue'
import SnsIcons from '@/components/SnsIcons'
import NavLinks from '@/components/NavLinks'
import NextLink from 'next/link'

const date = new Date()
const year = date.getFullYear()

export default function Footer() {

    const { colorMode } = useColorMode()

    return (
        <Flex
            direction={{ base: "column", lg: "row" }}
            align={{ base: "center", lg: "flex-start" }}
            justify='space-between'
            bg={bg_color}
            color={text_BW}
            p={{ base: 4, lg: 9 }}
            borderTop={colorMode === 'dark' ? `1px #2F4351 solid` : 0}>
            <VStack spacing={1} align={{ base: "center", lg: "flex-start" }} order={{ base: 2, lg: 1 }}>
                <NextLink href={'/'} passHref><Link><Text as="h1" fontSize={["2xl", "2xl", "3xl"]} className='logo' isTruncated>Archive app</Text></Link></NextLink>
                <Text fontSize="xs">&#xA9; {year} Archive app All rights reserved.</Text>
            </VStack>
            <VStack mb={{ base: 4, lg: 0 }} spacing={3} align={{ base: "center", lg: "flex-end" }} order={{ base: 1, lg: 2 }}>
                {/* <NavLinks /> */}
                <SnsIcons animation={false} type={'footer'} onHandler={null} />
            </VStack>
        </Flex >
    )
}