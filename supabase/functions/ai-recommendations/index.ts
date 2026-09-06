const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

type Input = {
  kind?: 'book-extract' | 'book-answer';
  book?: { id?: string; title?: string; chunks?: Array<{ id?: string; text: string; pageStart: number; pageEnd: number; chunkIndex: number }> };
  context?: unknown;
  question?: string;
  evidence?: unknown;
  goals?: unknown;
  areas?: unknown;
  skills?: unknown;
  tasks?: unknown;
  journal?: unknown;
};

const outputText = (body: any) => body.output_text || (body.output || [])
  .flatMap((item: any) => item.content || [])
  .filter((item: any) => item.type === 'output_text' && item.text)
  .map((item: any) => item.text)
  .join('\n');

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
    const input = await request.json() as Input;
    const isBook = input.kind === 'book-extract' || input.kind === 'book-answer';
    const instructions = input.kind === 'book-extract'
      ? 'Analyze only the supplied book chunks. Return ONLY valid JSON with keys bookType, coreThesis, concepts, recalls. Return at most 8 concepts and 8 recall questions. Every concept sourceChunkIds value must use an id supplied in the chunks.'
      : input.kind === 'book-answer'
        ? 'Answer only from the supplied book excerpts. Return ONLY valid JSON with keys answer, confidence, insufficientEvidence, citations, followUpQuestions. Use only supplied chunk IDs for citations.'
        : 'Return three small, concrete next steps and one observation in concise plain text.';
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(50000),
      body: JSON.stringify({ model: Deno.env.get('OPENAI_MODEL') || 'gpt-5-mini', store: false, instructions, input: JSON.stringify(input) }),
    });
    const body = await response.json();
    if (!response.ok) return new Response(JSON.stringify({ error: body.error?.message || 'OpenAI request failed' }), { status: response.status, headers: jsonHeaders });
    const text = outputText(body);
    if (isBook) {
      try { return new Response(JSON.stringify({ result: JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim()) }), { headers: jsonHeaders }); }
      catch { return new Response(JSON.stringify({ error: 'The AI returned invalid structured book output.' }), { status: 502, headers: jsonHeaders }); }
    }
    return new Response(JSON.stringify({ text: text || 'No recommendation text was returned.' }), { headers: jsonHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: jsonHeaders });
  }
});
