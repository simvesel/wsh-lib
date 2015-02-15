"use strict";

//var myComp = new ActiveXObject("new:{5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1}");
//var myComp = new ActiveXObject("{5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1}");
//var myComp = new ActiveXObject("5183B7A6-9D7D-4ED7-8CF7-48E832C8DAD1");

var myComp = new ActiveXObject("SLV.JS.Import");

eval( myComp.getSourceCode() );
//g_ws.Echo( myComp.getSourceCode() );
//var masType = typeof myComp.getSourceCode();
//g_ws.Echo( masType );

g_ws.Echo( myComp.xasOwnPath, myComp.xasLibDirPath );

/*
import alias;
import sysutils;
import extended_string;

import=alias;
import=sysutils;
*/

eval( g_inc( "func_alias.js" ) );
echo( 'pi-i-ip!', 'egerg', 81522709 );

eval( g_inc( "sys_utils.js" ) );
