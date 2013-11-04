var bt = require('../../');
var marine = require('./bt.json');
var generator = require('../../lib/auto/json');
var nodes = require('./nodes');

var factory = {
	create : function (clsName)
	{
		return new nodes[clsName]();
	}
}

var ai = generator.parse( marine, factory );
var bb = { beep : null, targetSteps : 0 };

setInterval(function (){

	if ( Math.random() < 0.05 ){
		bb.beep = true;
		bb.targetSteps = 1 + Math.random() * 5 >> 0;
	}

	if (ai.evaluate(bb)){
		ai.tick(bb);
	}

	console.log('marine status = ' + bb.status + ', action = ' + bb.action + ',  targetSteps = ' + bb.targetSteps + ',  beep = ' + bb.beep)
}, 1000)
