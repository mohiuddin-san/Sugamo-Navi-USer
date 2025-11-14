declare module "remix-i18next" {
  import type { Backend } from "i18next-fs-backend";

  export class RemixI18Next {
    constructor(options: {
      detection: {
        supportedLanguages: string[];
        fallbackLanguage: string;
      };
      i18next: any;
      backend?: typeof Backend;
    });

    getFixedT(request: Request): Promise<any>;
    getLocale(): string;
    getCookie(): {
      serialize: (value: string) => Promise<string>;
    };
    getI18n(): any;
  }
}
