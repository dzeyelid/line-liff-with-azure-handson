import liff from "@line/liff";

const defaultLiffId = "playround-line-liff";

export class LiffService {
  private static instance: LiffService;

  private constructor() {
    this.initializeLib();
  }

  public static getInstance(): LiffService {
    if (!LiffService.instance) {
      LiffService.instance = new LiffService();
    }
    return LiffService.instance;
  }

  public getLineVersion() {
    return liff.getLineVersion();
  }

  public isLoggeeIn() {
    return liff.isLoggedIn();
  }

  private async initializeLib() {
    await liff.init({ liffId: defaultLiffId });
  }
}
