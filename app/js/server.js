const HTTP = require('http');

class Server {

	constructor(port, callback) {

		this.server = null;
		this.port = parseInt(port, 10);
		this.callback = callback;

		if (this.port <= 0 || this.port >= 65534 || isNaN(this.port)) {
			this.port = 9001;
		}

	}

	proc(req, res) {
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
		res.write(JSON.stringify(message));
		res.end();
	}

	start() {
		this.server = HTTP.createServer(this.proc.bind(this))
		this.server.on('error', (function() {
			alert(`Could not open server on port ${this.port}.\nTry changing the port number or check to see if you have any other servers running or if you have permission to use this port then restart the server.`);
			this.callback(false);
		}).bind(this));
		this.server.listen(this.port, '0.0.0.0', (function() {
			this.callback(true, this.server.address());
		}).bind(this));
	}


}
module.exports.Server = Server;