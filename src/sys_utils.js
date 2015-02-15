"use strict";
var global = (1,eval)('this'),
		g_iMaxPropertyDeepForPrintFunction = 7;


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
			if( typeof mcVal === "object" )
			{
				++iDeep;
				masPath += "\n" + recursive_property( mcVal, masPath + "." + key, iDeep );
				masPath += "\n" + masCurr;
			}
			else if ( typeof mcVal !== "function" )
			{
				masPath += '\n"' + key + '":"' + mcVal + '"';
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
			var i = arguments.length-1;
			while( i-- ) mvArgs[ i ] = arguments[ i+1 ];
//			echo( "mvArgs", mvArgs );
		}
		return fn_name.apply( global, mvArgs );
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


	while( oIE.Busy )
	{
		g_ws.sleep( 30 );
	}

//	print_recursive_property( oIE );

	var obj = oIE.Document.Script;
//	g_sh.AppActivate( "iexplore.exe" );
	g_sh.AppActivate ("Internet Explorer")
	mcData.xcOut_val = obj.prompt( mcData.xasCaption, mcData.xcIn_val );
	oIE.Quit();

	if( typeof mcData.xasValidRule === 'undefined' )
	{
		mcData.xasValidRule = "";
	}

	if( typeof mcData.xcOut_val !== 'string' )
	{
		mcData.xcOut_val = "" + mcData.xcOut_val;
	}

	var masRegExp;
	switch( mcData.xasValidRule )
	{
		case 'dec':
		case 'num':
			mcData.xcOut_val = parseFloat( mcData.xcOut_val );
		return true;

		case 'nat':
//			masRegExp = /^\d+$/;
			masRegExp = /^[1-9][0-9]*$/;
		break;

		case 'int':
			masRegExp = /^(\+|-)?\d+$/;
		break;

		default:
			masRegExp = /^.*$/;
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
