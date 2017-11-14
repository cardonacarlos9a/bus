build:

	@echo "Building..."
	@npm install typescript-require --save-dev
	@node ./src/typescript-require/tsc.js -m commonjs -t ES5 src/index.ts --out index.js
	@echo "Done!"


.PHONY: build
