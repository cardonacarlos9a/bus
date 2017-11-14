build:

	@echo "Building..."
	@npm install typescript-require --save-dev
	@cp node_modules/typescript/bin/lib.* lib/
	@ls node_modules
	@node ./src/typescript/bin/tsc.js -m commonjs -t ES5 src/index.ts --out index.js
	@echo "Done!"


.PHONY: build
