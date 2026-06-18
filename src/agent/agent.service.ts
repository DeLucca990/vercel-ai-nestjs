import { Injectable } from '@nestjs/common';
import { UIMessage } from 'ai';
import { weatherAgent } from './weather.agent';

@Injectable()
export class AgentService {
  async ask(prompt: string): Promise<string> {
    const result = await weatherAgent.generate({
      prompt,
      onStepFinish: async ({ stepNumber, usage, toolCalls }) => {
        console.log(`Step ${stepNumber} completed`, {
          outputTokens: usage.outputTokens,
          toolsUsed: toolCalls?.map((tc) => tc.toolName),
        });
      },
    });
    return result.text;
  }

  async stream(prompt: string) {
    return weatherAgent.stream({ 
      prompt,
      onStepFinish: async ({ stepNumber, usage, toolCalls }) => {
        console.log(`Step ${stepNumber} completed`, {
          inputTookens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          toolsUsed: toolCalls?.map((tc) => tc.toolName),
        });
      } 
    });
  }

  uiStream(messages: UIMessage[]) {
    return { agent: weatherAgent, uiMessages: messages };
  }
}
