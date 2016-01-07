/*
	Copyright © 2014 — 2016 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";

g_cApp.iMaxPropertyDeepForPrintFunction = 7;
g_cApp.xasMsgGeneralTitle = g_cApp.xasAppName + ": ";


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
	if( iDeep === g_cApp.iMaxPropertyDeepForPrintFunction )
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
	g_cApp.iMaxPropertyDeepForPrintFunction = iGlobDeep;
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




	// JScript Object for store VBScript code Proxy
g_cApp.vbs = {};
g_cApp.vbs.objProxy = new ActiveXObject( "SLV.VBS.Proxy" );


/** TODO
	windows 7 & IE 11: AppActivate don`t set focus on IE prompt window

	vbscript: InputBox( Message, Title, Value )
	ie html page
	ie hta applictaion
*/


/*
		reg replace
(\w+)[, ]*
\1 = (typeof \1 === 'undefined') ? null : \1;
*/

g_cApp.vbs.prompt = function( PromptText, DefaultValue, Title, XPos, YPos, Helpfile, Context )
{
	Title = (typeof Title === 'undefined' || Title === null) ? "prompt..." : Title;
	Title = g_cApp.xasMsgGeneralTitle + Title

	/*
	DefaultValue = (typeof DefaultValue === 'undefined') ? null : DefaultValue;
	XPos = (typeof XPos === 'undefined') ? null : XPos;
	YPos = (typeof YPos === 'undefined') ? null : YPos;
	Helpfile = (typeof Helpfile === 'undefined') ? null : Helpfile;
	Context = (typeof Context === 'undefined') ? null : Context;
	*/


	var mRes = g_cApp.vbs.objProxy.inner_hidden_prompt( PromptText, Title, DefaultValue, XPos, YPos, Helpfile, Context );
	if( typeof mRes === "undefined" )
	{
		return null;
	}
	return mRes;
};

//var g_tst = new ActiveXObject( "InputDlg.Dialog" );
//echo( g_tst.InputBox( "==mes==", "==title==", "@" ) );



g_cApp.cacheRegExp = {};
	// https://gist.github.com/dperini/729294
g_cApp.cacheRegExp.url = new RegExp
(
"^" +
	// protocol identifier
	"(?:(?:https?|ftps?)://)" +
	// user:pass authentication
	"(?:\\S+(?::\\S*)?@)?" +
	"(?:" +
		// IP address exclusion
		// private & local networks
		"(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
		"(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
		"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
		// IP address dotted notation octets
		// excludes loopback network 0.0.0.0
		// excludes reserved space >= 224.0.0.0
		// excludes network & broacast addresses
		// (first & last IP address of each class)
		"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
		"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
		"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
	"|" +
		// host name
		"(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
		// domain name
		"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
		// TLD identifier
		"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
		// TLD may end with dot
		"\\.?" +
	")" +
	// port number
	"(?::\\d{2,5})?" +
	// resource path
	"(?:[/?#]\\S*)?" +
"$", "i"
);



// A helper function to view a prompt window
function fn_exec_ie_prompt( mcData )
{
	mcData.xcOut_val = null;


/*
	return false;
	var oIE = g_ws.CreateObject( "InternetExplorer.Application" );
	oIE.navigate( "about:blank" );
	oIE.Visible = 0;
	oIE.Document.title = mcData.xasCaption;

	while( oIE.Busy )
	{
		g_ws.sleep( 50 );
	}
	g_ws.sleep( 50 );


	//print_recursive_property( oIE );
	var obj = oIE.Document.Script;

	//g_sh.AppActivate( "iexplore.exe" );
	//g_sh.AppActivate( "Internet Explorer" );
	//g_sh.AppActivate( oIE.Document.title );
	//g_sh.AppActivate( "Microsoft Internet Explorer" );
	//g_sh.AppActivate( "Запрос пользователю" );

	mcData.xcOut_val = obj.prompt( mcData.xasCaption, mcData.xcIn_val );
//	mcData.xcOut_val = null;
	oIE.Quit();
*/



	mcData.xcOut_val = g_cApp.vbs.prompt( mcData.xasCaption, mcData.xcIn_val );

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
				// /^(https?|ftps?):\/\/.+$/;
			masRegExp = g_cApp.cacheRegExp.url;
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
