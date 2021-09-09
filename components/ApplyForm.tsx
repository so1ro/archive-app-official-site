import Router from 'next/router'
// import { useState } from "react"
import * as Yup from "yup"
import { Formik, Form, } from 'formik'
import { FormikInput, FormikSelect, FormikSubmitButton, FormikTextArea } from '@/components/Formik/Fields'
import { useRouter } from 'next/router'

import { useColorModeValue } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/toast"
import { Toast, ToastError } from '@/components/Toast'
import { highlight_color, text_color } from '@/styles/colorModeValue'

export default function ApplyForm({ applyText, userEmail, auth0_UUID }) {

	// const [response, setResponse] = useState({ type: '', message: '', })
	const highlightColor = useColorModeValue(highlight_color.l, highlight_color.d)
	const blurTextColor = useColorModeValue(text_color.l, text_color.d)
	const toast = useToast()
	const { locale } = useRouter()

	// Function
	const handleSubmit = async (values) => {

		try {
			toast({ duration: 6000, render: () => (<Toast text={locale === 'en' ? "Sending your application..." : "申請を送信中..."} />) })
			// api/contact
			const res = await fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify(values),
				headers: { 'Content-Type': 'application/json' },
			})
			const json = await res.json()

			// api/auth/upsert-user-metadata
			const sendBody = {
				auth0_UUID,
				meta: { isApplied: true, plan: values.plan }
			}
			await fetch('/api/auth/upsert-user-metadata', {
				method: 'POST',
				body: JSON.stringify(sendBody),
				headers: { 'Content-Type': 'application/json' },
			})

			if (json.success) {
				//成功したらsuccessページに飛ぶ
				Router.reload()
				// Router.push('/contact_success')
			} else {
				toast({
					status: 'error',
					isClosable: true,
					duration: 9000,
					render: () => (<ToastError text={"送信中にエラーが発生しました。"} />)
				})
			}

		} catch (e) {
			toast({
				status: 'error',
				isClosable: true,
				duration: null,
				render: () => (<ToastError
					text={
						locale === 'en' ?
							'ネットワーク障害で申請が完了しませんでした。お手数をおかけして申し訳ございません。迅速に対応いたしますので、次のアドレスまでご連絡ください。masamichi.kagaya.ap+archive-app-official@gmail.com' :
							'Your application was not completed. Could you please send an email to the following email address. We will instantly process it. masamichi.kagaya.ap+archive-app-official@gmail.com'
					} />)
			})
		}
	}

	return (
		<>
			<Formik
				initialValues={{
					name: '',
					email: userEmail,
					plan: '',
					snsIntegration: '',
					snsURL: '',
					followerNumber: '',
					type: '',
					message: '',
				}}
				validationSchema={Yup.object({
					name: Yup.string()
						.max(30, 'Must be 30 characters or less')
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					// email: Yup.string()
					// 	.email(`${locale === 'en' ? '* Invalid email address' : '※ 有効なメールアドレスをご記入ください。'}`)
					// 	.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					plan: Yup.string()
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					snsIntegration: Yup.string()
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					snsURL: Yup.string()
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					followerNumber: Yup.number()
						.positive(`${locale === 'en' ? '* Please enter positive number.' : '※ 正の整数をご入力ください。'}`)
						.integer()
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					type: Yup.string()
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
					message: Yup.string()
						.max(2000, 'Must be 2000 characters or less')
						.required(`${locale === 'en' ? '* Required' : '※ 必須項目です。'}`),
				})}
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						handleSubmit(values)
						setSubmitting(false)
					}, 400)
				}}>

				{({ errors, touched }) => (
					<Form>
						<FormikInput label={locale === 'en' ? 'Name (Author name)' : 'お名前（作家名）'}
							name="name" type="text" mb={3} variant="flushed" borderColor='gray.500'
							focusBorderColor={highlightColor} />
						<FormikInput label={locale === 'en' ? 'Email address' : 'メールアドレス'}
							name="email" type="text"
							mb={3} variant="unstyled"
							color={blurTextColor}
							borderBottom='1px solid' borderRadius={0} pb={2} borderColor='gray.500'
							value={userEmail} isReadOnly />
						<FormikSelect label={locale === 'en' ? 'Plan' : 'プラン'} name="plan">
							{applyText.plan[locale].map(plan => <option value={plan.value} key={plan.value}>{plan.text}</option>)}
						</FormikSelect>
						<FormikSelect label={locale === 'en' ? 'Do you want SNS integration?' : 'SNSの統合もご希望ですか?'} name="snsIntegration">
							{<option value={'yes'}>{locale === 'en' ? 'Yes' : 'はい'}</option>}
							{<option value={'no'}>{locale === 'en' ? 'No' : 'いいえ'}</option>}
							{<option value={'considering'}>{locale === 'en' ? 'Still considering' : 'まだ検討中'}</option>}
						</FormikSelect>
						<FormikInput label={locale === 'en' ? 'URL of your SNS' : 'あなたのSNSのURL'}
							name="snsURL" type="text"
							mb={3} variant="flushed" borderColor='gray.500'
							focusBorderColor={highlightColor} />
						<FormikInput label={locale === 'en' ? 'Current number of followers in your SNS' : 'あなたのSNSの現在のフォロワー数'}
							name="followerNumber" type="text"
							mb={3} variant="flushed" borderColor='gray.500'
							focusBorderColor={highlightColor} />
						<FormikSelect label={locale === 'en' ? 'Creation Type' : '創作物のタイプ'} name="type">
							{applyText.type[locale].map(type => <option value={type} key={type}>{type}</option>)}
						</FormikSelect>
						<FormikTextArea label={locale === 'en' ? 'Message' : 'メッセージ'} name="message" whiteSpace='pre-wrap'
							px={6} py={4} mb={3}
							size="xl" rows={10}
							borderColor='gray.500'
							focusBorderColor={highlightColor}
							borderRadius={4}
							lineHeight={1.6} />
						<FormikSubmitButton errors={errors} touched={touched} />
					</Form>
				)}

			</Formik>
		</>
	)
}