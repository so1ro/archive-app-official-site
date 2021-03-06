import { bg_color_content, highlight_color, text_color } from "@/styles/colorModeValue"
import { List, ListItem, ListIcon, OrderedList, UnorderedList, useColorModeValue } from "@chakra-ui/react"
import { useMediaQuery } from '@/utils/useMediaQuery'

export default function Philosophy({ text }: { text?: string[] }) {
	const isLargerThan768 = useMediaQuery("(min-width: 768px)")
	const regex = new RegExp(/\n/, 'gi')
	const newLineText = isLargerThan768 ? text.map(t => t.replace(regex, '')) : text
	const commonPd = { base: 6, md: 12, lg: 24 }

	return (
		<UnorderedList
			px={6} pt={commonPd} pb={commonPd} spacing={5}
			listStyleType='none'
			textAlign='center'
			fontSize={['md', 'xl', '2xl']}
			bgColor={useColorModeValue(bg_color_content.l, bg_color_content.d)}
			marginInlineStart='none'
			whiteSpace='pre-wrap'>
			{newLineText.map((p, i) => <ListItem key={i} d={i === 1 ? { base: 'none', md: 'block' } : i === 0 ? { base: 'block', md: 'none' } : 'block'} fontWeight='bold' as='h3'>{p}</ListItem>)}
		</UnorderedList>
	)
}