import assert from "node:assert/strict";
import test from "node:test";
import {
	PHOTON_LOCALE_CODE_PATTERN,
	PHOTON_LOCALE_STATUSES,
	canDeletePhotonLocale,
	normalizePhotonLocaleCode,
	normalizePhotonLocaleItem,
	normalizePhotonLocaleItems,
	resolvePhotonActiveLocales,
	resolvePhotonEditableLocales,
	validatePhotonLocaleCode,
} from "./locales.js";

test("PHOTON_LOCALE_CODE_PATTERN matches valid codes", () => {
	assert.ok(PHOTON_LOCALE_CODE_PATTERN.test("en"));
	assert.ok(PHOTON_LOCALE_CODE_PATTERN.test("ru"));
	assert.ok(PHOTON_LOCALE_CODE_PATTERN.test("de"));
	assert.ok(PHOTON_LOCALE_CODE_PATTERN.test("en_us"));
	assert.ok(PHOTON_LOCALE_CODE_PATTERN.test("zh_hans"));
	assert.ok(PHOTON_LOCALE_CODE_PATTERN.test("ar_ae"));
});

test("PHOTON_LOCALE_CODE_PATTERN rejects invalid codes", () => {
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test("EN"));
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test("en-us"));
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test("eng"));
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test("e"));
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test(""));
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test("en_"));
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test("_us"));
	assert.ok(!PHOTON_LOCALE_CODE_PATTERN.test("123"));
});

test("validatePhotonLocaleCode validates codes", () => {
	assert.ok(validatePhotonLocaleCode("en"));
	assert.ok(validatePhotonLocaleCode("ru"));
	assert.ok(validatePhotonLocaleCode("en_us"));
	assert.ok(!validatePhotonLocaleCode("EN"));
	assert.ok(!validatePhotonLocaleCode("en-us"));
	assert.ok(!validatePhotonLocaleCode("xyz"));
});

test("normalizePhotonLocaleCode normalises input", () => {
	assert.equal(normalizePhotonLocaleCode("EN"), "en");
	assert.equal(normalizePhotonLocaleCode("en-US"), "en_us");
	assert.equal(normalizePhotonLocaleCode("  ru  "), "ru");
	assert.equal(normalizePhotonLocaleCode("ZH-HANS"), "zh_hans");
});

test("normalizePhotonLocaleItem creates valid item from input", () => {
	const item = normalizePhotonLocaleItem({
		code: "en",
		label: "English",
		status: "active",
		isDefault: true,
		sortOrder: 0,
	});
	assert.deepEqual(item, {
		code: "en",
		label: "English",
		status: "active",
		isDefault: true,
		sortOrder: 0,
	});
});

test("normalizePhotonLocaleItem fills defaults", () => {
	const item = normalizePhotonLocaleItem({
		code: "ru",
	});
	assert.equal(item.code, "ru");
	assert.equal(item.label, "RU");
	assert.equal(item.status, "active");
	assert.equal(item.isDefault, false);
	assert.equal(item.sortOrder, 0);
});

test("normalizePhotonLocaleItem uses fallback for missing code", () => {
	const item = normalizePhotonLocaleItem({
		label: "Default",
	});
	assert.equal(item.code, "ru");
});

test("normalizePhotonLocaleItem normalises code", () => {
	const item = normalizePhotonLocaleItem({
		code: "EN-US",
	});
	assert.equal(item.code, "en_us");
});

test("normalizePhotonLocaleItem handles null input", () => {
	const item = normalizePhotonLocaleItem(null);
	assert.equal(item.code, "ru");
	assert.equal(item.status, "active");
});

test("normalizePhotonLocaleItems handles array input", () => {
	const items = normalizePhotonLocaleItems([
		{ code: "en", label: "EN" },
		{ code: "ru", label: "RU" },
	]);
	assert.equal(items.length, 2);
	assert.equal(items[0].code, "en");
	assert.equal(items[1].code, "ru");
});

test("normalizePhotonLocaleItems handles non-array input", () => {
	const items = normalizePhotonLocaleItems("en");
	assert.equal(items.length, 1);
	assert.equal(items[0].code, "en");
	assert.equal(items[0].isDefault, true);
});

test("normalizePhotonLocaleItems returns array with default when input is empty", () => {
	const items = normalizePhotonLocaleItems(undefined);
	assert.equal(items.length, 1);
	assert.equal(items[0].code, "ru");
	assert.equal(items[0].isDefault, true);
});

test("resolvePhotonActiveLocales filters active locales", () => {
	const locales = [
		{ code: "en", label: "EN", status: "active" as const, sortOrder: 0 },
		{ code: "ru", label: "RU", status: "draft" as const, sortOrder: 1 },
		{ code: "de", label: "DE", status: "active" as const, sortOrder: 2 },
		{ code: "fr", label: "FR", status: "inactive" as const, sortOrder: 3 },
	];
	const active = resolvePhotonActiveLocales(locales);
	assert.equal(active.length, 2);
	assert.equal(active[0].code, "en");
	assert.equal(active[1].code, "de");
});

test("resolvePhotonActiveLocales sorts by sortOrder", () => {
	const locales = [
		{ code: "en", label: "EN", status: "active" as const, sortOrder: 2 },
		{ code: "ru", label: "RU", status: "active" as const, sortOrder: 0 },
		{ code: "de", label: "DE", status: "active" as const, sortOrder: 1 },
	];
	const active = resolvePhotonActiveLocales(locales);
	assert.equal(active[0].code, "ru");
	assert.equal(active[1].code, "de");
	assert.equal(active[2].code, "en");
});

test("resolvePhotonEditableLocales includes active and draft", () => {
	const locales = [
		{ code: "en", label: "EN", status: "active" as const, sortOrder: 0 },
		{ code: "ru", label: "RU", status: "draft" as const, sortOrder: 1 },
		{ code: "de", label: "DE", status: "inactive" as const, sortOrder: 2 },
	];
	const editable = resolvePhotonEditableLocales(locales);
	assert.equal(editable.length, 2);
	assert.equal(editable[0].code, "en");
	assert.equal(editable[1].code, "ru");
});

test("resolvePhotonEditableLocales excludes inactive", () => {
	const locales = [
		{ code: "en", label: "EN", status: "active" as const, sortOrder: 0 },
		{ code: "ru", label: "RU", status: "draft" as const, sortOrder: 1 },
		{ code: "de", label: "DE", status: "inactive" as const, sortOrder: 2 },
	];
	const editable = resolvePhotonEditableLocales(locales);
	assert.equal(editable.length, 2);
	const codes = editable.map((l) => l.code);
	assert.ok(!codes.includes("de"));
});

test("normalizePhotonLocaleItems forces default locale to active", () => {
	const items = normalizePhotonLocaleItems([
		{ code: "en", label: "EN", status: "draft", isDefault: true },
		{ code: "ru", label: "RU", status: "active" },
	]);
	const en = items.find((i) => i.code === "en")!;
	assert.equal(en.isDefault, true);
	assert.equal(en.status, "active");
});

test("normalizePhotonLocaleItems collapses multiple defaults to one", () => {
	const items = normalizePhotonLocaleItems([
		{ code: "en", label: "EN", status: "active", isDefault: true },
		{ code: "ru", label: "RU", status: "active", isDefault: true },
	]);
	const defaults = items.filter((i) => i.isDefault);
	assert.equal(defaults.length, 1);
	assert.equal(defaults[0].code, "en");
});

test("normalizePhotonLocaleItems promotes first locale to default if none marked", () => {
	const items = normalizePhotonLocaleItems([
		{ code: "ru", label: "RU", status: "active" },
		{ code: "en", label: "EN", status: "active" },
	]);
	const defaults = items.filter((i) => i.isDefault);
	assert.equal(defaults.length, 1);
	assert.equal(defaults[0].code, "ru");
	assert.equal(defaults[0].status, "active");
});

test("normalizePhotonLocaleItems keeps non-default statuses untouched", () => {
	const items = normalizePhotonLocaleItems([
		{ code: "en", label: "EN", status: "active", isDefault: true },
		{ code: "ru", label: "RU", status: "draft" },
		{ code: "de", label: "DE", status: "inactive" },
	]);
	assert.equal(items.find((i) => i.code === "ru")!.status, "draft");
	assert.equal(items.find((i) => i.code === "de")!.status, "inactive");
});

test("canDeletePhotonLocale rejects default locale", () => {
	const locales = [
		{ code: "en", label: "EN", status: "active" as const, isDefault: true },
		{ code: "ru", label: "RU", status: "active" as const },
	];
	assert.equal(canDeletePhotonLocale(locales, "en"), false);
	assert.equal(canDeletePhotonLocale(locales, "ru"), true);
	assert.equal(canDeletePhotonLocale(locales, "missing"), false);
});
