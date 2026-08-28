const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type GrowthContext = {
  goals?: string[];
  areas?: Array<{ name: string; focus: string; progress: number }>;
  skills?: Array<{ name: string; progress: number; practiceCount: number }>;
  tasks?: Array<{ title: string; status: string; difficulty: string }>;
  journal?: { learned?: string; progress?: string; problems?: string; tomorrow?: string };
};
type BookRequest = { kind?: string; book?: { title?: string; chunks?: Array<{ text: string; pageStart: number; pageEnd: number; chunkIndex: number }> }; context?: { areas?: string[]; skills?: string[]; goals?: string[] } };

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
    const context = await request.json() as GrowthContext & BookRequest;
    const isBook = context.kind === 'book-extract';
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') || 'gpt-5',
        store: false,
        instructions: isBook ? 'You analyze only the supplied book chunks. Do not use outside knowledge. Return valid JSON matching the schema. Rank concepts by centrality, evidence, dependency and relevance to the user context. Include only claims supported by the chunks.' : 'You are a supportive personal growth assistant. Respect the user\'s existing goals; provide three small, concrete next steps and one observation. Return concise plain text with no invented facts.',
        input: JSON.stringify(context),
        ...(isBook ? { text: { format: { type: 'json_schema', name: 'book_extraction', strict: true, schema: { type: 'object', additionalProperties: false, properties: { bookType: { type: 'string' }, coreThesis: { type: 'string' }, concepts: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, summary: { type: 'string' }, tier: { type: 'integer', enum: [1,2,3,4] }, whyEssential: { type: 'string' }, prerequisites: { type: 'array', items: { type: 'string' } }, sourceChunkIds: { type: 'array', items: { type: 'string' } }, centralityScore: { type: 'number' }, dependencyScore: { type: 'number' }, bookThesisImportance: { type: 'number' }, userRelevanceScore: { type: 'number' }, practicalValue: { type: 'number' }, redundancyPenalty: { type: 'number' } }, required: ['name','summary','tier','whyEssential','prerequisites','sourceChunkIds','centralityScore','dependencyScore','bookThesisImportance','userRelevanceScore','practicalValue','redundancyPenalty'] } }, recalls: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { question: { type: 'string' }, answer: { type: 'string' }, difficulty: { type: 'string', enum: ['Easy','Medium','Hard'] }, conceptName: { type: 'string' } }, required: ['question','answer','difficulty','conceptName'] } } }, required: ['bookType','coreThesis','concepts','recalls'] } } } : {}),
      }),
    });
    const body = await response.json();
    if (!response.ok) return new Response(JSON.stringify({ error: body.error?.message || 'OpenAI request failed' }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const text = body.output_text || (body.output || [])
      .flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || [])
      .filter((item: { type?: string; text?: string }) => item.type === 'output_text' && item.text)
      .map((item: { type?: string; text?: string }) => item.text)
      .join('\n');
    if (isBook) { try { return new Response(JSON.stringify({ result: JSON.parse(text) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); } catch { return new Response(JSON.stringify({ error: 'The AI returned invalid structured book output.' }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }); } }
    return new Response(JSON.stringify({ text: text || 'No recommendation text was returned.' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
