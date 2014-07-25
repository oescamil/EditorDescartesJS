/**
	 * Escapes characters in the string that are not safe to use in a RegExp.
	 * @param {*} s The string to escape. If not a string, it will be casted
	 *     to one.
	 * @return {string} A RegExp safe, escaped copy of {@code s}.
	 */
RegExp.escape = function(s) {
	return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
		replace(/\x08/g, '\\x08');
};


/**
 * Create lpad function for strings
 */

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
};


/**
 * 
 * @returns
 */
function generateDescartesEditorTestData(){
	exampleData = "<html>"+
	"<head>"+
	"	<title>ARchivo de prueba </title>"+
	'	<link href="css/dialogs.css" rel="stylesheet">'+
	'	<script src="javascript/libs/codemirror-3.16//mode/javascript/javascript.js"></script>'+
	"</head>"+
	"<body>";
	
	exampleData +=
	"<p align='center'>"+
	"\n<applet name=\"Descartes\" width=920 height=560"+
    "  code=\"Descartes.class\""+
    "  codebase=\"./\""+
    "  archive=\"lib/Descartes5.jar\""+
    "  MAYSCRIPT>"+
    "	<param name=\"size\" value=\"920x560\">"+
    "	<param name=\"pleca\" value=\"title='El t&iacute;tulo de pruebas' subtitle='Escribir el subtitulo de la unidad' subtitlines='1' bgcolor='268bea' fgcolor='036cba' align='left' titleimage='images/pleca.png' titlefont='SansSerif,BOLD,22' subtitlefont='SansSerif,PLAIN,18' \">"+
    "	<param name=\"decimal_symbol\" value=\".\">"+
    "	<param name=\"antialias\" value=\"yes\">"+
    "	<param name=\"undo\" value=\"no\">"+
    "	<param name=\"name\" value=\"Descartes\">"+
    "	<param name=\"Version\" value=\"5.107, 2013-08-17\">"+
    "	<param name=\"Language\" value=\"english\">"+
    "	<param name=\"Buttons\" value=\"about=yes config=yes init=yes clear=yes\">"+
    
    "	<param name=\"E_01\" value=\"type='R2' bg_display='topleft' net='b8c4c8' net10='889498' axes='405860' text='405860'\">"+
    "	<param name=\"E_02\" value=\"type='R2' bg_display='topleft' net='b8c4c8' net10='889498' axes='405860' text='405860' id='Sp2' x='500' y='200' width='200' height='200' O.x='-50%' O.y='-50%' \">"+
    
    "	<param name=\"C_01\" value=\"id='scale'  name='escale' type='numeric' region='north' name='zoom' value='48' incr='0.1*escala' inf='0.000001' sup='1000000' decimals='(escala&lt;0.01)+(escala&lt;0.1)+(escala&lt;1)+(escala&lt;10)+(escala&lt;100)+(escala&lt;1000)+(escala&lt;10000)+(escala&lt;100000)' fixed='yes' visible='no'\">"+
    "	<param name=\"C_02\" value=\"id='n1' name='n1' type='numeric' fixed='yes' space='Sp2'\">"+
    "	<param name=\"C_03\" value=\"id='g1' type='graphic' space='Sp2'\">"+
    "	<param name=\"C_04\" value=\"id='Ox'  name='Ox' type='numeric' fixed='yes'\">"+
    "	<param name=\"C_05\" value=\"id='n2'  name='n2'  type='numeric' fixed='yes' space='Sp2' \">"+
    "	<param name=\"C_06\" value=\"id='Oy'  name='Oy' type='numeric' fixed='yes'\">"+
    "	<param name=\"C_07\" value=\"id='n3'  name='n3' type='numeric' fixed='yes' space='Sp2'  \">"+
    "	<param name=\"C_08\" value=\"id='n4' type='numeric' gui='button' space='E1' name='n4' fixed='yes' colour='222622' int-colour='f3f8ff' bold='yes' italics='yes' underlined='yes' font size='18' action='message' parameter='A=1' parameter.font='Monospaced,BOLD,9'\">"+
    "   <param name=\"C_09\" value=\"id='test2' tipo='num&eacute;rico' interfaz='campo de texto' solo_texto='s&iacute;' regi&oacute;n='interior' espacio='E1' nombre='text2' expresi&oacute;n='(10,10,200,25)' valor='&squot;&squot;' fijo='s&iacute;' visible='s&iacute;'\">"+
    "	<param name=\"C_10\" value=\"id='test3' tipo='num&eacute;rico' interfaz='campo de texto' solo_texto='sí' región='interior' espacio='E1' nombre='text3' expresión='(10,60,200,25)' valor='&squot;Texto prueba&squot;' fijo='sí' visible='sí'\">"+
    "	<param name=\"C_11\" value=\"id='activoTXT' tipo='num&eacute;rico' interfaz='campo de texto' solo_texto='s&iacute;' regi&oacute;n='interior' espacio='Sp2' nombre='Texto' expresi&oacute;n='(activoTXT.x,activoTXT.y,100,100)' valor='&squot;&squot;' incr='1' fijo='s&iacute;' visible='s&iacute;' acci&oacute;n='calcular' par&aacute;metro='enTiempoReal=1' par&aacute;metro.fuente='Monospaced,PLAIN,12' pos_mensajes='centro'\">"+
    
    
    	
    	 
    
    "	<param name=\"A_01\" value=\"id='V3' vector='s&iacute;' evaluar='always' expresi&oacute;n='V3[0]=0;V3[1]=0;V3[2]=0'\">"+
    "	<param name=\"A_02\" value=\"id='V3_2' vector='s&iacute;' evaluar='una-sola-vez' expresi&oacute;n='V3[0]=0;V3[1]=0;V3[2]=0'\">"+
    "	<param name=\"A_03\" value=\"id='M4' matriz='s&iacute;' evaluar='una-sola-vez' expresi&oacute;n='M4[0,0]=0;M4[1,0]=0;M4[2,0]=0;M4[0,1]=0;M4[1,1]=0;M4[2,1]=0;M4[0,2]=0;M4[1,2]=0;M4[2,2]=0;'\">"+
    "	<param name=\"A_04\" value=\"id='M4_2' matriz='s&iacute;' evaluar='una-sola-vez' expresi&oacute;n='M4[0,0]=0;M4[1,0]=0;M4[2,0]=0;M4[0,1]=0;M4[1,1]=0;M4[2,1]=0;M4[0,2]=0;M4[1,2]=0;M4[2,2]=0;'\">"+
    "	<param name=\"A_05\" value=\"id='var1' expresi&oacute;n='0'\">"+
    "	<param name=\"A_06\" value=\"id='var1_2' expresi&oacute;n='0'\">"+
    "	<param name=\"A_07\" value=\"id='cons1' constante='sí' expresión='2' evaluar='una-sola-vez'\">"+
    "	<param name=\"A_08\" value=\"id='cons1_2' constante='sí' expresión='2' evaluar='una-sola-vez'\">"+
    "	<param name=\"A_09\" value=\"id='fun1(x)' expresi&oacute;n='x' dominio='[a,b]' algoritmo='s&iacute;' Local='a,b,c' inicio='x=1' hacer='sen(x)' mientras='0'\">"+
    "	<param name=\"A_10\" value=\"id='fun1_2(x)' expresi&oacute;n='x' dominio='[a,b]' algoritmo='s&iacute;' Local='a,b,c' inicio='x=1' hacer='sen(x)' mientras='0'\">"+
    
    "	<param name=\"A_11\" value=\"id='INI_0' algoritmo='s&iacute;' evaluar='una-sola-vez' hacer='x=0;y=0'\">"+
    "	<param name=\"A_12\" value=\"id='INICIO' algoritmo='s&iacute;' evaluar='una-sola-vez' hacer='x=0;y=0'\">"+
    "	<param name=\"A_13\" value=\"id='INI_1' algoritmo='s&iacute;' evaluar='una-sola-vez' hacer='x=0;y=0'\">"+
    
    "	<param name=\"A_14\" value=\"id='CAL_0' algoritmo='s&iacute;' evaluar='siempre' hacer='x=x+1;y=sen(x)'\">"+
    "	<param name=\"A_15\" value=\"id='CALCULOS' algoritmo='s&iacute;' evaluar='siempre' hacer='x=x+1;y=sen(x)'\">"+
    "	<param name=\"A_16\" value=\"id='CAL_1' algoritmo='s&iacute;' evaluar='siempre' hacer='x=x+1;y=sen(x)'\">"+
    
    "	<param name=\"G_01\" value=\"type='equation' expresi&oacute;n='y=n1*x+n3'\">"+
    "	<param name=\"G_02\" value=\"type='point' colour='blue' expresion='(t,t)' family='t' t.interval='[0,6]' t.steps='6' fixed='yes' size='4'\">"+
    
    
    "   <param name=\"Animaci&oacute;n\" value=\"pausa='100000' controles='s&iacute;' auto='s&iacute;' repetir='s&iacute;' inicio='x=2;b=3' hacer='llamadaAFuncion()' mientras='x!=2'\">"+
    "</applet>\n"+
    "</p>";
	
	
	exampleData += "<applet name=\"Descartes\" width=920 height=560"+
    " code=\"Descartes.class\""+
    " codebase=\"./\""+
    " archive=\"lib/Descartes5.jar\""+
    " MAYSCRIPT>"+
"<param name=\"size\" value=\"920x560\">"+
"<param name=\"pleca\" value=\"title='El t&iacute;tulo de pruebas' subtitle='Escribir el subtitulo de la unidad' subtitlines='1' bgcolor='268bea' fgcolor='036cba' align='x' titleimage='images/pleca.png' titlefont='SansSerif,BOLD,22' subtitlefont='SansSerif,PLAIN,18' \">"+
"<param name=\"decimal_symbol\" value=\".\">"+
"<param name=\"antialias\" value=\"yes\">"+
"<param name=\"undo\" value=\"no\">"+
"<param name=\"name\" value=\"Descartes\">"+
"<param name=\"Version\" value=\"5.202, 2013-10-22\">"+
"<param name=\"Language\" value=\"english\">"+
"<param name=\"Buttons\" value=\"about=yes config=yes init=yes clear=yes\">"+
"<param name=\"E_01\" value=\"type='R2' id='space_0' bg_display='topleft' net='b8c4c8' net10='889498' axes='405860' text='405860'\">"+
"<param name=\"E_02\" value=\"type='R2' id='Sp2' left='500' top='200' width='200' height='200' O.x='-50%' O.y='-50%' bg_display='topleft' net='b8c4c8' net10='889498' axes='405860' text='405860'\">"+
"<param name=\"C_01\" value=\"id='space_0.scale' type='numeric' region='north' space='space_0' name='escale' value='48' incr='0.1*escala' inf='0.000001' sup='1000000' decimals='(escala&lt;0.01)+(escala&lt;0.1)+(escala&lt;1)+(escala&lt;10)+(escala&lt;100)+(escala&lt;1000)+(escala&lt;10000)+(escala&lt;100000)' fixed='yes' visible='no'\">"+
"<param name=\"C_02\" value=\"id='n1' type='numeric' space='Sp2' name='n1' fixed='yes'\">"+
"<param name=\"C_03\" value=\"id='g1' type='graphic' space='Sp2' fixed='yes'\">"+
"<param name=\"C_04\" value=\"id='space_0.Ox' type='numeric' region='north' name='Ox' fixed='yes'\">"+
"<param name=\"C_05\" value=\"id='n2' type='numeric' space='Sp2' name='n2' fixed='yes'\">"+
"<param name=\"C_06\" value=\"id='space_0.Oy' type='numeric' region='north' name='Oy' fixed='yes'\">"+
"<param name=\"C_07\" value=\"id='n3' type='numeric' space='Sp2' name='n3' fixed='yes'\">"+
"<param name=\"C_08\" value=\"id='n4' type='numeric' gui='button' space='E1' name='n4' fixed='yes' colour='222622' int-colour='f3f8ff' bold='yes' italics='yes' underlined='yes' action='message' parameter.font='Monospaced,BOLD,9'\">"+
"<param name=\"C_09\" value=\"id='test_1' type='numeric' gui='textfield' only_text='yes' region='interior' space='E1' name='text_1' expresion='(10,10,200,25)' value='&squot;&squot;' fixed='yes'\">"+
"<param name=\"C_10\" value=\"id='test_2' type='numeric' gui='textfield' only_text='yes' region='interior' space='E1' name='text_2' expresion='(10,60,200,25)' value='&squot;Texto prueba&squot;' fixed='yes'\">"+
"<param name=\"C_11\" value=\"id='activoTXT' type='numeric' gui='textfield' only_text='yes' region='interior' space='Sp2' name='Texto act' expresion='(activoTXT.x,activoTXT.y,100,100)' value='&squot;&squot;' incr='1' fixed='yes' action='calculate' parameter='TEXTO DEL PARAMETRO' parameter.font='Monospaced,PLAIN,12'\">"+
"<param name=\"A_01\" value=\"id='V3' array='yes' evaluate='always' expresion='V3[0]=0;V3[1]=0;V3[2]=0'\">"+
"<param name=\"A_02\" value=\"id='V3_2' array='yes' evaluate='only-once' expresion='V3[0]=0;V3[1]=0;V3[2]=0'\">"+
"<param name=\"A_03\" value=\"id='M4' matrix='yes' evaluate='only-once' expresion='M4[0,0]=0;M4[1,0]=0;M4[2,0]=0;M4[0,1]=0;M4[1,1]=0;M4[2,1]=0;M4[0,2]=0;M4[1,2]=0;M4[2,2]=0;'\">"+
"<param name=\"A_04\" value=\"id='M4_2' matrix='yes' evaluate='only-once' expresion='M4[0,0]=0;M4[1,0]=0;M4[2,0]=0;M4[0,1]=0;M4[1,1]=0;M4[2,1]=0;M4[0,2]=0;M4[1,2]=0;M4[2,2]=0;'\">"+
"<param name=\"A_05\" value=\"id='var1' expresion='0'\">"+
"<param name=\"A_06\" value=\"id='var1_2' expresion='0'\">"+
"<param name=\"A_07\" value=\"id='fun1(x)' algorithm='yes' expresion='x' range='[a,b]' algorithm='yes' Local='a,b,c' init='x=1' do='sen(x)' while='0'\">"+
"<param name=\"A_08\" value=\"id='fun1_2(x)' algorithm='yes' expresion='x' range='[a,b]' algorithm='yes' Local='a,b,c' init='x=1' do='sen(x)' while='0'\">"+
"<param name=\"A_09\" value=\"id='cons1' constant='yes' expresion='2' evaluate='only-once'\">"+
"<param name=\"A_10\" value=\"id='cons1_2' constant='yes' expresion='2' evaluate='only-once'\">"+
"<param name=\"A_11\" value=\"id='INI_0' algorithm='yes' evaluate='only-once' do='x=0;y=0'\">"+
"<param name=\"A_12\" value=\"id='INICIO' algorithm='yes' evaluate='only-once' do='x=0;y=0'\">"+
"<param name=\"A_13\" value=\"id='INI_1' algorithm='yes' evaluate='only-once' do='x=0;y=0'\">"+
"<param name=\"A_14\" value=\"id='CAL_0' algorithm='yes' do='x=x+1;y=sen(x)'\">"+
"<param name=\"A_15\" value=\"id='CALCULOS' algorithm='yes' do='x=x+1;y=sen(x)'\">"+
"<param name=\"A_16\" value=\"id='CAL_1' algorithm='yes' do='x=x+1;y=sen(x)'\">"+
"<param name=\"A_17\" value=\"id='CALCULOS' algorithm='yes'\">"+
"<param name=\"A_18\" value=\"id='INICIO' algorithm='yes' evaluate='only-once'\">"+
"<param name=\"G_01\" value=\"space='space_0' type='equation' expresion='y=n1*x+n3'\">"+
"<param name=\"G_02\" value=\"type='point' colour='blue' expresion='(t,t)' family='t' t.interval='[0,6]' t.steps='6' fixed='yes' size='4'\">"+
"<param name=\"Animation\" value=\"delay='10000' controls='yes' auto='yes' loop='yes' init='x=2;b=3' do='llamadaAFuncion()' while='x!=2'\">"+
"_no_Java_"+"</applet>"+
"";

	exampleData += "</body>"+
	"</html>"+
	"";
	
	return exampleData;
}

$(function(){
	descartes = (descartes || {});
	descartes.editor= (descartes.editor || {});
	descartes.editor.instances = [];
	
	var desc0 = $('#descartes-editor-0');
	var instance = new descartes.editor.EditorDescartes(desc0[0]);
	 /*
     * Open the default file configuration
     */
	var defCfgStr = generateDescartesEditorTestData();
	
    instance.loadFromString(
			defCfgStr,
			'file:///media/WinDoc/Documentos/Trabajo/LITE/2013/Herramientas_CONACyT/herramientas/ArrastrarSoltar/',
			'index.html');
    descartes.editor.instances.push(instance);
});