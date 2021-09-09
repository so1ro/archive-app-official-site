import PageShell from "@/components/PageShell"
import { text_highlight_color } from "@/styles/colorModeValue"
import { VStack, Center, Text, useColorModeValue } from "@chakra-ui/react"
import Router from 'next/router'

const Success = () => {
	const highlightColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)

	return (
		<PageShell customPT={null} customSpacing={null}>
			<VStack spacing={12} align='flex-start'>
				<Text>メールが送信されました。<br /> お返事いたしますので、少々お待ち下さい。</Text>
				<Text color={highlightColor} onClick={() => { Router.push('/') }}>トップページに戻る</Text>
			</VStack>
		</PageShell>
	)
}

export default Success