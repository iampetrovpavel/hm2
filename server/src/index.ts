import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { DEFAULT_INSTRUCTIONS } from './instructions';

const app = new Hono<{ Bindings: any }>();
app.use(cors());

// Learn more: https://platform.openai.com/docs/api-reference/realtime-sessions/create
app.get('/session', async (c) => {
	const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-4o-mini-realtime-preview",
			instructions: DEFAULT_INSTRUCTIONS,
			voice: "ash",
		}),
	});
	const result = await response.json();
	return c.json({ result });
});


export default app;