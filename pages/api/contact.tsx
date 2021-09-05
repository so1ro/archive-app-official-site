import { NextApiRequest, NextApiResponse } from 'next'
import { loggerError_Serverside } from '@/utils/logger'
import nodemailer from 'nodemailer'

const ContactApi = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {

		const regex = new RegExp(/\n/, 'gi') // New line : change \n to <br />
		const mailData = {
			from: req.body.email,
			to: 'masamichi.kagaya.ap+archive-app-official@gmail.com',
			subject: `Message From ${req.body.name}`,
			text: req.body.message,
			html: `<div><p>${req.body.plan}</p><p>${req.body.message.replace(regex, '<br />')}</p></div>`
		}

		const transporter = nodemailer.createTransport({
			port: 465,
			host: "smtp.gmail.com",
			auth: {
				user: process.env.CONTACT_SMTP_ADDRESS,
				pass: process.env.CONTACT_SMTP_PASSWORD,
			},
			secure: true,
		})

		try {
			const result = await transporter.sendMail(mailData, function (err, info) {
				if (err) {
					res.status(400)
					return res.send({ error: { message: err } })
				}
				else console.log(info)
			})
			res.status(200).send({ success: { message: 'mail was sent' } })

		} catch (e) {
			//// Logging ////
			console.error('api/contactにて、エラー。メッセージは送信されませんでした。', e);
			loggerError_Serverside(req, res, e, 'api/contactにて、エラー。メッセージは送信されませんでした。')
			//// end of Logging ////
		}

	} else {
		res.setHeader('Allow', 'POST')
		res.status(405).end('Method Not Allowed')
	}
}

export default ContactApi