module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  return res.status(200).json({
    ok: true,
    service: 'openai-proxy-vercel',
    hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY),
    hasProxySecret: Boolean(process.env.PROXY_SECRET),
  })
}
