import memoizedFetch, { memosMatch, getCachedMemos, makeMemoizedFetch, isSupportedMemoType } from "../index";

const wait = () => new Promise(resolve => setTimeout(resolve, 25));

describe("isSupportedMemoType", () => {
	it("correctly checks type support", () => {
		expect(isSupportedMemoType(1)).toBeTruthy();
		expect(isSupportedMemoType(-1)).toBeTruthy();
		expect(isSupportedMemoType(0)).toBeTruthy();
		expect(isSupportedMemoType(-0)).toBeTruthy();
		expect(isSupportedMemoType("string")).toBeTruthy();
		expect(isSupportedMemoType(true)).toBeTruthy();
		expect(isSupportedMemoType(false)).toBeTruthy();
		expect(isSupportedMemoType({})).toBeFalsy();
		expect(isSupportedMemoType([])).toBeFalsy();
		expect(isSupportedMemoType((): any => null)).toBeFalsy();
	});
});

describe("memosMatch", () => {
	it("matches correctly", () => {
		expect(memosMatch(undefined, undefined)).toBeTruthy();
		expect(memosMatch(undefined, 1)).toBeFalsy();
		expect(memosMatch(1, 1)).toBeTruthy();
		expect(memosMatch(1, [1])).toBeTruthy();
		expect(memosMatch(1, [1, 2])).toBeFalsy();
		expect(() => memosMatch({ some: "object" }, { some: "object" })).toThrow();
		const someObject = { some: "object" };
		expect(() => memosMatch(someObject, someObject)).toThrow();
		expect(() => memosMatch(someObject, { ...someObject })).toThrow();
		expect(() => memosMatch([[]], [[]])).toThrow();
		const emptyArray: any[] = [];
		expect(() => memosMatch([emptyArray], [emptyArray])).toBeTruthy();
	});
});

describe("memoizedFetch", () => {
	it("can fetch normally", async () => {
		const response = await memoizedFetch("myurl", {});
		expect(response.input).toEqual("myurl");
		expect(response.init).toEqual({});
	});

	it("memoizes fetch", async () => {
		const response = await memoizedFetch("myurl", {});
		const response2 = await memoizedFetch("myurl");

		expect(response).toEqual(response2);
		expect(getCachedMemos()).toMatchObject({});
	});

	it("can handle an error", async () => {
		let response;
		try {
			response = await memoizedFetch("bad-url", {});
		} catch (e) {
			response = e;
		}

		expect(response).toEqual("fetch error");
	});

	it("busts cache with a third parameter", async () => {
		let response, response2;

		response = await memoizedFetch("myurl", {});

		await wait();
		response2 = await memoizedFetch("myurl", {}, 1);
		expect(response.time).not.toEqual(response2.time);

		await wait();
		response = await memoizedFetch("myurl", {}, 1);
		expect(response.time).toEqual(response2.time);

		await wait();
		response2 = await memoizedFetch("myurl", {}, 2);
		expect(response).not.toEqual(response2);

		await wait();
		response = await memoizedFetch("myurl", {}, [2, 3]);
		expect(response).not.toEqual(response2);
	});

	it("can have separate instances", async () => {
		const differentInstance = makeMemoizedFetch();
		const response = await differentInstance("myurl", {});
		expect(response.input).toEqual("myurl");
	});
});
