/*
	Copyright � 2014 � 2015 Svyatoslav Skriplyonok. All rights reserved.
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
	������ �� ����������� ������� ������� ���� � ���� � �������.

	������� � ������� �������� ������ ���������, � ����� � �������� �� ��������.
	������������ ������ � �����������.
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
��������� � ������� ��������
��������� � %HOME_CFG%
��������� � ��������� ��������

* ��������� ��, ��� �������� � ������� ...
* ��������� �� �������� ��������� ��������, ��������� ��������,
		� ����� �� ������ ��������� �������� (������ �� ����������
		������������� ���������� �����)

*/

}());