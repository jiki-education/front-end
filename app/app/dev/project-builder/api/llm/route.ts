// Dev-only streaming relay for LLM providers that don't support browser CORS
// (OpenCode Zen). The client posts the upstream URL + an OpenAI-compatible
// body; we forward with the Authorization header and stream the response
// straight back. Lives under /dev so the middleware's production 404 for
// /dev/* routes guards it automatically.

const ALLOWED_UPSTREAMS = ["https://opencode.ai/zen/v1/chat/completions"];

export async function POST(request: Request): Promise<Response> {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  const { upstreamUrl, ...body } = (await request.json()) as { upstreamUrl?: string } & Record<string, unknown>;
  if (!upstreamUrl || !ALLOWED_UPSTREAMS.includes(upstreamUrl)) {
    return Response.json({ error: { message: `Upstream not allowed: ${upstreamUrl}` } }, { status: 400 });
  }

  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: request.headers.get("authorization") ?? ""
    },
    body: JSON.stringify(body)
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "text/event-stream",
      "Cache-Control": "no-cache"
    }
  });
}
