/*
	Copyright © 2014 — 2015 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";

var g_undef = undefined;

function echo()
{
	var mas = "";
//	g_ws.Echo( arguments.length );

	var iLen = arguments.length;

	switch( iLen )
	{
		case 0:
			mas = g_undef;
		break;

		case 1:
			mas = arguments[ 0 ];
		break;

		default:
		{
			var i = 0;
			for( ; i < arguments.length; i++ )
			{
				mas += "{{" + arguments[ i ] + "}}";
				mas += "\n";
			}
		}
	}

	return g_ws.Echo( mas );
}


function exit( iRetCode )
{
	return g_ws.Quit( iRetCode );
}

function quit( iRetCode )
{
	return exit( iRetCode );
}
