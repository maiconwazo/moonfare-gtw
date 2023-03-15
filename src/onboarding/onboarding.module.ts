import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ONBOARDING_PKG',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'onboarding',
            protoPath: join(__dirname, 'onboarding.proto'),
            url: configService.get<string>('ONBOARDING_API_ENDPOINT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class OnboardingModule {}
