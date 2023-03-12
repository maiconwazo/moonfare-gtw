import { Controller, Inject, Post, Put } from '@nestjs/common';
import { Body, UseFilters } from '@nestjs/common/decorators';
import { ClientGrpc } from '@nestjs/microservices/interfaces';
import { RpcExceptionFilter } from 'src/common/decorators/rpc-exception-filter';
import { ExecuteRequest, OnboardingService } from './onboarding';

@Controller('onboarding')
@UseFilters(RpcExceptionFilter)
export class OnboardingController {
  private onboardingService: OnboardingService;

  constructor(@Inject('ONBOARDING_PKG') client: ClientGrpc) {
    this.onboardingService =
      client.getService<OnboardingService>('OnboardingService');
  }

  @Post('start')
  start(@Body() request: ExecuteRequest) {
    return this.onboardingService.Start(request);
  }

  @Put('execute')
  async execute(@Body() request: ExecuteRequest) {
    const result = await this.onboardingService.Execute(request);
    return result;
  }
}
