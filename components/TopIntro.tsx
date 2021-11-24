import { Box, Stack, Text, Link } from '@chakra-ui/react';
import Image from 'next/image'
import NextLink from 'next/link';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { highlight_color } from '@/styles/colorModeValue';
import VideoVimeoLT from '@/components/VideoVimeoLT';
import { useRouter } from 'next/router';

export default function TopIntro() {
    const { locale } = useRouter()
    return (
        <VideoVimeoLT vimeoId={locale === 'en' ? '529040008' : '529040008'} aspect={null} autoplay={false} borderRadius={12} />
    )
}