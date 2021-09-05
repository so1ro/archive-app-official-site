import { useField } from 'formik'
import { Select, HStack, VStack, Input, Textarea, Text, useColorModeValue, Button, useToast } from '@chakra-ui/react'
import { text_highlight_color, text_color } from '@/styles/colorModeValue'
import { useRouter } from 'next/router'

const form_parts_spacing = 16
const form_label_mr = 4
const form_label_mb = 2

export const FormikInput = ({ label, ...props }) => {

	const [field, meta] = useField(props)
	const highlightColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)

	return (
		<VStack spacing={form_label_mb} alignItems='flex-start' mb={form_parts_spacing}>
			<HStack spacing={form_label_mr}>
				<label htmlFor={props.id || props.name}>{label}</label>
				{meta.touched && meta.error ? (
					<Text color={highlightColor} fontSize='sm'>{meta.error}</Text>
				) : null}
			</HStack>
			<Input className="text-input" {...field} {...props} />
		</VStack>
	)
}

export const FormikTextArea = ({ label, ...props }) => {

	const [field, meta] = useField(props)
	const highlightColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)

	return (
		<VStack spacing={form_label_mb} alignItems='flex-start' mb={form_parts_spacing}>
			<HStack spacing={form_label_mr}>
				<label htmlFor={props.id || props.name}>{label}</label>
				{meta.touched && meta.error ? (
					<Text as='span' color={highlightColor} fontSize='sm'>{meta.error}</Text>
				) : null}
			</HStack>
			{/* <textarea className="text-input" {...field} {...props} whiteSpace='pre-wrap' /> */}
			<Textarea {...field} {...props} />
		</VStack>
	)
}


export const FormikSelect = ({ label, ...props }) => {

	const [field, meta] = useField(props)
	const textColor = useColorModeValue(text_color.l, text_color.d)
	const highlightColor = useColorModeValue(text_highlight_color.l, text_highlight_color.d)
	const { locale } = useRouter()

	return (
		<VStack spacing={form_label_mb} alignItems='flex-start' mb={form_parts_spacing}>
			<HStack spacing={form_label_mr}>
				<label htmlFor={props.id || props.name}>{label}</label>
				{meta.touched && meta.error ? (
					<Text as='span' color={highlightColor} fontSize='sm'>{meta.error}</Text>
				) : null}
			</HStack>
			<Select
				{...field} {...props}
				d={{ base: 'none', sm: 'inline-block' }}
				placeholder={locale === 'en' ? 'Please choose your plan' : 'ご検討中のプランをお選びください。'} w='none'
				borderColor="gray.500"
				borderRadius={4}>
			</Select>
			{/* <select {...field} {...props}
				style={{
					background: 'none',
					border: `solid 1px ${textColor}`,
					borderRadius: '0.3rem',
					padding: '6px 10px',
					paddingInlineEnd: '2rem'
				}} /> */}
		</VStack >
	)
}


export const FormikSubmitButton = ({ errors, touched }) => {
	return (
		<Button
			type="submit"
			colorScheme='green'
			disabled={!!Object.keys(errors).length || !Object.keys(touched).length}>Submit</Button>
	)
}