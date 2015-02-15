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

		// Найдена двойная кавычка -- анализируем
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
Например, последовательность "@`!'" заменяет один символ '"', если такая последовательность
есть внутри строки, то перед нею удваивается количество backslash, если они есть, плюс ещё один добавляется,
чтобы было нечётное кол-во для корректного преобразования значения параметров в исходное сосотояние
*/

	if( /[\"]/.test( masArg ) === true )
	{
		throw new NotSupportedEscapeError( "Double quotes escaping for wsh-core not supported!" );
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
