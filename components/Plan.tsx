import { highlight_color, text_color } from "@/styles/colorModeValue"
import { Box, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { useMediaQuery } from '@/utils/useMediaQuery'

export default function Plan({ badge, title, text }: { badge?: string, title?: string, text?: string }) {

	const isLargerThan600 = useMediaQuery("(min-width: 600px)")

	return (
		<Box>
			<Stack direction={isLargerThan600 ? 'row' : 'column'} spacing={isLargerThan600 ? 6 : 2} mb={8}>
				<Flex
					bgColor={useColorModeValue(highlight_color.l, highlight_color.d)}
					borderRadius={6}
					px={4} py={0}
					fontSize={['sm', 'sm', 'md']}
					fontWeight='semibold'
					align='center'
					color={useColorModeValue(text_color.d, text_color.l)}
					w='fit-content'>
					{badge}
				</Flex>
				<Box fontSize={['xl', 'xl', '2xl']} fontWeight='bold' as='h3'>{title}</Box>
			</Stack>
			<Text lineHeight={8} fontSize={['md', 'md', 'lg']} fontWeight='normal'>{text}</Text>
		</Box>
	)
}