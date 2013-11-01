var should = require('should');
var bt = require('../../');
var util = require('util');
var terminal = bt.Terminal;
var Parallel = bt.Parallel;

var Fail = function (){};
Fail.prototype.evaluate = function(bb)
{
	++ bb.fn;
	return false;
};

var Succ = function (){};
Succ.prototype.evaluate = function(bb)
{
	++ bb.sn;
	return true;
};

var Finish = function (){
	terminal.call(this);
};
util.inherits(Finish, terminal);
Finish.prototype.doExecute = function(bb)
{
	++ bb.finish;
	return bt.BRS_FINISH;
};

var Wait = function (){
	terminal.call(this);
};
util.inherits(Wait, terminal);
Wait.prototype.doExecute = function(bb)
{
	if (++bb.wait === 2)
		return bt.BRS_FINISH;
	return bt.BRS_EXECUTING;
};

describe('Parallel Test', function () {
	it('should only 1 tick to finish', function () {

		var bb = {fn : 0, sn : 0, finish : 0, wait : 0};

		var root = new Parallel()
		.addChild( new Wait() )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_FINISH);
		bb.wait.should.equal(1);
		bb.finish.should.equal(1);
	});

	it('should wait 2 ticks to finish', function () {

		var bb = {fn : 0, sn : 0, finish : 0, wait : 0};

		var root = new Parallel().setFinishCondition( Parallel.CON_AND )
		.addChild( new Wait() )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_EXECUTING);
		bb.wait.should.equal(1);
		bb.finish.should.equal(1);

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_FINISH);
		bb.wait.should.equal(2);
		bb.finish.should.equal(1);
	});

	it('should never execute', function () {

		var bb = {fn : 0, sn : 0, finish: 0, wait : 0};

		var root = new Parallel()
		.addChild( new Finish() )
		.addChild( new Wait().setPrecondition(new Fail()) )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_ERROR_TRANSITION);
		bb.fn.should.equal(1);
		bb.sn.should.equal(0);
		bb.wait.should.equal(0);
		bb.finish.should.equal(0);
	});
});