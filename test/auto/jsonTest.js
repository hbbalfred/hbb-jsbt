var should = require('should');
var bt = require('../../');
var data = require('./test.json');
var util = require('util');
var generator = require('../../lib/auto/json');


var MyAction = function ()
{
	bt.Terminal.apply(this, arguments);
};
util.inherits(MyAction, bt.Terminal);

var MyCond = function ()
{
};

var Map = {
	'MyAction' : MyAction,
	'MyCond' : MyCond
};

var factory = {
	create : function ( clsName )
	{
		return new Map[clsName]();
	}
};

describe('Auto Json Test', function () {
	it('should create success', function () {
		var root = generator.parse(data, factory);
		root.debugName.should.equal('if');
		root._children.length.should.equal(1);
		root._children[0].debugName.should.equal('lo');
		root._children[0]._children.length.should.equal(1);
		root._children[0]._children[0].debugName.should.equal('pa');
		root._children[0]._children[0]._children.length.should.equal(1);
		root._children[0]._children[0]._children[0].debugName.should.equal('pr');
		root._children[0]._children[0]._children[0]._children.length.should.equal(1);
		root._children[0]._children[0]._children[0]._children[0].debugName.should.equal('sl');
		root._children[0]._children[0]._children[0]._children[0]._children.length.should.equal(1);
		root._children[0]._children[0]._children[0]._children[0]._children[0].debugName.should.equal('sq');
		root._children[0]._children[0]._children[0]._children[0]._children[0]._children.length.should.equal(1);

		var my = root._children[0]._children[0]._children[0]._children[0]._children[0]._children[0];
		my.debugName.should.equal('my');

		my._precondition.should.be.an.instanceOf(bt.Not);
		my._precondition.cond.should.be.an.instanceOf(bt.Xor);
		my._precondition.cond.condA.should.be.an.instanceOf(bt.And);
		my._precondition.cond.condB.should.be.an.instanceOf(bt.Or);
		my._precondition.cond.condA.conds.length.should.equal(2);
		my._precondition.cond.condB.conds.length.should.equal(2);
		my._precondition.cond.condA.conds[0].should.be.an.instanceOf(bt.False);
		my._precondition.cond.condA.conds[1].should.be.an.instanceOf(bt.True);
		my._precondition.cond.condB.conds[0].should.be.an.instanceOf(Map.MyCond);
		my._precondition.cond.condB.conds[1].should.be.an.instanceOf(Map.MyCond);
	});
});