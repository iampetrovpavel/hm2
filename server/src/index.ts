import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { DEFAULT_INSTRUCTIONS, INSTRUCTIONS_COLLECTOR } from './instructions';
import OpenAI from 'openai';

const app = new Hono<{ Bindings: any }>();
app.use(cors());

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Learn more: https://platform.openai.com/docs/api-reference/realtime-sessions/create
app.get('/session', async (c) => {
	const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			// model: "gpt-4o-realtime-preview",
			model: "gpt-4o-mini-realtime-preview",
			instructions: DEFAULT_INSTRUCTIONS,
			voice: "ash",
		}),
	});
	const result = await response.json();
	return c.json({ result });
});

app.post('/collect', async (c) => {
	const { messages } = await c.req.json();
	
	const completion = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: [
			{ role: "system", content: INSTRUCTIONS_COLLECTOR },
			...messages
		],
	});
	
	return c.json(completion.choices[0].message);
});

export default app;