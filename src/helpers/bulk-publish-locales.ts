import type { PhotonLocaleDescriptor } from "@init/photon/public";

export interface PhotonPublishableLocaleEntry {
	code: string;
	label: string;
	currentStatus: PhotonLocaleDescriptor["status"];
}

/**
 * Return the list of locales that bulk-publish would touch. By spec
 * (LOCALE_V1 §1.2 → option B): "everything in draft".
 */
export const getPublishablePhotonLocales = (
	locales: readonly PhotonLocaleDescriptor[],
): PhotonPublishableLocaleEntry[] =>
	locales
		.filter((locale) => locale.status === "draft")
		.map((locale) => ({
			code: locale.code,
			label: locale.label,
			currentStatus: locale.status,
		}));

export interface ApplyPhotonBulkPublishResult {
	nextLocales: PhotonLocaleDescriptor[];
	publishedCodes: string[];
	skippedCodes: string[];
}

/**
 * Pure helper: flip the chosen codes from `draft` to `active`. Codes that
 * aren't actually in `draft` (already active, missing, or inactive) are
 * skipped and reported under `skippedCodes`. Caller is responsible for
 * persisting the returned locale array.
 */
export const applyPhotonBulkPublish = (
	locales: readonly PhotonLocaleDescriptor[],
	codes: readonly string[],
): ApplyPhotonBulkPublishResult => {
	const codeSet = new Set(codes);
	const publishedCodes: string[] = [];
	const skippedCodes: string[] = [];

	const nextLocales = locales.map((locale) => {
		if (!codeSet.has(locale.code)) {
			return locale;
		}
		if (locale.status !== "draft") {
			skippedCodes.push(locale.code);
			return locale;
		}
		publishedCodes.push(locale.code);
		return { ...locale, status: "active" as const };
	});

	for (const code of codes) {
		if (
			!locales.some((l) => l.code === code) &&
			!skippedCodes.includes(code)
		) {
			skippedCodes.push(code);
		}
	}

	return { nextLocales, publishedCodes, skippedCodes };
};
