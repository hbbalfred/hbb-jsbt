var bt = require("../bt");
var base = require("./node");
var util = require("util");

/**
 * sequence node
 */
var Node = function ()
{
	base.call(this);
	this._curIndex = -1;
}
util.inherits(Node, base);

module.exports = Node;

var pro = Node.prototype;

/**
 * @inheritDoc
 */
pro.doEvaluate = function (blackboard)
{
	var index = this._curIndex;

	if( index === -1 )
		index = 0;
	
	if( this.checkIndex( index ) )
	{
		if( this._children[ index ].evaluate( blackboard ) )
			return true;
	}
	
	return false;
};
/**
 * @inheritDoc
 */
pro.doTransition = function (blackboard)
{
	if (this.checkIndex(this._curIndex))
	{
		this._children[this._curIndex].transition(blackboard);
	}
	this._curIndex = -1;
};
/**
 * @inheritDoc
 */
pro.doTick = function (blackboard)
{
	var isFinish = bt.BRS_FINISH;

	if (this._curIndex === -1)
		this._curIndex = 0;

	isFinish = this._children[this._curIndex].tick(blackboard);

	if (isFinish)
	{
		++this._curIndex;
		if (this._curIndex === this._children.length)
			this._curIndex = -1;
		else
			isFinish = bt.BRS_EXECUTING;
	}

	if (isFinish < 0) // error
		this._curIndex = -1;
	
	return isFinish;
};