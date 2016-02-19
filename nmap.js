var nmap = require('node-nmap');

module.exports = function(RED) {

	function NmapNode(n) {
		RED.nodes.createNode(this,n);
		var node = this;
		node.target = n.target;
		node.scantype = n.scantype;

		node.on("input", function(msg) {

			var scan;

			switch(node.scantype) {
				case "QuickScan":
					scan = new nmap.nodenmap.QuickScan(node.target);
					break;
				case "OsAndPortScan":
					scan = new nmap.nodenmap.OsAndPortScan(node.target);
					break;
				default:
					node.error("Unknown scan type: "+node.scantype);
			}

			scan.on('complete', function(data){
				msg.payload = data;
				node.send(msg);
			});

			scan.on('error', function(error){
				node.error(error);
			});

			scan.startScan();
		});


	}
	RED.nodes.registerType("nmap", NmapNode);
};
