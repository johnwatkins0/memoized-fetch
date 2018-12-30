module.exports = {
	moduleDirectories: ["node_modules", "src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.(js|jsx)?$": "babel-jest"
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	moduleFileExtensions: ["ts", "js"],
	collectCoverage: true,
	cache: false,
	globals: {
		fetch: (input, init) =>
			new Promise((resolve, reject) => {
				if (input === "bad-url") {
					reject("fetch error");
					return;
				}

				const time = new Date();
				resolve({
					json: () =>
						new Promise(resolve => {
							resolve({ input, init, time });
						})
				});
			})
	}
};
