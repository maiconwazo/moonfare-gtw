import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { config } from 'dotenv';

config();

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ONBOARDING_PKG',
        useFactory: async () => ({
          transport: Transport.GRPC,
          options: {
            package: 'onboarding',
            protoPath: join(__dirname, 'onboarding.proto'),
            url: `${process.env.ONBOARDING_API_HOST}:${process.env.ONBOARDING_API_PORT}`,
          },
        }),
      },
    ]),
  ],
})
export class OnboardingModule {}
