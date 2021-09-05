import Router from 'next/router'
import { useState } from "react"
import * as Yup from "yup"
import { Formik, Form, } from 'formik'
import { FormikInput, FormikSelect, FormikSubmitButton, FormikTextArea } from '@/components/Formik/Fields'
import { useRouter } from 'next/router'

import { useColorModeValue } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/toast"
import { Toast, ToastError } from '@/components/Toast'
import { highlight_color } from '@/styles/colorModeValue'

export default function ApplyForm(props) {

	const [response, setResponse] = useState({ type: '', message: '', })
	const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const toast = useToast()
	const { locale } = useRouter()

	// // Function
	const handleSubmit = async (values) => {

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify(values),
				headers: { 'Content-Type': 'application/json' },
			})
			const json = await res.json()

			if (json.success) {
				//成功したらsuccessページに飛ぶ
				Router.push('/contact_success')
			} else {
				setResponse({
					type: 'error',
					message: '送信中にエラーが発生しました。',
				})
				toast({
					status: 'error',
					isClosable: true,
					duration: 9000,
					render: () => (<ToastError text={"送信中にエラーが発生しました。"} />)
				})
			}

		} catch (e) {
			setResponse({
				type: 'error',
				message: 'メッセージは送信されませんでした。',
			})
			toast({
				status: 'error',
				isClosable: true,
				duration: 9000,
				render: () => (<ToastError text={"メッセージは送信されませんでした。"} />)
			})
		}
	}

	return (
		<>
			<Formik
				initialValues={{
					name: '',
					email: '',
					message: '',
					plan: '',
				}}
				validationSchema={Yup.object({
					name: Yup.string()
						.max(15, 'Must be 15 characters or less')
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					message: Yup.string()
						.max(2000, 'Must be 2000 characters or less')
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					plan: Yup.string()
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					email: Yup.string()
						.email(`${locale === 'en' ? '* Invalid email address' : '※ 有効なメールアドレスをご記入ください。'}`)
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),

				})}
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						handleSubmit(values)
						setSubmitting(false)
					}, 400)
				}}>

				{({ errors, touched }) => (
					<Form style={{ width: '100%' }}>
						<FormikInput label={locale === 'en' ? 'Name' : 'お名前'} name="name" type="text" mb={3} variant="flushed"
							borderColor='gray.500'
							focusBorderColor={highlightColor} />
						<FormikInput label={locale === 'en' ? 'Email address' : 'メールアドレス'} name="email" type="text" mb={3} variant="flushed"
							borderColor='gray.500'
							focusBorderColor={highlightColor} />
						<FormikTextArea label={locale === 'en' ? 'Message' : 'メッセージ'} name="message" whiteSpace='pre-wrap'
							px={6} py={4} mb={3}
							size="xl" rows={10}
							borderColor='gray.500'
							focusBorderColor={highlightColor}
							borderRadius={4}
							lineHeight={1.6} />
						<FormikSelect label={locale === 'en' ? 'Plan' : 'プラン'} name="plan">
							<option value="Plan_1">Plan.1 (Archive with Subscription)</option>
							<option value="Plan_2">Plan.2 (Archive without Subscription)</option>
						</FormikSelect>
						<FormikSubmitButton errors={errors} touched={touched} />
					</Form>
				)}

			</Formik>
		</>
	)
}