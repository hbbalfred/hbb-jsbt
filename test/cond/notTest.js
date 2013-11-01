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


describe('NOT Test', function() {
	it('should return true', function () {

		var blackboard = {
			num : 2
		};

		var cond = new bt.Not( new NumGT(5) )

		var res = cond.evaluate( blackboard );

		res.should.equal(true);
	});
	it('should return false', function () {

		var blackboard = {
			num : 10
		};

		var cond = new bt.Not( new NumGT(5) )

		var res = cond.evaluate( blackboard );

		res.should.equal(false);
	});
});