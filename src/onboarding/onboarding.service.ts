import { Metadata } from '@grpc/grpc-js';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { firstValueFrom, Observable } from 'rxjs';
import {
  OnboardingInformationResponse,
  OnboardingResponse,
  OnboardingServiceClient,
} from './onboarding';

export class OnboardingService {
  private onboardingService: OnboardingServiceClient;

  constructor(@Inject('ONBOARDING_PKG') client: ClientGrpc) {
    this.onboardingService =
      client.getService<OnboardingServiceClient>('OnboardingService');
  }

  public async getFlowInformationAsync(): Promise<OnboardingInformationResponse> {
    return await firstValueFrom<OnboardingInformationResponse>(
      this.onboardingService.getInformation({}),
    );
  }

  public async executeRequestAsync(
    instanceId: string,
    body: any,
  ): Promise<OnboardingResponse> {
    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    const processedBody = await this.beforeExecuteRequestAsync(body);
    return await firstValueFrom<OnboardingResponse>(
      this.onboardingService.execute(
        {
          input: processedBody,
        },
        metadata,
      ),
    );
  }

  public async startRequestAsync(
    instanceId: string,
  ): Promise<OnboardingResponse> {
    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    return await firstValueFrom<OnboardingResponse>(
      instanceId
        ? this.onboardingService.resume({}, metadata)
        : this.onboardingService.start({}),
    );
  }

  public async deleteRequestAsync(
    instanceId: string,
  ): Promise<OnboardingResponse> {
    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    return await firstValueFrom<OnboardingResponse>(
      this.onboardingService.delete({}, metadata),
    );
  }

  private async beforeExecuteRequestAsync(input: any) {
    return JSON.stringify(input);
  }

  private async uploadDocumentAsync(filePath: string) {
    const app = admin.initializeApp({
      credential: applicationDefault(),
    });

    const bucket = app.storage().bucket(process.env.STORAGE_BUCKET);
    await bucket.upload(filePath);
  }
}
