/*
	Copyright © 2014 — 2016 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


/**
	!!! Available only in 32-bit mode.
		"ScriptControl"		aka "MSScriptControl.ScriptControl"
		SEE ".../coding/wsh/ScriptControl.txt"


	/// sample code...
	<script language="VBScript">
	<![CDATA[
	Function WSHInputBox( Message, Title, Value )
		' Provides an InputBox function for JScript
		' Can be called from JScript as:
		' var result = WSHInputBox( "Enter a name", "Input", test );
		WSHInputBox = InputBox( Message, Title, Value )
	End Function

	' <method name="WSHInputBox"/>
	]]>
	</script>
*/


"use strict";

var vb = {};


vb.Function = function( func )
{
	return function()
	{
		return vb.Function.eval.call( this, func, arguments );
	};
};


vb.Function.eval = function( func )
{
	var args = Array.prototype.slice.call( arguments[1] );
	for( var i = 0; i < args.length; i++ )
	{
		if ( typeof args[i] !== 'string' )
		{
			continue;
		}
		args[ i ] = '"' + args[i].replace( /"/g, '" + Chr(34) + "' ) + '"';
	}

	//var loc_sh = new ActiveXObject( "WScript.Shell" );
	//echo( "print-000...." );


	var vbe;
	// vbe = new ActiveXObject( "ScriptControl" );
	vbe = new ActiveXObject( "MSScriptControl.ScriptControl" );
	vbe.Language = "VBScript";

	return vbe.eval( func + '(' + args.join( ', ' ) + ')' );
};


/**
 *
 * InputBox(prompt[, title][, default][, xpos][, ypos][, helpfile, context])
 *
 */
var InputBox = vb.Function( 'InputBox' );


/**
 *
 * MsgBox(prompt[, buttons][, title][, helpfile, context])
 *
 */
var MsgBox = vb.Function( 'MsgBox' );
