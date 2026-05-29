module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed. Use POST.',
        type: 'method_not_allowed',
      },
    })
  }

  const openAiKey = process.env.OPENAI_API_KEY
  const proxySecret = process.env.PROXY_SECRET

  if (!openAiKey) {
    return res.status(500).json({
      error: {
        message: 'OPENAI_API_KEY is not set on Vercel proxy.',
        type: 'missing_openai_api_key',
      },
    })
  }

  if (!proxySecret) {
    return res.status(500).json({
      error: {
        message: 'PROXY_SECRET is not set on Vercel proxy.',
        type: 'missing_proxy_secret',
      },
    })
  }

  const authorization = req.headers.authorization || ''
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : ''

  if (token !== proxySecret) {
    return res.status(401).json({
      error: {
        message: 'Unauthorized proxy request.',
        type: 'unauthorized_proxy_request',
      },
    })
  }

  try {
    const upstreamResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    })

    const text = await upstreamResponse.text()

    res.status(upstreamResponse.status)

    try {
      return res.json(JSON.parse(text))
    } catch (parseError) {
      return res.send(text)
    }
  } catch (error) {
    return res.status(502).json({
      error: {
        message: error && error.message ? error.message : 'OpenAI proxy request failed.',
        type: 'openai_proxy_error',
      },
    })
  }
}
