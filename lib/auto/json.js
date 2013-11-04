var bt = require("../../");

var exp = module.exports;
exp.parse = parse;

/*
Node Structure
{
	"type" : "if|lo|pa|pr|sl|sq",
	"node" : "Custom|Array",
	"cond" : "Condition"
	"name" : "debug name"
	"opts" : {},
}
Condition Structure
{
	"type" : "not|and|or|true|false",
	"cond" : "Custom|Array"
}
*/


/**
 * BehaviorTree Map
 * {key} is type
 * {value} is Class
 */
var Class = {
	"if" : bt.If,
	"lo" : bt.Loop,
	"pa" : bt.Parallel,
	"pr" : bt.Priority,
	"sl" : bt.Select,
	"sq" : bt.Sequence,

	"not"   : bt.Not,
	"and"   : bt.And,
	"or"    : bt.Or,
	"true"  : bt.True,
	"false" : bt.False,
	"xor"   : bt.Xor
};

/**
 * Parser Map
 * {key} is type
 * {value} is parse function
 */
var Parser = {};

Parser["if"] = Parser["lo"] = Parser["pa"] =
Parser["pr"] = Parser["sl"] = Parser["sq"] = NodeParser;

Parser["true"] = Parser["false"] = TrueFalseParser;
Parser["not"] = Parser["and"] = Parser["or"] = Parser["xor"] = ConditionParser;

/**
 * Node Parser
 * @param  {Function} 		cls    	 Class
 * @param  {String|Array} 	data     custom node | custom node list
 * @param  {Function} 		factory  custom node factory
 * @return {Node}
 */
function NodeParser (cls, data, factory)
{
	var node = new cls( data.opts );

	if (data.node instanceof Array)
	{
		for (var i = 0, n = data.node.length; i < n; ++i)
		{
			node.addChild( parse( data.node[i], factory ) );
		}
	}
	else
	{
		node.addChild( parse( data.node, factory ) );
	}

	return node;
}


/**
 * Condition Parser
 * @param  {Function} 		cls    	 Class
 * @param  {String|Array} 	data     custom conditon | custom condition list
 * @param  {Function} 		factory  custom condition factory
 * @return {Condition}
 */
function ConditionParser(cls, data, factory)
{
	if (data.cond instanceof Array)
	{
		var d = data.cond;
		var f = factory;
		switch(d.length)
		{
			case 1 : return new cls( parse(d[0], f) );
			case 2 : return new cls( parse(d[0], f), parse(d[1], f) );
			case 3 : return new cls( parse(d[0], f), parse(d[1], f), parse(d[2], f) );
			case 4 : return new cls( parse(d[0], f), parse(d[1], f), parse(d[2], f), parse(d[3], f) );
			case 5 : return new cls( parse(d[0], f), parse(d[1], f), parse(d[2], f), parse(d[3], f), parse(d[4], f) );
			default : throw new Error("more arguments than 5");
		}
	}
	else
	{
		return new cls( parse(data.cond, factory) );
	}
}

/**
 * TrueFalseParser
 * @param {Function} cls    Class
 * @param  {String|Array} 	data     custom conditon | custom condition list
 * @param  {Function} 		factory  custom condition factory
 * @return {Condition}
 */
function TrueFalseParser(cls, data, factory)
{
	return new cls();
}

/**
 * parse json
 * @param  {Object}		data     NodeStructure|ConditionStructure
 * @param  {Function}	factory  custom node/condition generator
 * @return {Node|Condition}
 */
function parse(data, factory)
{
	var nodeOrCond;

	if (data.type)
	{
		var type = data.type.toLowerCase();

		var fn = Parser[ type ];

		if (fn)
		{
			nodeOrCond = fn( Class[type], data, factory );
		}
	}

	if (! nodeOrCond)
		nodeOrCond = factory.create( data.node || data.cond, data, data.node ? "node" : "cond" );

	if (data.name)
		nodeOrCond.debugName = data.name;

	if (data.cond && (nodeOrCond instanceof bt.Node))
		nodeOrCond.setPrecondition( parse( data.cond, factory ) );

	return nodeOrCond;
}
