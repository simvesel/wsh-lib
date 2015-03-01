/*
	Copyright © 2014 — 2015 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";

/*
	Функция сделана по мотивам этих документов:
	*) Everyone quotes command line arguments the wrong way - Twisty Little Passages, All Alike - Site Home - MSDN Blogs
			http://blogs.msdn.com/b/twistylittlepassagesallalike/archive/2011/04/23/everyone-quotes-arguments-the-wrong-way.aspx?Redirected=true
	*) Parsing C++ Command-Line Arguments (C++)
			http://msdn.microsoft.com/en-us/library/17w5ykft%28v=vs.85%29.aspx

	API просто жесть... Шёл 2015 год, а они так и не додумались сделать API так,
	чтобы прикладные программисты не могли неправильно вызывать дочерние процессы.
	Подсмотрели бы уже у Linux, как они сделали API по созданию процессов.
	Например, интерфейсы системных функций: execv, execve
*/
function fn_exec_arg_escape( masIn )
{
	var pos = 0, ind;
	var masNew = "";
	echo( masIn );

// Изменяем данные в строке, чтобы был проще алгоритм по преобразованию:
// в конце строки нужны пробел и двойная ковычка, чтобы через slice выбирался и конец строки
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

//	dbg_echo( masRes );
	return masRes;
}


function fn_exec_arg_smart_quote( masArg )
{
	if( /[ \t\n\v\"]/.test( masArg ) === true )
	{
		// нужно преобразовывать
		return '"' + fn_exec_arg_escape( masArg ) + '"';
	}

	return masArg;
}


function fn_build_command( mvArgs )
{
	var iLen = mvArgs.length;
	var masExec = "";
	for( i = 0; i < iLen; i++ )
	{
		masExec += fn_exec_arg_smart_quote( mvArgs[ i ] );
		masExec += " ";
	}
//	echo( masExec );

	return masExec;
}


function fn_exec_process( mvArgs )
{
	return g_sh.Exec( fn_build_command( mvArgs ) );
}


function fn_run_process( mvArgs, iWinStyle, bWait )
{
	iWinStyle = ( iWinStyle || 1 );
	bWait = ( bWait || false );

	return g_sh.Run( fn_build_command( mvArgs ), iWinStyle, bWait );
}
