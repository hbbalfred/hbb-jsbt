var bt = require("../bt");
var base = require("./node");
var util = require("util");

var STA_READY   = 0;
var STA_RUNNING = 1;
var STA_FINISH  = 2;

/**
 * Ternimal Node
 * actually is an action node
 * @param {String} debugName
 */
var Node = function (debugName)
{
	base.call(this, debugName);

	this._status = STA_READY;
	this._needExit = false;
};

util.inherit(Node, base);

module.exports = Node;

var pro = Node.prototype;

/**
 * @inheritDoc
 */
pro.doTick = function (blackboard)
{
	var isFinish = BRS_FINISH;
			
	if( this._status === STA_READY )
	{
		this.doEnter( blackboard );
		this._needExit = true;
		this._status = STA_RUNNING;
	}
	
	if( this._status === STA_RUNNING )
	{
		isFinish = this.doExecute( blackboard );
		if( isFinish === BRS_FINISH || isFinish < 0 )
			this._status = STA_FINISH;
	}
	
	if( this._status === STA_FINISH )
	{
		if(this._needExit)
			this.doExit( blackboard, isFinish );
		
		this._status = STA_READY;
		this._needExit = false;
	}
	
	return isFinish;
};
/**
 * @inheritDoc
 */
pro.doTransition = function (blackboard)
{
	if( this._needExit )
		this.doExit( blackboard, bt.BRS_ERROR_TRANSITION );
	
	this._status = STA_READY;
	this._needExit = false;
};
/**
 * on action node executing
 * @protected
 * @param  {Object} blackboard shared object
 */
pro.doExecute = function (blackboard)
{
	return BRS_FINISH;
};
/**
 * on enter action node
 * @protected
 * @param  {Object} blackboard shared object
 */
pro.doEnter = function (blackboard)
{
	// abstract method ...
};
/**
 * on exit action node
 * @protected
 * @param  {Object} blackboard shared object
 * @param  {Number} exitID     BRS
 */
pro.doExit = function (blackboard, exitID)
{
	// abstract method ...
};