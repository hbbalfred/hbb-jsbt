var should = require('should');
var bt = require('../../');

var NumGT = function (num)
{
	this._num = num;
};
NumGT.prototype.evaluate = function(blackboard)
{
	return blackboard.num > this._num;
};

var NumLT = function (num)
{
	this._num = num;
};
NumLT.prototype.evaluate = function(blackboard)
{
	return blackboard.num < this._num;
};



describe('XOR Test', function() {
	it('xor logic', function () {

		var bb = { num : 5 };

		new bt.Xor(new NumLT(4),new NumGT(6)).evaluate(bb).should.equal(0);
		new bt.Xor(new NumLT(6),new NumGT(4)).evaluate(bb).should.equal(0);
		new bt.Xor(new NumLT(6),new NumGT(6)).evaluate(bb).should.equal(1);
		new bt.Xor(new NumLT(4),new NumGT(4)).evaluate(bb).should.equal(1);
	});
});