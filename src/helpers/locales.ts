import type {
	WebsiteBuilderLocaleDescriptor,
	WebsiteBuilderLocaleStatus,
} from "@init-modules/website-builder/public";

export type WebsiteBuilderLocaleItem = WebsiteBuilderLocaleDescriptor;

export const WEBSITE_BUILDER_LOCALE_STATUSES: WebsiteBuilderLocaleStatus[] = [
	"active",
	"draft",
	"inactive",
];

export const normalizeWebsiteBuilderLocaleItem = (
	value: Partial<WebsiteBuilderLocaleItem> | null | undefined,
	fallbackCode = "ru",
	index = 0,
): WebsiteBuilderLocaleItem => {
	const code =
		typeof value?.code === "string" && value.code.trim() !== ""
			? value.code.trim().toLowerCase()
			: fallbackCode;
	const label =
		typeof value?.label === "string" && value.label.trim() !== ""
			? value.label.trim()
			: code.toUpperCase();
	const status = WEBSITE_BUILDER_LOCALE_STATUSES.includes(
		value?.status as WebsiteBuilderLocaleStatus,
	)
		? (value?.status as WebsiteBuilderLocaleStatus)
		: "active";

	return {
		code,
		label,
		status,
		isDefault: Boolean(value?.isDefault),
		sortOrder:
			typeof value?.sortOrder === "number" && Number.isFinite(value.sortOrder)
				? value.sortOrder
				: index,
	};
};

export const normalizeWebsiteBuilderLocaleItems = (
	values: unknown,
	defaultLocale = "ru",
): WebsiteBuilderLocaleDescriptor[] => {
	if (!Array.isArray(values)) {
		return [
			normalizeWebsiteBuilderLocaleItem({
				code: defaultLocale,
				isDefault: true,
			}),
		];
	}

	return values.map((item, index) =>
		normalizeWebsiteBuilderLocaleItem(
			typeof item === "object" && item !== null
				? (item as Partial<WebsiteBuilderLocaleItem>)
				: null,
			defaultLocale,
			index,
		),
	);
};

export const parseWebsiteBuilderLocaleCodes = (
	value: string | undefined,
	_fallback: string[] = ["ru", "en"],
): string[] =>
	(value ?? "")
		.split(",")
		.map((item) => item.trim().toLowerCase())
		.filter(Boolean);

export const resolveWebsiteBuilderLocaleCodes = (
	value: string | undefined,
	fallback: string[] = ["ru", "en"],
): string[] => {
	const parsed = parseWebsiteBuilderLocaleCodes(value, fallback);

	return parsed.length > 0 ? parsed : fallback;
};

const bySortOrder = (
	left: WebsiteBuilderLocaleItem,
	right: WebsiteBuilderLocaleItem,
): number => (left.sortOrder ?? 0) - (right.sortOrder ?? 0);

export const resolveWebsiteBuilderActiveLocales = (
	locales: WebsiteBuilderLocaleItem[],
): WebsiteBuilderLocaleDescriptor[] =>
	locales.filter((locale) => locale.status === "active").sort(bySortOrder);

export const resolveWebsiteBuilderEditableLocales = (
	locales: WebsiteBuilderLocaleItem[],
): WebsiteBuilderLocaleDescriptor[] =>
	locales
		.filter((locale) => locale.status === "active" || locale.status === "draft")
		.sort(bySortOrder);
