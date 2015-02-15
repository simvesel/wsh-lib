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
			for( i=0; i < arguments.length; i++ )
			{
				mas += "{{" + arguments[ i ] + "}}";
				mas += "\n";
			}
	}

	return g_ws.Echo( mas );
}


function exit( iRetCodce )
{
	return g_ws.Quit( iRetCodce );
}

function quit( iRetCodce )
{
	return exit( iRetCodce );
}
