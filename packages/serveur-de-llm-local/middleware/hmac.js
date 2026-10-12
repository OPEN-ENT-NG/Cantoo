// @ts-check
const crypto = require('crypto')

function verifyHMAC(req, res, next) {
  const clientId = req.header('X-Client-Id')
  const signature = req.header('X-Signature')
  const timestamp = req.header('X-Timestamp')

  if (!clientId || !signature || !timestamp) {
    return res.status(401).json({ message: 'Missing HMAC headers' })
  }

  if (!process.env.CLIENT_SECRET) {
    console.error('CLIENT_SECRET environment variable is not set')
    return res.status(500).json({ message: 'Server configuration error' })
  }

  const clientSecret = process.env.CLIENT_SECRET
  const body = JSON.stringify(req.body || {})
  const query = JSON.stringify(req.query || {})

  const now = Date.now()
  const sentTime = Date.parse(timestamp)
  if (Math.abs(now - sentTime) > 5 * 60 * 1000) {
    return res.status(401).json({ message: 'Invalid timestamp' })
  }

  const baseString = `${clientId}:${timestamp}:${query}:${body}`
  const expectedSignature = crypto
    .createHmac('sha256', clientSecret)
    .update(baseString)
    .digest('hex')

  if (signature !== expectedSignature) {
    return res.status(401).json({ message: 'Invalid HMAC signature' })
  }

  next()
}

module.exports = verifyHMAC
