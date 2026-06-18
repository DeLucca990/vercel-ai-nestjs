import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgentService } from './agent/agent.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AgentService],
})
export class AppModule {}
