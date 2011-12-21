
/*
 
 Just lifted from address below (and converted to JS), we might need to work out some licensing issues.
 
 https://github.com/sergiomtzlosa/rt90towgs84/blob/master/GaussKreuger/Classes/Convert.m
 
*/

var cosh = require('./phpjs/cosh').cosh;
var sinh = require('./phpjs/sinh').sinh;

var sin = Math.sin;
var cos = Math.cos;

var pow = Math.pow;

exports.RT90toWGS84 = function (x, y) {
    
    var LatitudeRad, LongitudeRad, CentralLongitudeRad, ConformalLatitudeRad, FalseNorthing, FalseEasting;
	var DeltaLongitudeRad, Xi, Xiprim, eta, etaprim;
	var delta1, delta2, delta3, delta4;
	var Astar, Bstar, Cstar, Dstar;
	var Pi, e2, K0, n, apeak;
	var f = (1 / 299.1528128);
	var a = (6377397.155);
    
	Pi = Math.PI;
	CentralLongitudeRad = (15.0 + 48.0 / 60.0 + 29.8 / 3600.0) * Pi / 180;
    
	FalseNorthing = 0;
	FalseEasting = 1500000;
	K0 = 1;
	n = f / (2 - f);
	apeak = (a / (1 + n)) * (1 + (1.0 / 4.0) * pow(n,2) + (1.0 / 64.0) * pow(n,4));
	e2 = f * (2 - f);
    
	Xi = (x - FalseNorthing) / (K0 * apeak);
	eta = (y - FalseEasting) / (K0 * apeak);
    
	delta1 = (1.0 / 2.0) * n - (2.0 / 3.0) * pow(n,2) + (37.0 / 96.0) * pow(n,3) - (1.0 / 360.0) * pow(n,4);
	delta2 = (1.0 / 48.0) * pow(n,2) + (1.0 / 15.0) * pow(n,3) - (437.0 / 1440.0) * pow(n,4);
	delta3 = (17.0 / 480.0) * pow(n,3) - (37.0 / 840.0) * pow(n,4);
	delta4 = (4397.0 / 161280.0) * pow(n,4);
    
	Astar = (e2 + pow(e2,2) + pow(e2,3) + pow(e2,4));
	Bstar = -(1.0 / 6.0) * (7 * pow(e2,2) + 17 * pow(e2,3) + 30 * pow(e2,4));
	Cstar = (1.0 / 120.0) * (224.0 * pow(e2,3) + 889 * pow(e2,4));
	Dstar = -(1.0 / 1260.0) * (4279 * pow(e2,4));
    
	Xiprim = Xi - delta1 * sin(2 * Xi) * cosh(2 * eta) - delta2 * sin(4 * Xi) * cosh(4 * eta) - delta3 * sin(6 * Xi) * cosh(6 * eta) - delta4 * sin(8 * Xi) * cosh(8 * eta);
	etaprim = eta - delta1 * cos(2 * Xi) * sinh(2 * eta) - delta2 * cos(4 * Xi) * sinh(4 * eta) - delta3 * cos(6 * Xi) * sinh(6 * eta) - delta4 * cos(8 * Xi) * sinh(8 * eta);
    
	ConformalLatitudeRad = Math.asin(sin(Xiprim) / cosh(etaprim));
	DeltaLongitudeRad = Math.atan(sinh(etaprim) / cos(Xiprim));
    
	LatitudeRad = CentralLongitudeRad + DeltaLongitudeRad;
	LongitudeRad = ConformalLatitudeRad + sin(ConformalLatitudeRad) * cos(ConformalLatitudeRad) * (Astar + Bstar * pow((sin(ConformalLatitudeRad)),2) + Cstar * pow((sin(ConformalLatitudeRad)),4) + Dstar * pow((sin(ConformalLatitudeRad)),6));
    
	return [
        ((180.0 / Pi) * LatitudeRad)/* + 0.5836446381*/,
        ((180.0 / Pi) * LongitudeRad)/* + 3.6950216293*/
    ];
}
