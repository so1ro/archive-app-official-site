import { upsertUserMetadata } from '@/utils/useAuth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { loggerError_Serverside } from '@/utils/logger'

const updateUserMetadata = async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth0_UUID, meta }: { auth0_UUID: string, meta: object } = req.body

  if (req.method === 'POST') {
    try {
      const data = await upsertUserMetadata(auth0_UUID, meta)
      return res.status(200).json({ data })

    } catch (e) {
      //// Logging ////
      console.error('api/upsert-user-metadata にて、エラー。auth0 user_metadataの更新ができませんでした。');
      loggerError_Serverside(req, res, e, 'api/upsert-user-metadata にて、エラー。auth0 user_metadataの更新ができませんでした。')
      //// end of Logging ////
      res.status(400)
      return res.send({
        error: {
          message: e.message,
        }
      })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default updateUserMetadata
