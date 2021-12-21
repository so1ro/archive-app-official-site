import { ListItem, OrderedList } from "@chakra-ui/react"

export default function CondtionList({ condition }) {
	return (
		<OrderedList
			px={6} pt={7} pb={24} spacing={5}
			textAlign='left'
			fontSize={['sm', 'sm', 'md']}
			marginInlineStart='none'
			whiteSpace='pre-wrap'>
			{condition.map((t, i) => (
				<ListItem key={i} fontWeight='medium'>{t}</ListItem>
			))}
		</OrderedList>
	)
}