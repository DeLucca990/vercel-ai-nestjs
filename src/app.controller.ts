import { Controller, Get, Post, Res } from '@nestjs/common';
import express from 'express';
import { AppService } from './app.service';
import { pipeUIMessageStreamToResponse } from 'ai';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
}
