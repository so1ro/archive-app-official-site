import { Box, Stack, Text, Link } from '@chakra-ui/react';
import Image from 'next/image'
import NextLink from 'next/link';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { highlight_color } from '@/styles/colorModeValue';
import VideoVimeoLT from '@/components/VideoVimeoLT';

export default function TopIntro() {
    const avatarSize = { base: 36, lg: 48 }
    return (
        <VideoVimeoLT vimeoId={'529040008'} aspect={null} autoplay={false} borderRadius={12} />
    )
}