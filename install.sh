#!/usr/bin/env sh

cd editor

echo ===========================
echo Install the required libraries by Node.js
npm install

echo ===========================
echo Copy the Socket.io client to the required folder
mkdir public/libs
mkdir public/libs/socket.io
cp node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.min.js public/libs/socket.io/

echo ===========================
echo Downloading required JavaScript libraries
cd public/libs

echo Downloading Ace
curl --location https://github.com/downloads/ajaxorg/ace/ace-0.2.0.zip > ace.zip
unzip ace.zip
rm -r __MACOSX/
mv ace-0.2.0/src ./ace
rm -r ace-0.2.0/
rm ace.zip

echo Downloading Sencha Touch 2.0
curl --location http://cdn.sencha.io/touch/sencha-touch-2.0.0-gpl.zip > sencha.zip
unzip sencha.zip
mv sencha-touch-2.0.0-gpl/ sencha
rm sencha.zip

echo Downloading jQuery Mobile 1.0.1
curl --location http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.zip > jqm.zip
unzip jqm.zip
mv jquery.mobile-1.0.1/ jqm
rm jqm.zip

echo Downloading jQuery 1.7.1
curl --location http://code.jquery.com/jquery-1.7.1.min.js > jqm/jquery-1.7.1.min.js

echo Downloading Ext.js 4
curl --location http://cdn.sencha.io/ext-4.0.7-gpl.zip > ext.zip
unzip ext.zip
mv ext-4.0.7-gpl/ extjs
rm ext.zip

echo ===========================
echo Congratulations! The application is installed and ready to use.
echo You can now start the server by typing './launch.sh'.
echo You can add more code samples in the 'editor/public/projects' folder. 
echo Every subfolder in that folder is treated as a project, and will be 
echo automatically recognized by the app.
echo Enjoy!

