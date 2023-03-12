import { Module } from '@nestjs/common';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OnboardingModule],
})
export class AppModule {}
