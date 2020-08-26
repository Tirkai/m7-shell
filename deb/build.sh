#!/bin/sh

NAME="m7-shell"
FILE_VERSION="$1"

if [ -z "$FILE_VERSION" ]; then
  # Should be replaced by git tag
  VERSION="1.0.0"
else
  VERSION=$FILE_VERSION
fi

SETUP_PATH="opt/algont/m7/cdn/$NAME"

echo "Project name: $NAME"
echo "Version: $VERSION"
echo "START local build"

mkdir -pv ./deb/debinstall/$SETUP_PATH/
cp -r ./dist/* ./deb/debinstall/$SETUP_PATH/

sed -i "/Version:/c\Version: $VERSION" ./deb/debinstall/DEBIAN/control

fakeroot dpkg-deb --build ./deb/debinstall ./deb/$NAME"_""$VERSION""_all.deb"
echo "FINISH local build"

sed -i "/Version:/c\Version:" ./deb/debinstall/DEBIAN/control
