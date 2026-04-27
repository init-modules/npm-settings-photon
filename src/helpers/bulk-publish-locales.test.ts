import assert from "node:assert/strict";
import test from "node:test";
import {
	applyPhotonBulkPublish,
	getPublishablePhotonLocales,
} from "./bulk-publish-locales.js";

const locale = (
	code: string,
	status: "active" | "draft" | "inactive",
	isDefault = false,
) => ({
	code,
	label: code.toUpperCase(),
	status,
	isDefault,
	sortOrder: 0,
});

test("getPublishablePhotonLocales returns only drafts", () => {
	const result = getPublishablePhotonLocales([
		locale("en", "active", true),
		locale("ru", "draft"),
		locale("de", "draft"),
		locale("fr", "inactive"),
	]);
	assert.equal(result.length, 2);
	assert.deepEqual(
		result.map((r) => r.code),
		["ru", "de"],
	);
});

test("applyPhotonBulkPublish flips selected drafts to active", () => {
	const before = [
		locale("en", "active", true),
		locale("ru", "draft"),
		locale("de", "draft"),
	];
	const { nextLocales, publishedCodes, skippedCodes } = applyPhotonBulkPublish(
		before,
		["ru", "de"],
	);
	assert.deepEqual(publishedCodes, ["ru", "de"]);
	assert.deepEqual(skippedCodes, []);
	assert.equal(nextLocales.find((l) => l.code === "ru")!.status, "active");
	assert.equal(nextLocales.find((l) => l.code === "de")!.status, "active");
});

test("applyPhotonBulkPublish skips codes that are already active", () => {
	const { publishedCodes, skippedCodes } = applyPhotonBulkPublish(
		[locale("en", "active", true), locale("ru", "active")],
		["ru"],
	);
	assert.deepEqual(publishedCodes, []);
	assert.deepEqual(skippedCodes, ["ru"]);
});

test("applyPhotonBulkPublish skips inactive locales", () => {
	const { publishedCodes, skippedCodes } = applyPhotonBulkPublish(
		[locale("en", "active", true), locale("de", "inactive")],
		["de"],
	);
	assert.deepEqual(publishedCodes, []);
	assert.deepEqual(skippedCodes, ["de"]);
});

test("applyPhotonBulkPublish reports unknown codes", () => {
	const { skippedCodes } = applyPhotonBulkPublish(
		[locale("en", "active", true)],
		["xx"],
	);
	assert.deepEqual(skippedCodes, ["xx"]);
});

test("applyPhotonBulkPublish leaves untouched codes alone", () => {
	const before = [
		locale("en", "active", true),
		locale("ru", "draft"),
		locale("de", "draft"),
	];
	const { nextLocales } = applyPhotonBulkPublish(before, ["ru"]);
	assert.equal(nextLocales.find((l) => l.code === "de")!.status, "draft");
});
