export class OnboardingError {
  code: string;
  message: string;
}

export class OnboardingResponseViewModel {
  public success: boolean;
  public data: any;
  public error: OnboardingError;
  constructor(data: any, error: OnboardingError) {
    if (error) {
      this.success = false;
      this.error = error;
    } else {
      this.success = true;
      this.data = data;
    }
  }
}
