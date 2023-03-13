import { Module } from '@nestjs/common';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ConfigModule } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OnboardingModule],
  providers: [HttpAdapterHost],
})
export class AppModule {}
