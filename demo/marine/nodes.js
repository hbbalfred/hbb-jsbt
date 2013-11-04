var bt = require('../../');
var util = require('util');
var terminal = bt.Terminal;

var A_MoveTo = function (name)
{
	terminal.call(this, name);
};
util.inherits(A_MoveTo, terminal);
A_MoveTo.prototype.doEnter = function(bb)
{
	this._step = 0;
};
A_MoveTo.prototype.doExecute = function(bb)
{
	var ret = bt.BRS_EXECUTING;
	if (++this._step === bb.targetSteps)
		ret = bt.BRS_FINISH;
	bb.action = 'move to target ' + this._step;
	return ret;
};
var A_LookAround = function (name)
{
	terminal.call(this, name);
};
util.inherits(A_LookAround, terminal);
A_LookAround.prototype.doEnter = function(bb)
{
	this._num = 4;
};
A_LookAround.prototype.doExecute = function(bb)
{
	var ret = bt.BRS_EXECUTING;
	if (--this._num === 0)
		ret = bt.BRS_FINISH;
	bb.action = 'look around ' + this._num;
	return ret;
};
var A_Clear = function (name)
{
	terminal.call(this, name);
};
util.inherits(A_Clear, terminal);
A_Clear.prototype.doExecute = function(bb)
{
	bb.beep = null;
	bb.targetSteps = 0;
	return bt.BRS_FINISH;
};
var A_Wander = function (name)
{
	terminal.call(this, name);
};
util.inherits(A_Wander, terminal);
A_Wander.prototype.doExecute = function(bb)
{
	bb.action = 'wandering';
	return bt.BRS_EXECUTING;
};
var A_Cough = function (name)
{
	terminal.call(this, name);
};
util.inherits(A_Cough, terminal);
A_Cough.prototype.doExecute = function(bb)
{
	bb.status = 'coughing...';
	return bt.BRS_EXECUTING;
};
var A_Smoke = function (name)
{
	terminal.call(this, name);
};
util.inherits(A_Smoke, terminal);
A_Smoke.prototype.doExecute = function(bb)
{
	bb.status = 'smoking...';
	return bt.BRS_EXECUTING;
};
var C_HasSound = function ()
{
};
C_HasSound.prototype.evaluate = function(bb)
{
	return bb.beep;
};
var C_IsChoke = function ()
{
};
C_IsChoke.prototype.evaluate = function(bb)
{
	return Math.random() < 0.2;
};

//
// exports
//
var exp = module.exports;
exp.A_MoveTo = A_MoveTo;
exp.A_LookAround = A_LookAround;
exp.A_Clear = A_Clear;
exp.A_Wander = A_Wander;
exp.A_Cough = A_Cough;
exp.A_Smoke = A_Smoke;
exp.C_HasSound = C_HasSound;
exp.C_IsChoke = C_IsChoke;