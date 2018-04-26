.PHONY: test release

test:
	npm run test

release:
ifeq ($(strip $(version)),)
	@echo "\033[31mERROR:\033[0;39m No version provided."
	@echo "\033[1;30mmake release version=1.0.0\033[0;39m"
else
	rm -rf node_modules
	npm install
	npm test
	npm version $(version)
	npm publish # to private registry
	npm publish --access=public --"@naturalatlas:registry=https://registry.npmjs.org/"
	git push origin master
	git push origin --tags
endif
