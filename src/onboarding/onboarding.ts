/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";

export const protobufPackage = "onboarding";

export interface Input {
}

export interface OnboardingRequest {
  input: Input | undefined;
}

export interface Data {
  currentStep: string;
  isCompleted: boolean;
}

export interface OnboardingResponse {
  success: boolean;
  error: Error | undefined;
  data: Data | undefined;
  instanceId: string;
}

export interface Error {
  code: string;
  message: string;
}

export const ONBOARDING_PACKAGE_NAME = "onboarding";

export interface OnboardingServiceClient {
  start(request: Empty, metadata?: Metadata): Observable<OnboardingResponse>;

  resume(request: OnboardingRequest, metadata?: Metadata): Observable<OnboardingResponse>;

  execute(request: OnboardingRequest, metadata?: Metadata): Observable<OnboardingResponse>;

  delete(request: Empty, metadata?: Metadata): Observable<OnboardingResponse>;
}

export interface OnboardingServiceController {
  start(
    request: Empty,
    metadata?: Metadata,
  ): Promise<OnboardingResponse> | Observable<OnboardingResponse> | OnboardingResponse;

  resume(
    request: OnboardingRequest,
    metadata?: Metadata,
  ): Promise<OnboardingResponse> | Observable<OnboardingResponse> | OnboardingResponse;

  execute(
    request: OnboardingRequest,
    metadata?: Metadata,
  ): Promise<OnboardingResponse> | Observable<OnboardingResponse> | OnboardingResponse;

  delete(
    request: Empty,
    metadata?: Metadata,
  ): Promise<OnboardingResponse> | Observable<OnboardingResponse> | OnboardingResponse;
}

export function OnboardingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["start", "resume", "execute", "delete"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OnboardingService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OnboardingService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ONBOARDING_SERVICE_NAME = "OnboardingService";
