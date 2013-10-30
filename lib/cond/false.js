/**
 * FALSE logic condition
 * @param {Cond} cond
 */
var Cond = function ()
{
}

Cond.prototype.evaluate = function(bb)
{
	return false;
};

module.exports = Cond;