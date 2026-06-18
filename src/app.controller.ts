import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import express from 'express';
import { AppService } from './app.service';
import { AgentService } from './agent/agent.service';
import { pipeAgentUIStreamToResponse, pipeUIMessageStreamToResponse, UIMessage } from 'ai';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly agentService: AgentService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/text-stream')
  async example(@Res() response: express.Response) {
    const result = this.appService.textStream();
    result.pipeTextStreamToResponse(response);
  }

  @Post('/stream-data')
  async root(@Res() response: express.Response) {
    const result = this.appService.streamData();
    result.pipeUIMessageStreamToResponse(response);
  }

  @Post('/stream-custom-data')
  async streamData(@Res() response: express.Response) {
    const stream = this.appService.streamCustomData();
    pipeUIMessageStreamToResponse({ stream, response });
  }

  @Post('/agent/weather/ask')
  async agentAsk(@Body('prompt') prompt: string): Promise<{ text: string }> {
    const text = await this.agentService.ask(
      prompt ?? 'What is the weather like in Lisbon?',
    );
    return { text };
  }

  @Post('/agent/weather/stream')
  async agentStream(
    @Body('prompt') prompt: string,
    @Res() response: express.Response,
  ) {
    const result = await this.agentService.stream(
      prompt ?? 'Compare the weather in Lisbon and Porto.',
    );
    result.pipeUIMessageStreamToResponse(response);
  }

  @Post('/agent/weather/chat')
  async agentChat(
    @Body('messages') messages: UIMessage[],
    @Res() response: express.Response,
  ) {
    const { agent, uiMessages } = this.agentService.uiStream(messages ?? []);
    await pipeAgentUIStreamToResponse({ agent, uiMessages, response });
  }
}
