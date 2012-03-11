#!/usr/bin/env sh

(node editor/app.js & open http://localhost:3000/client) | parallel

