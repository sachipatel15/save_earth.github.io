var UsrScr = require( "../lib/UsrScr" );
var layer = require( "../layer" ).getLayer("garbage");
var timeline = require( "../timeline" ).use( "garbage" ).init( 10 );
var tween = require( "../lib/tween" );
var tools = require( "../tools" );

var random = UsrScr.randomNumber;
var dur = 1500;
var anim = tween.exponential.co;
var dropAnim = tween.quadratic.co;
var sin = Math.sin;
var cos = Math.cos;

var num = 10;
var radius = 10;


function Classgarbage( x, y, color ){
	this.originX = x;
	this.originY = y;
	this.color = color;

    this.distance = random( 200 ) + 100;
    this.radius = radius;
    this.dir = random( 360 ) * Math.PI / 180;
}

Classgarbage.prototype.render = function(){
	this.circle = layer.circle( this.originX, this.originY, this.radius ).attr({
		fill: this.color,
		stroke: "none"
	});
};

Classgarbage.prototype.sputter = function(){
	timeline.createTask({
		start: 0, duration: dur,
		object: this, onTimeUpdate: this.onTimeUpdate, onTimeEnd: this.onTimeEnd
	});
};

Classgarbage.prototype.onTimeUpdate = function( time ){
	var distance, x, y, z;
	
	distance = anim( time, 0, this.distance, dur );
	x = this.originX + distance * cos( this.dir );
	y = this.originY + distance * sin( this.dir ) + dropAnim( time, 0, 200, dur );
	z = anim( time, 1, -1, dur );

	this.circle.attr({ cx: x, cy: y }).scale( z, z );
};

Classgarbage.prototype.onTimeEnd = function(){
	this.circle.remove();
	tools.unsetObject( this );
};

exports.create = function( x, y, color ){
    for(var i = 0; i < num; i ++)
    	this.createOne( x, y, color );
};

exports.createOne = function( x, y, color ){
	if( !color )
	    return;

	var garbage = new Classgarbage( x, y, color );
	garbage.render();
	garbage.sputter();
};