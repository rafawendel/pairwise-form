import { crypto, get, post, getIp } from '../../utils/requests'

const DB_URL = `https://script.google.com/macros/s/${process.env.DB_ID}/exec`
export default async (req, res) => {
  const [cipher] = crypto(process.env.DUMMY_PASSPHRASE)

  if (req.method === 'POST') {
    try {
      const { selected, pairs, name } = req.body
      const address = getIp(req)

      const canUserSubmit = await validateIp(req)
      if (!canUserSubmit) throw new Error('Nice try, but you have submitted already')
      
      const dbRes = await post(DB_URL, {
        ip: cipher(address),
        name,
        pairs,
        selected
      })

      if (dbRes.error) throw new Error(dbRes.error)

      res.status(200).json({ message: 'success' })

    } catch(error) {
      res.status(400).json({ message: 'error', error: error && error.message })
    }
  } else {
    res.status(200).json({ 'message': 'hello there' })
  }
}

export async function validateIp(req) {
  const [cipher] = crypto(process.env.DUMMY_PASSPHRASE)
  const address = getIp(req)

  const dbValidationResponse = await get(DB_URL, { ip: cipher(address) })
  const { auth, message } =  dbValidationResponse

  if (message === 'error') throw new Error(dbValidationResponse.error)

  return auth
}
