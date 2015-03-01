/*
	Copyright © 2014 — 2015 Svyatoslav Skriplyonok. All rights reserved.
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3
	License: https://github.com/simvesel/wsh-lib/blob/master/LICENSE
*/


"use strict";

//echo( "json-cfg import!" );

(function(){

var app = fn_get_app_instance();
var masInstallPath = app.xasInstallDirPath;
var masAppName = app.xasAppName;

/*
	Возьмём из глобального объекта текущий путь и путь к скрипту.

	Сначала в текущем каталоге ищутся настройки, а потом в каталоге со скриптом.
	Возвращается объект с настройками.
*/
app.load_json_cfg = function( masFilename )
{
	var mcObj;

	if( typeof masFilename === 'undefined' )
	{
		masFilename = masAppName;
	}

	masFilename += ".json";
	if( g_fso.FileExists( masFilename ) )
	{
		var masStr = general_inc( masFilename );
		return JSON.parse( masStr );
	}
	else
	{
		var masStr = general_inc( masInstallPath + masFilename );
		return JSON.parse( masStr );
	}
}

/*
прочитать в текущем каталоге
прочитать в %HOME_CFG%
прочитать в указанном каталоге

* загружать то, что передано в функцию ...
* загружать из текущего активного каталога, домашнего каталога,
		а потом из общего хранилища настроек (первое же нахождение
		останавливает дальнейший поиск)

*/

}());