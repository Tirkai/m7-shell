PROJECT_NAME = $(shell cat package.json | grep name | head -1 | awk -F: '{ print $$2 }' | sed 's/[",]//g')
# if 'v' variable exists, VERSION=v, else get from package.json
VERSION = $(or $(v), $(shell cat package.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[",]//g'))

all:
	@echo "make clean-build		- Remove useless build files"
	@echo "make clean-deb			- Remove useless deb files"
	@echo "make clean			- Remove useless files"
	@echo "make install			- Install all npm dependency packages"
	@echo "make build			- Build project to folder 'build'"
	@echo "make deb [v=<version>]		- Create deb package from source"
	@echo "make package [v=<version>]	- Create deb package"
	@echo "make version			- Show version info"
	@exit 0

clean-build:
	rm -rf ./build

clean-deb:
	rm -rf ./deb/*.deb
	rm -rf ./deb/debinstall/opt/

clean: clean-build clean-deb

install:
	npm install

build: clean-build install
	grunt release

deb: clean-deb
	bash deb/build.sh $(VERSION)

package: clean install build deb

version:
	@echo $(PROJECT_NAME) $(VERSION)
	@exit 0


.PHONY: all clean-build clean-deb clean install build deb package
