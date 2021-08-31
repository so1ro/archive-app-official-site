import { text_color, highlight_color, text_highlight_color } from "@/styles/colorModeValue"
import { Box, Button, Flex, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { useMediaQuery } from '@/utils/useMediaQuery'

export default function SigninApplyButton({ buttonText, annotation }: { buttonText?: string, annotation?: string }) {

	const isLargerThan600 = useMediaQuery("(min-width: 600px)")
	const textColor = useColorModeValue(text_color.d, text_color.l)
	const buttonColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const annotationColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)

	return (
		<VStack align='center' spacing={6} py={12}>
			<Box px={{ base: 10, sm: 12, lg: 16 }} py={{ base: 3, lg: 4 }} borderRadius={{ base: 12, lg: 16 }} fontSize={{ base: 20, lg: 24 }} fontWeight='semibold' textAlign='center' color={textColor} bgColor={buttonColor}>{buttonText}</Box>
			<Text fontSize={['sm', 'sm', 'md']} color={annotationColor}>{annotation}</Text>
		</VStack>
	)
}