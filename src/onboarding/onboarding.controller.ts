import { Metadata } from '@grpc/grpc-js';
import {
  Controller,
  Inject,
  Post,
  Put,
  Body,
  Delete,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices/interfaces';
import { firstValueFrom } from 'rxjs';
import {
  OnboardingInformationResponse,
  OnboardingResponse,
  OnboardingServiceClient,
} from './onboarding';
import { OnboardingRequestViewModel } from './view-models/onboarding-request.viewmodel';
import { OnboardingResponseViewModel } from './view-models/onboarding-response.viewmodel';

@Controller('onboarding')
export class OnboardingController {
  private onboardingService: OnboardingServiceClient;
  private instanceIdCookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 3,
  };
  private static onboardingInstanceIdCookieKey = 'onboarding_instance_id';

  constructor(@Inject('ONBOARDING_PKG') client: ClientGrpc) {
    this.onboardingService =
      client.getService<OnboardingServiceClient>('OnboardingService');
  }

  @Get('getInformation')
  async getInformation(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<OnboardingResponseViewModel> {
    try {
      const result = await firstValueFrom<OnboardingInformationResponse>(
        this.onboardingService.getInformation({}),
      );

      return new OnboardingResponseViewModel(result.data, null);
    } catch (err) {
      res.statusCode = 500;
      return new OnboardingResponseViewModel(null, err);
    }
  }

  @Post('start')
  async start(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<OnboardingResponseViewModel> {
    const instanceId =
      req.cookies[OnboardingController.onboardingInstanceIdCookieKey];

    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    try {
      const result = await firstValueFrom<OnboardingResponse>(
        instanceId
          ? this.onboardingService.resume({}, metadata)
          : this.onboardingService.start({}),
      );

      res.cookie(
        OnboardingController.onboardingInstanceIdCookieKey,
        result.instanceId,
        this.instanceIdCookieOpts,
      );

      return new OnboardingResponseViewModel(result.data, null);
    } catch (err) {
      res.statusCode = 500;
      return new OnboardingResponseViewModel(null, err);
    }
  }

  @Put('execute')
  async execute(
    @Body() body: OnboardingRequestViewModel,
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<OnboardingResponseViewModel> {
    const instanceId =
      req.cookies[OnboardingController.onboardingInstanceIdCookieKey];

    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    try {
      const result = await firstValueFrom<OnboardingResponse>(
        this.onboardingService.execute(
          {
            input: {},
          },
          metadata,
        ),
      );

      return new OnboardingResponseViewModel(result.data, null);
    } catch (err) {
      res.statusCode = 500;
      return new OnboardingResponseViewModel(null, err);
    }
  }

  @Delete('delete')
  async delete(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<OnboardingResponseViewModel> {
    const instanceId =
      req.cookies[OnboardingController.onboardingInstanceIdCookieKey];

    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    try {
      const result = await firstValueFrom<OnboardingResponse>(
        this.onboardingService.delete({}, metadata),
      );

      return new OnboardingResponseViewModel(result.data, null);
    } catch (err) {
      res.statusCode = 500;
      return new OnboardingResponseViewModel(null, err);
    }
  }
}
