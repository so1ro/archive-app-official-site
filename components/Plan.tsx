import { highlight_color, text_color } from "@/styles/colorModeValue"
import { Box, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react"

export default function Plan({ badge, title, text }: { badge?: string, title?: string, text?: string }) {
	return (
		<Box>
			<Stack direction='row' spacing={5} mb={8}>
				<Flex
					bgColor={useColorModeValue(highlight_color.d, highlight_color.l)}
					borderRadius={6}
					px={4} py={0}
					fontSize='xs'
					align='center'
					color={useColorModeValue(text_color.d, text_color.l)}>{badge}</Flex>
				<Box fontSize='lg' fontWeight='bold'>{title}</Box>
			</Stack>
			<Text lineHeight={8} fontFamily='NotoSerifJP-Medium-Alphabetic'>{text}</Text>
		</Box>
	)
}