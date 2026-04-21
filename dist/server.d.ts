import { WebsiteBuilderLocaleStatus, WebsiteBuilderLocaleDescriptor } from '@init-modules/website-builder/public';

type WebsiteBuilderLocaleItem = WebsiteBuilderLocaleDescriptor;
declare const WEBSITE_BUILDER_LOCALE_STATUSES: WebsiteBuilderLocaleStatus[];
declare const normalizeWebsiteBuilderLocaleItem: (value: Partial<WebsiteBuilderLocaleItem> | null | undefined, fallbackCode?: string, index?: number) => WebsiteBuilderLocaleItem;
declare const normalizeWebsiteBuilderLocaleItems: (values: unknown, defaultLocale?: string) => WebsiteBuilderLocaleDescriptor[];
declare const parseWebsiteBuilderLocaleCodes: (value: string | undefined, _fallback?: string[]) => string[];
declare const resolveWebsiteBuilderLocaleCodes: (value: string | undefined, fallback?: string[]) => string[];
declare const resolveWebsiteBuilderActiveLocales: (locales: WebsiteBuilderLocaleItem[]) => WebsiteBuilderLocaleDescriptor[];
declare const resolveWebsiteBuilderEditableLocales: (locales: WebsiteBuilderLocaleItem[]) => WebsiteBuilderLocaleDescriptor[];

export { WEBSITE_BUILDER_LOCALE_STATUSES, type WebsiteBuilderLocaleItem, normalizeWebsiteBuilderLocaleItem, normalizeWebsiteBuilderLocaleItems, parseWebsiteBuilderLocaleCodes, resolveWebsiteBuilderActiveLocales, resolveWebsiteBuilderEditableLocales, resolveWebsiteBuilderLocaleCodes };
