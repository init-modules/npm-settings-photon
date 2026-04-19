import { WebsiteBuilderInstallableKit, WebsiteBuilderModule } from '@init-modules/website-builder';
export { WEBSITE_BUILDER_LOCALE_STATUSES, WebsiteBuilderLocaleItem, normalizeWebsiteBuilderLocaleItem, normalizeWebsiteBuilderLocaleItems, parseWebsiteBuilderLocaleCodes, resolveWebsiteBuilderActiveLocales, resolveWebsiteBuilderEditableLocales, resolveWebsiteBuilderLocaleCodes } from './server.js';

declare const settingsWebsiteBuilderModule: WebsiteBuilderModule;
declare const settingsWebsiteBuilderKit: WebsiteBuilderInstallableKit;

export { settingsWebsiteBuilderKit, settingsWebsiteBuilderModule };
