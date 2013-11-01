var should = require('should');
var bt = require('../../');
var util = require('util');
var terminal = bt.Terminal;
var Loop = bt.Loop;

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

describe('Loop Test', function () {
	it('should never execute children', function () {

		var bb = {fn : 0, sn : 0, finish : 0, wait : 0};

		var root = new Loop().setPrecondition( new Fail() )
		.addChild( new Finish() )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_ERROR_TRANSITION);
		bb.fn.should.equal(1);
		bb.sn.should.equal(0);
		bb.finish.should.equal(0);
	});

	it('should execute only the first child', function () {

		var bb = {fn : 0, sn : 0, finish: 0, wait : 0};

		var root = new Loop().setLoopCount(2)
		.addChild( new Finish().setPrecondition( new Succ() ) )
		.addChild( new Wait() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_EXECUTING);
		bb.sn.should.equal(1);
		bb.finish.should.equal(1);
		bb.wait.should.equal(0);

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_FINISH);
		bb.sn.should.equal(2);
		bb.finish.should.equal(2);
		bb.wait.should.equal(0);
	});

	it('should wait 4 ticks then finish', function () {

		var bb = {fn : 0, sn : 0, finish: 0, wait : 0};

		var root = new Loop().setLoopCount(2)
		.addChild( new Wait() )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_EXECUTING);
		bb.wait.should.equal(1);
		bb.finish.should.equal(0);

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_EXECUTING);
		bb.wait.should.equal(2);
		bb.finish.should.equal(0);

		bb.wait = 0;
		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_EXECUTING);
		bb.wait.should.equal(1);
		bb.finish.should.equal(0);

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_FINISH);
		bb.wait.should.equal(2);
		bb.finish.should.equal(0);
	});
});