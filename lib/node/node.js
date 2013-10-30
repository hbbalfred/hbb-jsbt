/**
 * BaseNode
 * @param {String} debugName
 */
var Node = function ( debugName )
{
	this._debugName = debugName;
};

module.exports = Node;

var pro = Node.prototype;

/**
 * addChild
 * @param {Node} node child
 * @return {Node} this
 */
pro.addChild = function (node)
{
	if (! this._children)
		this._children = [];

	if (this._children.length === bt.MAX_CHILDREN)
		throw new Error("overflow");

	this._children.push(node);
	node._parent = this;
	return this;
};
/**
 * setPrecondition
 * @param {Condition} cond
 * @return {Node} this
 */
pro.setPrecondition = function (cond)
{
	this._precondition = cond;
	return this;
};
/**
 * transition when behavior change
 * it is used to reset the current child in composite node
 * 
 * @param  {Object} blackboard shared data
 */
pro.transition = function (blackboard)
{
	this.doTransition(blackboard);
};
/**
 * tick
 * @param  {Object} blackboard shared data
 */
pro.tick = function (blackboard)
{
	this.doTick(blackboard);
};
/**
 * evaluate the node whether execute or not 
 * @param  {Object} blackboard shared data
 * @return {Boolean}
 */
pro.evaluate = function (blackboard)
{
	var ret = !this._precondition || this._precondition.evaluate( blackboard );
	return ret && doEvaluate( blackboard );
};
/**
 * @protected
 */
pro.doEvaluate = function (blackboard)
{
	return true;
};
/**
 * @protected
 */
pro.doTick = function (blackboard)
{
	return bt.BRS_FINISH;
};
/**
 * @protected
 */
pro.doTransition = function (blackboard)
{
	// abstract method ...
};
/**
 * @protected
 * @param  {Number} i
 * @return {Boolean}
 */
pro.checkIndex = function (i)
{
	return (i > -1) && (i < this._children.length);
};
