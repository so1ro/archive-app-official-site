import { Heading, Text, Container } from "@chakra-ui/react"
import { useRouter } from "next/router"
import CondtionList from "@/components/CondtionList"

export default function Condition({ condition }: { condition?: topConditionText }) {

	const router = useRouter()
	const { locale } = router
	const isHavingContent = (array) => array.length > 0
	const fontSize = ['md', 'md', 'lg']

	return (
		<Container maxW='800px' px={0}>
			{/* Title */}
			<Text fontWeight='semibold' as='h4' mb={24} fontSize={['lg', 'lg', 'xl']}>{condition.title[locale]}</Text>
			{/* Principal */}
			{isHavingContent(condition.principal[locale]) && <Text fontSize={fontSize}>{condition.principal.copy[locale]}</Text>}
			{isHavingContent(condition.principal[locale]) && <CondtionList condition={condition.principal[locale]} />}
			{/* Plan.1 */}
			{isHavingContent(condition.plan01[locale]) && <Text fontSize={fontSize}>{condition.plan01.copy[locale]}</Text>}
			{isHavingContent(condition.plan01[locale]) && <CondtionList condition={condition.plan01[locale]} />}
			{/* Plan.2 */}
			{isHavingContent(condition.plan02[locale]) && <Text fontSize={fontSize}>{condition.plan02.copy[locale]}</Text>}
			{isHavingContent(condition.plan02[locale]) && <CondtionList condition={condition.plan02[locale]} />}
		</Container>
	)
}