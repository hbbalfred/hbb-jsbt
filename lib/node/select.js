var bt = require("../bt");
var base = require("./priority");
var util = require("util");

/**
 * select node
 * @param {String} debugName
 */
var Node = function (debugName)
{
	base.call(this, debugName);
}
util.inherit(Node, base);

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