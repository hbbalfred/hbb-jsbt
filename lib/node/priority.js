var bt = require("../bt");
var base = require("./node");
var util = require("util");

/**
 * priority select node
 * @param {String} debugName
 */
var Node = function (debugName)
{
	base.call(this, debugName);
	this._curIndex = -1;
	this._lastIndex = -1;
}
util.inherit(Node, base);

module.exports = Node;

var pro = Node.prototype;

/**
 * @inheritDoc
 */
pro.doEvaluate = function (blackboard)
{
	this._curIndex = -1;

	for (var i = 0, n = this._children.length; i < n; ++i)
	{
		if (this._children[i].evaluate(blackboard))
		{
			this._curIndex = i;
			return true;
		}
	}

	return false;
};
/**
 * @inheritDoc
 */
pro.doTransition = function (blackboard)
{
	if (this.checkIndex(this._lastIndex))
	{
		this._children[this._lastIndex].transition(blackboard);
	}
	this._lastIndex = -1;
};
/**
 * @inheritDoc
 */
pro.doTick = function (blackboard)
{
	var isFinish = bt.BRS_FINISH;

	if (this.checkIndex(this._curIndex))
	{
		if (this._curIndex !== this._lastIndex)
		{
			if (this.checkIndex(this._lastIndex))
			{
				this._children[this._lastIndex].transition(blackboard);
			}
			this._lastIndex = this._curIndex;
		}
	}

	if (this.checkIndex(this._lastIndex))
	{
		isFinish = this._children[this._lastIndex].tick(blackboard);
		if (isFinish === bt.BRS_FINISH)
			this._lastIndex = -1;
	}

	return isFinish;
};