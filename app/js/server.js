const net = require('net');
const JSONSocket = require('json-socket');

class Server {

	constructor(port, callback) {
		this.server = null;
		this.callback = callback;
		this.port = port;
	}

	proc() {
		let joysticks = navigator.getGamepads();
		let message = {connected:false};
		if (joysticks[0] && joysticks[0].connected) {

			const joystick = joysticks[0];
			const buttons = [];

			for (const b of joystick.buttons) {
				buttons.push({pressed: b.pressed, value:b.value});
			}

			message = {
				'axes': joystick.axes,
				'buttons': buttons,
				'connected': true,
				'id': joystick.id,
				'index': joystick.index,
				'mapping': joystick.mapping,
				'timestamp': joystick.timestamp
			}

		}
		return message;
	}

	start() {
		this.server = net.createServer();
		this.server.on('error', (function() {
			alert(`Could not open server on port ${this.port}.\nTry changing the port number or check to see if you have any other servers running or if you have permission to use this port then restart the server.`);
			this.callback(false);
		}).bind(this));
		this.server.on('connection', (function(socket) { 
			socket = new JSONSocket(socket); 
			socket.on('message', (function(message) {
				const resp = this.proc();
				socket.sendMessage(resp);
			}).bind(this));
		}).bind(this));
		this.server.listen(this.port, (function() {
			this.callback(true);
		}).bind(this));
		
	}

}
module.exports.Server = Server;

