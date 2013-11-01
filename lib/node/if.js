var bt = require("../bt");
var base = require("./node");
var util = require("util");

/**
 * if node as similar as sequence node
 * with dynamic evaluate and sync tick
 * @param {String} debugName
 */
var Node = function (debugName)
{
	base.call(this, debugName);
	this._curIndex = -1;
}
util.inherits(Node, base);

module.exports = Node;

var pro = Node.prototype;

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

	while(true)
	{
		if (this._children[ this._curIndex ].evaluate( blackboard ))
			isFinish = this._children[ this._curIndex ].tick( blackboard );
		
		if( isFinish !== bt.BRS_FINISH )
			break;
		
		if( ++this._curIndex === this._children.length )
		{
			this._curIndex = -1;
			break;
		}
	}

	if (isFinish < 0) // error
		this._curIndex = -1;
	
	return isFinish;
};