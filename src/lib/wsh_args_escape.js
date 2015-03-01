/*
	Copyright © 2014 Ч 2015 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";


function NotSupportedEscapeError( message )
{
	this.name = "NotSupportedEscapeError";
	this.message = (message || "");
}
NotSupportedEscapeError.prototype = Error.prototype;


function fn_wsh_arg_escape( masIn )
{
	var pos = 0, ind;
	var masNew = "";
	echo( masIn );
	masIn = ' ' + masIn + ' "';

	do
	{
		ind = masIn.indexOf( '"' , pos );
		if( ind === -1 )
		{
			break;
		}

		// Ќайдена двойна€ кавычка -- анализируем
		var cnt_bslashes = 0,
				reverse_ind = ind;

		do
		{
			--reverse_ind;
			if( masIn.charAt( reverse_ind ) !== '\\' )
			{
				break;
			}

			++cnt_bslashes;
		}
		while( true );

		masNew += masIn.slice( pos, ind );

//		echo( reverse_ind ); echo( cnt_bslashes );
//		echo( masNew );

		var masBSlashes = "\\".repeat( cnt_bslashes );
//		echo( masBSlashes );

		var masEscapeQuotes = '\\"';
		masNew += masBSlashes + masEscapeQuotes;

		pos = ind + 1;
	}
	while( true );

	var masRes = masNew.slice( 1, - (masEscapeQuotes.length + 1) );
//	echo( "{{" + masRes + "}}" );
	return masRes;
}


function fn_wsh_arg_smart_quote( masArg )
{
/*
сделать escaping по налогии с "function fn_exec_arg_escape( masIn )".
Ќапример, последовательность "@`!'" замен€ет один символ '"', если така€ последовательность
есть внутри строки, то перед нею удваиваетс€ количество backslash, если они есть, плюс ещЄ один добавл€етс€,
чтобы было нечЄтное кол-во дл€ корректного преобразовани€ значени€ параметров в исходное сосото€ние
*/

	if( /[\"]/.test( masArg ) === true )
	{
/*
	@@@ —сылки на темы, где обсуждаетс€ убогость WSH по разбору аргументов командной строки.
		ј именно, что нет стандартоного механизма передать двойную ковычку в аргументах...

?? Passing Double-Quotes on the Command Line ??
http://microsoft.public.scripting.vbscript.narkive.com/q7JrrkG7/passing-double-quotes-on-the-command-line#post12
Passing an argument which includes double quotes to wscript.echo: vbscript, wscript.echo, windows
http://www.experts-exchange.com/Programming/Languages/Visual_Basic/VB_Script/Q_25765595.html
Embedding Double Quotes in the Command | Scripting content from Windows IT Pro
http://windowsitpro.com/scripting/embedding-double-quotes-command

	@@@ PowerShell тоже вышел убогим с escaping`ом спецсимволов...
windows - Stripping double quotes from command line arguments in PowerShell - Stack Overflow
http://stackoverflow.com/questions/6714165/stripping-double-quotes-from-command-line-arguments-in-powershell#comment14237655_6714242
	 It says 'closed as fixed' but there's no link to the fix or how to use it. This sucks. Ц  Colonel Panic Jun 6 '12 at 15:10

Executing commands which require quotes and variables is practically impossible | Microsoft Connect
https://connect.microsoft.com/PowerShell/feedback/details/376207/executing-commands-which-require-quotes-and-variables-is-practically-impossible
*/

		throw new NotSupportedEscapeError( "Double quote escaping for wsh-core not supported!" );
	}



	if( /[ \t\n\v]/.test( masArg ) === true )
	{
		// нужно преобразовывать
		return '"' + fn_wsh_arg_escape( masArg ) + '"';
	}

	return masArg;
}


function fn_build_wsh_command( mvArgs )
{
	var iLen = mvArgs.length;
	var masExec = "";
	for( i = 0; i < iLen; i++ )
	{
		masExec += fn_wsh_arg_smart_quote( mvArgs[ i ] );
		masExec += " ";
	}
//	echo( masExec );

	return masExec;
}


function fn_exec_wsh_process( mvArgs )
{
	return g_sh.Exec( fn_build_wsh_command( mvArgs ) );
}


function fn_run_wsh_process( mvArgs, iWinStyle, bWait )
{
	iWinStyle = ( iWinStyle || 1 );
	bWait = ( bWait || false );

	return g_sh.Run( fn_build_wsh_command( mvArgs ), iWinStyle, bWait );
}
