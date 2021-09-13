import { useRouter } from 'next/router'
import { Box, Button, HStack, Link, Text, useBreakpointValue, useColorMode, useToast, useColorModeValue } from '@chakra-ui/react'
import { highlight_color, text_color, text_highlight_color } from '@/styles/colorModeValue'
import { Toast } from '@/components/Toast'

export default function UserLoginSignup() {

    const textColor = useColorModeValue(text_color.d, text_color.l)
    const highlighColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)
    const bgColor = useColorModeValue(highlight_color.l, highlight_color.d)
    const buttonSize = useBreakpointValue({ base: 'xs', md: 'sm' })
    const { colorMode } = useColorMode()
    const toast = useToast()
    const router = useRouter()
    const { locale } = router

    return (
        <>
            <HStack align="center" spacing={[2, 2, 3]}>
                <Link fontSize={["10px", "11px"]}
                    href="/api/auth/login?param=signup"
                    lineHeight='14px'
                    textAlign={locale === 'en' ? 'right' : 'left'}
                    alignSelf={locale === 'en' ? 'flex-end' : 'center'}
                    onClick={() => {
                        toast({ duration: 3000, render: () => (<Toast text={"サインアップに移動中..."} />) })
                    }}>
                    <Text color={locale === 'en' ? highlighColor : ''}>{locale === 'en' ? 'Sign in' : '初めての方は'}</Text>
                    <Text color={locale === 'en' ? '' : highlighColor}>{locale === 'en' ? 'or' : 'サインアップ'}</Text>
                </Link>
                <Link href="/api/auth/login">
                    <Button
                        size={buttonSize}
                        w={{ base: '66px', sm: '80px', md: '100px' }}
                        fontWeight='md' color={textColor}
                        bg={bgColor} border="1px"
                        _hover={{ bg: bgColor }}
                        onClick={() => { toast({ duration: 3000, render: () => (<Toast text={"ログインに移動中..."} />) }) }}>
                        {locale === 'en' ? 'Login' : 'ログイン'}
                    </Button>
                </Link>
            </HStack>
        </>
    )
}