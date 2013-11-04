var bt = require("../bt");
var base = require("./node");
var util = require("util");

var CON_AND = 1;
var CON_OR = 0;


/**
 * parallel select node
 * @param {Object} opts
 */
var Node = function (opts)
{
	base.call(this, opts);

	this._childrenStatus = [];
	this._finishCondition = (opts && opts.finishCondition) === CON_AND ? CON_AND : CON_OR;

	resetChildrenStatus.call(this);
}
util.inherits(Node, base);

Node.CON_AND = CON_AND;
Node.CON_OR = CON_OR;

module.exports = Node;

var pro = Node.prototype;

/**
 * setFinishCondition
 * @param {Number} con Node.CON_AND|Node.CON_OR
 * @return {Node} this
 */
pro.setFinishCondition = function (con)
{
	this._finishCondition = con;
	return this;
};

/**
 * @inheritDoc
 */
pro.doEvaluate = function (blackboard)
{
	for (var i = 0, n = this._children.length; i < n; ++i)
	{
		if (this._childrenStatus[i] === bt.BRS_EXECUTING)
		{
			if (! this._children[i].evaluate(blackboard))
			{
				return false;
			}
		}
	}

	return true;
};
/**
 * @inheritDoc
 */
pro.doTransition = function (blackboard)
{
	resetChildrenStatus.call(this);

	for (var i = 0, n = this._children.length; i < n; ++i)
	{
		this._children[i].transition();
	}
};
/**
 * @inheritDoc
 */
pro.doTick = function (blackboard)
{
	var n = this._children.length;
	var i;

	if (this._finishCondition === CON_OR)
	{
		for (i = 0; i < n; ++i)
		{
			if (this._childrenStatus[i] === bt.BRS_EXECUTING)
				this._childrenStatus[i] = this._children[i].tick(blackboard);

			if (this._childrenStatus[i] !== bt.BRS_EXECUTING)
			{
				resetChildrenStatus.call(this);
				return bt.BRS_FINISH;
			}
		}
	}
	else if(this._finishCondition === CON_AND)
	{
		var count = 0;
		for (i = 0; i < n; ++i)
		{
			if (this._childrenStatus[i] === bt.BRS_EXECUTING)
				this._childrenStatus[i] = this._children[i].tick(blackboard);

			if (this._childrenStatus[i] !== bt.BRS_EXECUTING)
				++count;
		}

		if (count === n)
		{
			resetChildrenStatus.call(this);
			return bt.BRS_FINISH;
		}
	}
	else
	{
		throw new Error("Unknown finish condition :" + this._finishCondition);
	}

	return bt.BRS_EXECUTING;
};

/**
 * @private
 * resetChildrenStatus
 */
function resetChildrenStatus()
{
	for(var i = 0; i < bt.MAX_CHILDREN; ++i )
		this._childrenStatus[i] = bt.BRS_EXECUTING;
}