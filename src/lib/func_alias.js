/*
	Copyright © 2014 — 2015 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";

var g_undef = undefined;
var g_cGlobal = (1,eval)('this');


function echo()
{
	var mas = "";
	var iLen = arguments.length;

	switch( iLen )
	{
		case 0:
			mas = g_undef;
		break;

		default:
		{
			var i = 0;
			for( ; i < iLen; i++ )
			{
				mas += arguments[ i ];
			}
		}
	}

	return g_ws.Echo( mas );
}

function dbg_echo()
{
	var mArgv = [];
	var iLen = arguments.length;

	switch( iLen )
	{
		case 0:
		break;

		default:
		{
			var i = 0;
			for( ; i < iLen; i++ )
			{
				mArgv.push( "{{" );
				mArgv.push( arguments[ i ] );
				mArgv.push( "}}\n" );
			}
		}
	}

//	echo( iLen, "\n", mArgv );
	return g_cGlobal.echo.apply( g_cGlobal, mArgv );
}


function exit( iRetCode )
{
	return g_ws.Quit( iRetCode );
}

function quit( iRetCode )
{
	return exit( iRetCode );
}
