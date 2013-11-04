var bt = require("../bt");
var base = require("./node");
var util = require("util");

/**
 * loop select node
 * @param {Object} opts
 */
var Node = function (opts)
{
	base.call(this, opts);
	
	this._loopCount = (opts && opts.loopCount > -1) ? opts.loopCount : -1;
	this._curLoop = 0;
};
util.inherits(Node, base);

module.exports = Node;

var pro = Node.prototype;

/**
 * setLoopCount
 * @param {Number} count
 * @return {Node} this
 */
pro.setLoopCount = function (count)
{
	this._loopCount = count;
	return this;
};

/**
 * @inheritDoc
 */
pro.doEvaluate = function (blackboard)
{
	var checkLoop = (this._loopCount == -1) || (this._curLoop < this._loopCount);
	
	if(!checkLoop)
		return false;
	
	if( this.checkIndex(0) )
		if( this._children[0].evaluate( blackboard ) )
			return true;
	
	return false;
};
/**
 * @inheritDoc
 */
pro.doTransition = function (blackboard)
{
	if (this.checkIndex(0))
	{
		this._children[0].transition(blackboard);
	}
	this._curLoop = 0;
};
/**
 * @inheritDoc
 */
pro.doTick = function (blackboard)
{
	var isFinish = bt.BRS_FINISH;

	if (this.checkIndex(0))
	{
		isFinish = this._children[0].tick(blackboard);

		if (isFinish === bt.BRS_FINISH)
		{
			if (this._loopCount === -1)
				isFinish = bt.BRS_EXECUTING;
			else
			{
				++this._curLoop;
				if (this._curLoop < this._loopCount)
					isFinish = bt.BRS_EXECUTING;
			}
		}
	}

	if (isFinish === bt.BRS_FINISH)
		this._curLoop = 0;

	return isFinish;
};