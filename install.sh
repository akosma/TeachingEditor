#!/usr/bin/env sh

cd editor

echo ===========================
echo Install the required libraries by Node.js
npm install

echo ===========================
echo Copy the Socket.io client to the required folder
mkdir public/libs
mkdir public/libs/ace
mkdir public/libs/extjs
mkdir public/libs/jqm
mkdir public/libs/sencha
mkdir public/libs/socket.io
cp node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js public/libs/socket.io/

echo ===========================
echo You should download now the following libraries, to be installed in their
echo required directories, specified after the arrow:
echo - Ace http://ace.ajax.org/ -> ace
echo - Ext.js http://www.sencha.com/products/extjs/ -> extjs
echo - jQuery Mobile http://jquerymobile.com/ -> jqm
echo - Sencha Touch 2.0 http://www.sencha.com/products/touch -> sencha

