var bt = require("../bt");
var base = require("./priority");
var util = require("util");

/**
 * select node
 */
var Node = function ()
{
	base.call(this);
}
util.inherits(Node, base);

module.exports = Node;

var pro = Node.prototype;

/**
 * @inheritDoc
 */
pro.doEvaluate = function (blackboard)
{
	if (this.checkIndex(this._curIndex))
	{
		if (this._children[this._curIndex].evaluate(blackboard))
			return true;
	}

	return base.prototype.doEvaluate.call(this, blackboard);
};