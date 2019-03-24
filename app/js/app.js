const {OJD} = require("../app/js/ojd.js");
const os = require('os');

window.OJD 	= new OJD(__dirname);

/*
	This is a work in progress proof of concept. Make this cleaner.
*/
document.addEventListener("DOMContentLoaded", function() {
	
	// Update Status of Controller
	function updateControllerStatus(status, info) {
		if (status) {
			document.querySelector('#ojd-controller-status').classList.remove('ojd-status-bad');
			document.querySelector('#ojd-controller-status').classList.add('ojd-status-good');
			document.querySelector('#ojd-controller-status .ojd-indicator-text').innerHTML = `Connected: ${info.id}: ${info.buttons.length} Buttons, ${info.axes.length} Axes.`;
		} else {
			document.querySelector('#ojd-controller-status').classList.remove('ojd-status-good');
			document.querySelector('#ojd-controller-status').classList.add('ojd-status-bad');
			document.querySelector('#ojd-controller-status .ojd-indicator-text').innerHTML = 'Controller not connected. Hit a button on your controller to assign it to the server.';
		}
	}

	// Update Status of Running Server
	function updateServerStatus(status, info) {

		if (status) {

			document.querySelector('#ojd-server-status').classList.remove('ojd-status-bad');
			document.querySelector('#ojd-server-status').classList.add('ojd-status-good');
			document.querySelector('#ojd-server-status .ojd-indicator-text').innerHTML = `Server Started`;

			const urls = [];
			const ifaces = os.networkInterfaces();
			Object.keys(ifaces).forEach(function (ifname) {
				iface = ifaces[ifname];
				for (const net of iface) {
					if (net.address !== '127.0.0.1' && net.address !== '::1') {
						if (net.family === 'IPv4') {
							urls.push(`${net.address}:${info.port}`);
						}
					}
				}
			});

			if (urls.length === 0) {
				urls.push(`127.0.0.1:${info.port}`);
			}

			const elementList = document.querySelector('#ojd-server-address ul');
			elementList.innerHTML = "";

			for (const url of urls) {
				const li = document.createElement('li');
				li.innerHTML = url;
				elementList.appendChild(li);
			}

			document.querySelector('#ojd-server-address').style['display'] = 'block';

		} else {
			document.querySelector('#ojd-server-status').classList.remove('ojd-status-good');
			document.querySelector('.ojd-status-server').classList.add('ojd-status-bad');
			document.querySelector('#ojd-server-status .ojd-indicator-text').innerHTML = 'Server Not Started';
		}
	}

	// Start Server
	const {Server} = require(window.OJD.appendCwdPath("app/js/server.js"));
	testServer = new Server(9001, updateServerStatus);
	testServer.start();

	// Joystick Events
	window.addEventListener("gamepadconnected", function() {
		const joysticks = navigator.getGamepads();
		if (joysticks[0] && joysticks[0].connected) {
			updateControllerStatus(true, joysticks[0]);
		}
	});
	window.addEventListener("gamepaddisconnected", function() {
		updateControllerStatus(false, {});
	});


});