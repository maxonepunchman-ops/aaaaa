export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "openai-proxy-vercel",
    hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY),
    hasProxySecret: Boolean(process.env.PROXY_SECRET),
  });
}
