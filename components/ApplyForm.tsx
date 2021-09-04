import Router from 'next/router'
import { useState } from "react"
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage, useField } from 'formik'
import { FormikInput, FormikSelect, FormikTextArea } from '@/components/Formik/Fields'

import { Select } from "@chakra-ui/react"
import { useToast } from "@chakra-ui/toast"
import { Toast, ToastError } from '@/components/Toast'

export default function ApplyForm(props) {

	const [response, setResponse] = useState({ type: '', message: '', })

	const toast = useToast()

	// // Function
	const handleSubmit = async (values) => {
		// e.preventDefault()
		console.log('values:', values)
		console.log('Apply is working!!')

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

	// Component


	return (
		<>
			<h1>Subscribe!</h1>
			<Formik
				initialValues={{
					name: '',
					// lastName: '',
					email: '',
					message: '',
					plan: '',
					// acceptedTerms: false, // added for our checkbox
					// jobType: '', // added for our select
				}}
				validationSchema={Yup.object({
					name: Yup.string()
						.max(15, 'Must be 15 characters or less')
						.required('Required'),
					message: Yup.string()
						.max(2000, 'Must be 2000 characters or less')
						.required('Required'),
					plan: Yup.string()
						.required('Required'),
					// lastName: Yup.string()
					// 	.max(20, 'Must be 20 characters or less')
					// 	.required('Required'),
					email: Yup.string()
						.email('Invalid email address')
						.required('Required'),
					// acceptedTerms: Yup.boolean()
					// 	.required('Required')
					// 	.oneOf([true], 'You must accept the terms and conditions.'),
					// jobType: Yup.string()
					// 	.oneOf(
					// 		['designer', 'development', 'product', 'other'],
					// 		'Invalid Job Type'
					// 	)
					// 	.required('Required'),
				})}
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						handleSubmit(values)
						alert(JSON.stringify(values, null, 2));
						setSubmitting(false);
					}, 400);
				}}
			>
				<Form>
					<FormikInput label="Name" name="name" type="text" />
					<FormikInput label="Email" name="email" type="text" />
					<FormikTextArea label="Message" name="message" rows='30' />
					<FormikSelect label="Your Plan" name="plan">
						<option value="red">Red</option>
						<option value="green">Green</option>
						<option value="blue">Blue</option>
					</FormikSelect>
					<button type="submit">Submit</button>
				</Form>
			</Formik>
		</>
	);
}