'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.pepper1.net/zwavedb/device/609

module.exports = new ZwaveDriver(path.basename(__dirname), {
	capabilities: {
	}
});

const triggerMap = {
	1: 'press_1',
	2: 'hold_1',
	3: 'press_2',
	4: 'hold_2',
	5: 'press_3',
	6: 'hold_3',
	7: 'press_4',
	8: 'hold_4',
};

module.exports.on('initNode', token => {
	const node = module.exports.nodes[token];
	if (node) {
		node.instance.CommandClass['COMMAND_CLASS_SCENE_ACTIVATION'].on('report', (command, report) => {
			if (command.name === 'SCENE_ACTIVATION_SET') {
				const triggerId = triggerMap[report['Scene ID']];
				if (triggerId) Homey.manager('flow').triggerDevice(`zw003_${triggerId}`, null, null, node.device_data);
			}
		});
	}
});
