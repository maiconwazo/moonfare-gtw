import { Metadata } from '@grpc/grpc-js';
import {
  Controller,
  Post,
  Put,
  Body,
  Delete,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingResponseViewModel } from './view-models/onboarding-response.viewmodel';

@Controller('onboarding')
export class OnboardingController {
  private instanceIdCookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 3,
  };
  private static onboardingInstanceIdCookieKey = 'onboarding_instance_id';

  constructor(private onboardingService: OnboardingService) {}

  @Get('getInformation')
  async getInformation(
    @Res({ passthrough: true }) res,
  ): Promise<OnboardingResponseViewModel> {
    try {
      const result = await this.onboardingService.getFlowInformationAsync();

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
      const result = await this.onboardingService.startRequestAsync(instanceId);

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
    @Body() body: any,
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<OnboardingResponseViewModel> {
    const instanceId =
      req.cookies[OnboardingController.onboardingInstanceIdCookieKey];

    try {
      const result = await this.onboardingService.executeRequestAsync(
        instanceId,
        body,
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

    try {
      const result = await this.onboardingService.deleteRequestAsync(
        instanceId,
      );

      return new OnboardingResponseViewModel(result.data, null);
    } catch (err) {
      res.statusCode = 500;
      return new OnboardingResponseViewModel(null, err);
    }
  }
}
