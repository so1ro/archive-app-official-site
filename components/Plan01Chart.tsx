import { Box, Flex, Grid, Text, useColorModeValue, } from "@chakra-ui/react"
import { useMediaQuery } from '@/utils/useMediaQuery'
import { revenue_green_color, text_highlight_color } from "@/styles/colorModeValue"

export default function Plan01Chart({ chartText }) {

	const isLargerThan600 = useMediaQuery("(min-width: 600px)")
	const listTitleW = '160px'
	const fontSize = ['xs', 'sm']
	const bgColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)
	const green = useColorModeValue(revenue_green_color.l, revenue_green_color.d)

	return (
		<Box mt={24}>
			<Text textAlign='center' mb={{ base: 6, sm: 10 }}>{chartText.title}</Text>
			<Grid columnGap={0} rowGap={6} templateColumns={isLargerThan600 ? `${listTitleW} 1fr` : '1fr'} mb={isLargerThan600 ? 6 : 12}>
				<Box alignSelf='end'>{chartText.publishNameClassic}</Box>
				<Flex align='flex-end' mb={2}>
					<Box w='10%' ><Text fontSize={fontSize} mb={1} textAlign='center'>{chartText.you}</Text><Box h='6px' bgColor={bgColor} /></Box>
					<Box w='30%' ><Text fontSize={fontSize} mb={1} textAlign='center'>{chartText.publisher}</Text><Box h='6px' bgColor='#9E9D9B' /></Box>
					<Box w='30%' ><Text fontSize={fontSize} mb={1} textAlign='center'>{chartText.distributor}</Text><Box h='6px' bgColor='#605C58' /></Box>
					<Box flexGrow={1} ><Text fontSize={fontSize} mb={1} textAlign='center'>{chartText.store}</Text><Box h='6px' bgColor='#9E9D9B' /></Box>
				</Flex>
			</Grid>
			<Grid columnGap={0} rowGap={6} templateColumns={isLargerThan600 ? `${listTitleW} 1fr` : '1fr'} mb={12}>
				<Box alignSelf='end'>{chartText.publishNameModern}</Box>
				<Flex align='flex-end' mb={2}>
					<Box w='90%' ><Text fontSize={fontSize} mb={1} textAlign='center'>{chartText.you}</Text><Box h='6px' bgColor={bgColor} /></Box>
					<Box flexGrow={1} ><Text fontSize={fontSize} mb={1} textAlign='center'>*</Text><Box h='6px' bgColor={green} /></Box>
				</Flex>
			</Grid>
			<Box textAlign='right' fontSize='xs'>{chartText.annotation}</Box>
		</Box>
	)
}