/*
	Copyright © 2014 — 2015 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";

//var myComp = new ActiveXObject("new:{5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1}");
//var myComp = new ActiveXObject("{5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1}");
//var myComp = new ActiveXObject("5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1");

var g_cJSImport = new ActiveXObject( "SLV.JS.Import" );

var masImp;
//masImp = g_cJSImport.fn_import( "utils exec" );
//masImp = g_cJSImport.fn_import( "" );
masImp = g_cJSImport.fn_import();

eval( masImp );
//echo( masImp );
masImp = null;

dbg_echo( 'Windows-1251: Ïðèâåò, Ìèð!',
		'UTF-8: ÐŸÑ€Ð¸Ð²ÐµÑ‚, ÐœÐ¸Ñ€!',
		'Test... Test... To-o-o-o-o-o-o-o Lo-o-o-o-o-ong (TL;DR)!',
		81522709 );

echo( g_cJSImport.xasOwnPath, "\n", g_cJSImport.xasLibDirPath );
