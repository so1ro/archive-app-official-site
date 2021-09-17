import PageShell from "@/components/PageShell"
import { text_highlight_color } from "@/styles/colorModeValue"
import { VStack, Center, Text, useColorModeValue } from "@chakra-ui/react"
import Router from 'next/router'
import { useRouter } from 'next/router'

const Success = () => {

	const { locale } = useRouter()
	const highlightColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)

	return (
		<PageShell customPT={null} customSpacing={null}>
			<VStack spacing={12} align='flex-start'>
				<Text whiteSpace='pre-wrap'>
					{locale === 'en' ?
						'Your message was sent. Please wait for our reply.' :
						'メールが送信されました。\nお返事いたしますので、少々お待ち下さい。'}
				</Text>
				<Text cursor='pointer' color={highlightColor} onClick={() => { Router.push('/') }}>
					{locale === 'en' ? 'Back to Top page.' : 'トップページに戻る'}
				</Text>
			</VStack>
		</PageShell>
	)
}

export default Success