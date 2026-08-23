export type GrowthContext = {
  goals?: string[];
  areas?: Array<{ name: string; focus: string; progress: number }>;
  skills?: Array<{ name: string; progress: number; practiceCount: number }>;
  tasks?: Array<{ title: string; status: string; difficulty: string }>;
  journal?: { learned?: string; progress?: string; problems?: string; tomorrow?: string };
};

export async function requestAIRecommendations(endpoint: string, context: GrowthContext) {
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(context) });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'AI request failed');
  return body.text as string;
}
