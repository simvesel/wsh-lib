"use strict";

//var myComp = new ActiveXObject("new:{5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1}");
//var myComp = new ActiveXObject("{5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1}");
//var myComp = new ActiveXObject("5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1");

var g_cJSImport = new ActiveXObject("SLV.JS.Import");

eval( g_cJSImport.fn_import( "utils exec" ) );
echo( g_cJSImport.xasOwnPath, g_cJSImport.xasLibDirPath );

echo( 'Windows-1251: Привет, Мир!',
		'UTF-8: РџСЂРёРІРµС‚, РњРёСЂ!',
		'Test... Test... To-o-o-o-o-o-o-o Lo-o-o-o-o-ong (TL;DR)!',
		81522709 );
