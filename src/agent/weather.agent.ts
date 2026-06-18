import { openai } from '@ai-sdk/openai';
import { InferAgentUIMessage, stepCountIs, tool, ToolLoopAgent } from 'ai';
import { z } from 'zod';

// Tool (wheater lookup)
const weatherTool = tool({
  description: 'Get the current weather for a given city.',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  execute: async ({ city }) => {
    // Mocked temperature data for test
    const temperature = 15 + Math.floor(Math.random() * 20);
    return {
      city,
      temperature,
      unit: 'C',
      conditions: 'partly cloudy',
    };
  },
});

// Agent
export const weatherAgent = new ToolLoopAgent({
  model: openai('gpt-5.5'),
  instructions: `You are a helpful weather assistant.

  When asked about the weather:
  - Use the "weather" tool to look up the current conditions for each city mentioned.
  - If the user asks about multiple cities, look them up one at a time.
  - Summarize the result in a clear, friendly sentence.
  - Never invent temperatures; always rely on the tool's output.`,
  tools: {
    weather: weatherTool,
  },
  // Allow a few tool calls in sequence before forcing completion.
  stopWhen: stepCountIs(10),
});

export type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;
