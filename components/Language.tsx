import { highlight_color, text_color } from "@/styles/colorModeValue"
import { Select } from "@chakra-ui/react"
import { upperCase } from "lodash";
import { useRouter } from 'next/router';

export default function Language({ }: {}) {
	const router = useRouter()
	const { route, locale } = router
	const handleLanguage = (e) => {
		const locale = e.target.value
		router.push(route, route, { locale })
	}

	return (
		<Select
			onChange={handleLanguage}
			d={{ base: 'none', sm: 'inline-block' }}
			placeholder={upperCase(locale)} w='none' border='0'
			style={{ paddingInlineStart: '0' }}>
			{locale !== 'en' && <option value="en">EN</option>}
			{locale !== 'ja' && <option value="ja">JA</option>}
		</Select>
	)
}