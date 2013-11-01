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


describe('AND Test', function() {
	it('should return true', function () {

		var blackboard = {
			num : 6
		};

		var cond = new bt.And( new NumGT(5), new NumLT(8) );

		var res = cond.evaluate( blackboard );

		res.should.equal(true);
	});
	it('should return false', function () {

		var blackboard = {
			num : 6
		};

		var cond = new bt.And( new NumGT(5), new NumLT(5) );

		var res = cond.evaluate( blackboard );

		res.should.equal(false);
	});
});