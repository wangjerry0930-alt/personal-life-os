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

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
    const context = await request.json() as GrowthContext;
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') || 'gpt-5',
        store: false,
        instructions: 'You are a supportive personal growth assistant. Respect the user\'s existing goals; provide three small, concrete next steps and one observation. Return concise plain text with no invented facts.',
        input: JSON.stringify(context),
      }),
    });
    const body = await response.json();
    if (!response.ok) return new Response(JSON.stringify({ error: body.error?.message || 'OpenAI request failed' }), { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const text = body.output_text || (body.output || [])
      .flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || [])
      .filter((item: { type?: string; text?: string }) => item.type === 'output_text' && item.text)
      .map((item: { type?: string; text?: string }) => item.text)
      .join('\n');
    return new Response(JSON.stringify({ text: text || 'No recommendation text was returned.' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
