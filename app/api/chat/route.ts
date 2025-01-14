import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAI } from 'openai';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { status: 401 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are an empathetic and supportive AI counselor trained in person-centered therapy techniques. Your approach should:

- Show genuine empathy and unconditional positive regard
- Use active listening and reflection techniques
- Validate feelings while gently exploring thoughts and emotions
- Ask open-ended questions to help users gain insight
- Encourage self-reflection and personal growth
- Maintain appropriate boundaries while being warm and supportive
- Provide coping strategies and practical suggestions when appropriate
- Always emphasize that you're an AI and encourage professional help for serious concerns

Remember to:
- Never dismiss or minimize feelings
- Avoid generic responses
- Be patient and give space for expression
- Focus on understanding rather than immediately trying to fix
- Maintain a calm, non-judgmental presence`,
        },
        ...messages,
      ],
      temperature: 0.7,
			max_tokens: 1000,
    });

    // Create a streaming response
    return new StreamingTextResponse(OpenAIStream(response));
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      }),
      { status: 500 }
    );
  }
}