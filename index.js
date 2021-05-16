const fs = require("fs"),
	colors = require("colors/safe");

const flag = iso => String.fromCodePoint(...[...iso.toUpperCase()].map(char => char.charCodeAt(0) + 0x1f1a5)),
	get = ip => fetch(`http://ip-api.com/json/${ip}?fields=62638079`).then(r => r.json()),
	ipRegex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}(?:\:(?:\d{1,4}|[1-6](?:[0-4]\d{3}|5[0-4]\d{2}|55[0-2]\d|553[0-5])))?$/;

const fail = msg => {
	console.log(colors.bgRed.white("ERROR: " + msg));
	process.exit(0);
};

//#region Parse arguments
const argv = process.argv.slice(2);
const options = {ip: [], flags: {}};
const validFlags = new Set("help", "h", "-help", "v", "version", "format");

for (let i = 0; i < argv.length; i++) {
	const arg = argv[i];
	if (arg.indexOf("-") === 0) {
		const equalsPos = arg.indexOf("=");
		const flagName = (equalsPos === -1 ? arg.slice(1) : arg.slice(1, equalsPos)).toLowerCase();
		if (!validFlags.has(flagName)) fail(`Unrecognized flag ${flagName}`);
		const flagValue = equalsPos === -1 ? true : arg.slice(equalsPos + 1);
		options[flagName] = flagValue;
	} else if (ipRegex.test(arg)) {
		options.ip.push(arg);
	} else {
		fail(`Invalid IP '${arg}'`);
	}
}

if (typeof options.flags.format !== "string") {
	fail(`Format must be one of ${colors.gray("json, newline, csv, pretty")}`);
}

//#endregion
