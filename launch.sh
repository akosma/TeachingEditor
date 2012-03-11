#!/usr/bin/env sh

(node editor/app.js & open http://localhost:3000/) | parallel

# cd editor/public/projects
# rm current
# ln -s default current
# cd ../../../

