import 'dotenv/config';

import { Controller, Get, Post, Res } from '@nestjs/common';
import express from 'express';
import { AppService } from './app.service';
import { 
  createUIMessageStream,
  streamText,
  pipeUIMessageStreamToResponse, 
} from 'ai';
import { openai } from '@ai-sdk/openai';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/stream-data')
  async root(@Res() res: express.Response) {
    const result = streamText({
      model: openai('gpt-5.5'),
      prompt: 'Invent a new holiday and describe its traditions.',
    });

    result.pipeUIMessageStreamToResponse(res as any);
  }

  @Post('/stream-custom-data')
  async streamData(@Res() response: express.Response) {
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        // write some data
        writer.write({ type: 'start' });

        writer.write({
          type: 'data-custom',
          data: {
            custom: 'Hello, world!',
          },
        });

        const result = streamText({
          model: openai('gpt-5.5'),
          prompt: 'Invent a new holiday and describe its traditions.',
        });
        writer.merge(
          result.toUIMessageStream({
            sendStart: false,
            onError: error => {
              // Error messages are masked by default for security reasons.
              // If you want to expose the error message to the client, you can do so here:
              return error instanceof Error ? error.message : String(error);
            },
          }),
        );
      },
    });
    pipeUIMessageStreamToResponse({ stream, response });
  }

  @Post('/text-stream')
  async example(@Res() res: express.Response) {
    const result = streamText({
      model: openai('gpt-5.5'),
      prompt: 'Invent a new holiday and describe its traditions.',
    });

    result.pipeTextStreamToResponse(res);
  }
}
