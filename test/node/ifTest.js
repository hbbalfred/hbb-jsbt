var should = require('should');
var bt = require('../../');
var util = require('util');
var terminal = bt.Terminal;
var If = bt.If;

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

describe('If Test', function () {
	it('should never execute children', function () {

		var bb = {fn : 0, sn : 0, finish : 0, wait : 0};

		var root = new If().setPrecondition( new Fail() )
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

	it('should execute all children', function () {

		var bb = {fn : 0, sn : 0, finish: 0, wait : 0};

		var root = new If().setPrecondition( new Succ() )
		.addChild( new Finish() )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_FINISH);
		bb.fn.should.equal(0);
		bb.sn.should.equal(1);
		bb.finish.should.equal(2);
	});

	it('should wait 2 ticks then finish', function () {

		var bb = {fn : 0, sn : 0, finish: 0, wait : 0};

		var root = new If().setPrecondition( new Succ() )
		.addChild( new Finish() )
		.addChild( new Wait() )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_EXECUTING);
		bb.fn.should.equal(0);
		bb.sn.should.equal(1);
		bb.wait.should.equal(1);
		bb.finish.should.equal(1);

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_FINISH);
		bb.fn.should.equal(0);
		bb.sn.should.equal(2);
		bb.wait.should.equal(2);
		bb.finish.should.equal(2);
	});

	it('should no wait to finish directly', function () {

		var bb = {fn : 0, sn : 0, finish: 0, wait : 0};

		var root = new If().setPrecondition( new Succ() )
		.addChild( new Finish() )
		.addChild( new Wait().setPrecondition( new Fail() ) )
		.addChild( new Finish() );

		var res = bt.BRS_ERROR_TRANSITION;

		if (root.evaluate(bb))
			res = root.tick(bb);

		res.should.equal(bt.BRS_FINISH);
		bb.fn.should.equal(1);
		bb.sn.should.equal(1);
		bb.wait.should.equal(0);
		bb.finish.should.equal(2);
	});
});