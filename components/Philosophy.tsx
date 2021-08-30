import { bg_color_content, highlight_color, text_color } from "@/styles/colorModeValue"
import { List, ListItem, ListIcon, OrderedList, UnorderedList, useColorModeValue } from "@chakra-ui/react"
import { useMediaQuery } from '@/utils/useMediaQuery'

export default function Philosophy({ text }: { text?: string[] }) {
	const isLargerThan768 = useMediaQuery("(min-width: 768px)")
	const regex = new RegExp(/\n/, 'gi')
	const newLineText = isLargerThan768 ? text.map(t => t.replace(regex, '')) : text

	return (
		<UnorderedList
			px={6} py={12} spacing={5}
			listStyleType='none'
			textAlign='center'
			fontSize={['md', 'xl', '2xl']}
			bgColor={useColorModeValue(bg_color_content.l, bg_color_content.d)}
			marginInlineStart='none'
			whiteSpace='pre-wrap'>
			{newLineText.map((p, i) => <ListItem key={i} fontWeight='bold'>{p}</ListItem>)}
		</UnorderedList>
	)
}