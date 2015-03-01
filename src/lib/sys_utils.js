/*
	Copyright © 2014 — 2015 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";

var g_iMaxPropertyDeepForPrintFunction = 7;


String.prototype.repeat = function( miTimes )
{
	for( var e = ''; e.length < miTimes; )
	{
		e += this;
	}
	return e;
};


function recursive_property( obj, masPath, iDeep )
{
	if( iDeep === g_iMaxPropertyDeepForPrintFunction )
		return masPath + "\n\tToo large object...";

	var masCurr = masPath;
//	if( Object.prototype.toString.call( obj ) === '[object Object]' )
	if( obj !== null && typeof obj !== 'undefined' )
	{
		for( var key in obj )
		{
			var mcVal = obj[ key ];
			if( typeof mcVal === 'string' )
			{
				masPath += '\n"' + key + '":"' + mcVal + '"';
			}
			else if( typeof mcVal === 'function' )
			{
				masPath += '\n"' + key + '":\tFUNCTION';
			}
			else if( typeof mcVal !== 'object' || mcVal === null )
			{
				masPath += '\n"' + key + '":\t' + mcVal;
			}
			else
			{
				++iDeep;
				masPath += "\n" + recursive_property( mcVal, masCurr + "." + key, iDeep );
				masPath += "\n" + masCurr;
			}
		}
	}

	return masPath;
}

function print_recursive_property( mcObj, iGlobDeep )
{
	iGlobDeep = iGlobDeep || 7;
	g_iMaxPropertyDeepForPrintFunction = iGlobDeep;
	return echo( recursive_property( mcObj, "_ROOT_", 0 ) );
}


function fn_try_catch( fn_name )
{
	try
	{
//		echo( "size input args", arguments[1], arguments[4] );
		var mvArgs = [];
		if( arguments.length > 1 )
		{
			var i = arguments.length - 2;
			do
			{
			  mvArgs[ i ] = arguments[ i+1 ];
			}
			while( i-- > 0 );
//			echo( "mvArgs", mvArgs );
		}
		return fn_name.apply( g_cGlobal, mvArgs );
	}
	catch( mcEx )
	{
		print_recursive_property( mcEx );
	}
}


// A helper function to view a prompt window
function fn_exec_ie_prompt( mcData )
{
	mcData.xcOut_val = null;

	var oIE = g_ws.CreateObject( "InternetExplorer.Application" );
	oIE.Visible = 0;
	oIE.navigate( "about:blank" );
	oIE.Document.title = mcData.xasCaption;

	while( oIE.Busy )
	{
		g_ws.sleep( 100 );
	}
	g_ws.sleep( 150 );

//	print_recursive_property( oIE );

//	g_sh.AppActivate( "iexplore.exe" );
	g_sh.AppActivate ("Internet Explorer")

	var obj = oIE.Document.Script;
	mcData.xcOut_val = obj.prompt( mcData.xasCaption, mcData.xcIn_val );
//	mcData.xcOut_val = null;
	oIE.Quit();

	if( mcData.xcOut_val === null )
	{
		return false;
	}

	if( typeof mcData.xcOut_val !== 'string' )
	{
		mcData.xcOut_val = "" + mcData.xcOut_val;
	}

	if( typeof mcData.xasValidRule === 'undefined' )
	{
		mcData.xasValidRule = "";
	}

	var masRegExp;
	switch( mcData.xasValidRule )
	{
		case 'dec':
		case 'num':
			mcData.xcOut_val = parseFloat( mcData.xcOut_val );
		return true;

		case 'nat':
			masRegExp = /^[1-9]\d*$/;
		break;

		case 'int':
			masRegExp = /^(\+|-)?\d+$/;
		break;

		case 'url':
			masRegExp = /^(https?|ftps?):\/\/.+$/;
		break;


		default:
		{
			if( mcData.xasValidRule.length === 0 )
			{
				masRegExp = /^.*$/;
			}
			else
			{
				masRegExp = new RegExp( mcData.xasValidRule );
			}
		}
	}

//	throw new Error( 69, "Value incorrect \"" + masRegExp.toString() + "\"" );
//	echo( "BEFORE: masRegExp.test( mcData.xcOut_val );" );

//	print_recursive_property( masRegExp );
//	var mmm = masRegExp.test( mcData.xcOut_val );
//	echo( "BEFORE: return mmm;" );
//	return mmm;

	return masRegExp.test( mcData.xcOut_val );
}

function g_validation_prompt( mcData )
{
	try
	{
		return fn_exec_ie_prompt( mcData );
	}
	catch( err )
	{
		mcData.xcErr = err;
		return false;
	}
}
