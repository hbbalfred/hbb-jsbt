/**
 * OR logic condition
 * @param {Cond} cond
 */
var Cond = function ()
{
	this.conds = Array.prototype.slice.call(arguments, 0);
}

Cond.prototype.evaluate = function(bb)
{
	for (var i = 0, n = this.conds.length; i < n; ++i)
	{
		if (this.conds[i].evaluate(bb))
			return true;
	}
};

module.exports = Cond;