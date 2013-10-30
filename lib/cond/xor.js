/**
 * XOR logic condition
 * @param {CondA} cond
 * @param {CondB} cond
 */
var Cond = function (condA, condB)
{
	this.condA = condA;
	this.condB = condB;
}

Cond.prototype.evaluate = function(bb)
{
	return this.condA.evaluate(bb) ^ this.condB.evaluate(bb);
};

module.exports = Cond;