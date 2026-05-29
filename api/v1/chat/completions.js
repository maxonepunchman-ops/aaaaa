async function readBody(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");

  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const proxySecret = process.env.PROXY_SECRET;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!proxySecret) {
    return res.status(500).json({
      error: "PROXY_SECRET is not configured on Vercel",
    });
  }

  if (!openaiApiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured on Vercel",
    });
  }

  const authHeader = req.headers.authorization || "";

  if (authHeader !== `Bearer ${proxySecret}`) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const body = await readBody(req);

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await openaiResponse.text();

    res.status(openaiResponse.status);
    res.setHeader(
      "Content-Type",
      openaiResponse.headers.get("content-type") || "application/json"
    );

    return res.send(responseText);
  } catch (error) {
    return res.status(500).json({
      error: "Proxy error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
