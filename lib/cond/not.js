/**
 * NOT logic condition
 * @param {Cond} cond
 */
var Cond = function (cond)
{
	this.cond = cond;
}

Cond.prototype.evaluate = function(bb)
{
	return ! this.cond.evaluate(bb);
};

module.exports = Cond;