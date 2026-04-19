export { WEBSITE_BUILDER_LOCALE_STATUSES, WebsiteBuilderLocaleItem, normalizeWebsiteBuilderLocaleItem, normalizeWebsiteBuilderLocaleItems, parseWebsiteBuilderLocaleCodes, resolveWebsiteBuilderActiveLocales, resolveWebsiteBuilderEditableLocales, resolveWebsiteBuilderLocaleCodes } from './server.js';
import { WebsiteBuilderInstallableKit, WebsiteBuilderModule, WebsiteBuilderSiteSettingsPanelDefinition } from '@init-modules/website-builder';

declare const siteLocalesSettingsPanel: WebsiteBuilderSiteSettingsPanelDefinition;
declare const settingsWebsiteBuilderModule: WebsiteBuilderModule;
declare const settingsWebsiteBuilderKit: WebsiteBuilderInstallableKit;

export { settingsWebsiteBuilderKit, settingsWebsiteBuilderModule, siteLocalesSettingsPanel };
