import { Metadata } from '@grpc/grpc-js';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import admin, { app } from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import { firstValueFrom } from 'rxjs';
import {
  OnboardingInformationResponse,
  OnboardingResponse,
  OnboardingServiceClient,
} from './onboarding';
import { v4 } from 'uuid';

export class OnboardingService {
  private onboardingService: OnboardingServiceClient;
  private firebaseApp: app.App;

  constructor(@Inject('ONBOARDING_PKG') client: ClientGrpc) {
    this.onboardingService =
      client.getService<OnboardingServiceClient>('OnboardingService');

    this.firebaseApp = admin.initializeApp({
      credential: applicationDefault(),
    });
  }

  public async getFlowInformationAsync(): Promise<OnboardingInformationResponse> {
    return await firstValueFrom<OnboardingInformationResponse>(
      this.onboardingService.getInformation({}),
    );
  }

  public async executeRequestAsync(
    instanceId: string,
    body: any,
    files: Array<Express.Multer.File>,
  ): Promise<OnboardingResponse> {
    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    const processedBody = await this.beforeExecuteRequestAsync(body, files);
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

  public async rollbackAsync(instanceId: string): Promise<OnboardingResponse> {
    const metadata = new Metadata();
    metadata.add('instanceId', instanceId);

    return await firstValueFrom<OnboardingResponse>(
      this.onboardingService.rollback({}, metadata),
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

  private async beforeExecuteRequestAsync(
    input: any,
    files: Array<Express.Multer.File>,
  ) {
    if (files.length) {
      const file = files[0];
      const ext = extname(file.originalname);

      const tempFolder = './temp';
      if (!existsSync(tempFolder)) mkdirSync(tempFolder);

      const fileName = `${v4()}${ext}`;
      const filePath = join(tempFolder, fileName);
      writeFileSync(filePath, file.buffer, { encoding: 'binary' });
      const response = await this.uploadDocumentAsync(filePath, fileName);
      unlinkSync(filePath);

      input.documentUrl = response;
    }

    return JSON.stringify(input);
  }

  private async uploadDocumentAsync(filePath: string, fileName: string) {
    const bucket = this.firebaseApp
      .storage()
      .bucket(process.env.STORAGE_BUCKET);

    await bucket.upload(filePath);
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);

    const signedUrl = await bucket.file(fileName).getSignedUrl({
      action: 'read',
      expires: expireDate,
    });

    return signedUrl[0];
  }
}
