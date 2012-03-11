#!/usr/bin/env sh

cd editor/public/projects
rm current
ln -s default current
cd ../../../

(node editor/app.js & open /Applications/Teaching\ Editor.app) | parallel

