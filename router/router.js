function makeRoutes(routes) {
	return routes.map(function (route) {
		return Object.assign(
			{},
			route,
			{ pattern: route.pattern instanceof RegExp ? route.pattern : new RegExp(route.pattern) }
		);
	});
}

function getValues(route) {
	var ret = {};
	for (var key in route) {
		if (key !== 'middleware' && key !== 'pattern') {
			ret[key] = route[key];
		}
	}
	return ret;
}

function createRouter(routes) {

	var regexRoutes = makeRoutes(routes);

	var length = regexRoutes.length;
	return function (str, extraArgs) {

		for (var i = 0; i < length; i++) {
			var route = regexRoutes[i];
			var solved = route.pattern.exec(str);

			if (!solved) continue;

			var ret = Object.assign(
				{},
				getValues(route),
				solved.groups
			);
			if (route.middleware) {
				var result = route.middleware(ret, extraArgs);
				if (result === true) return ret;
				if (result) return result;
			} else return ret;
		}

		return null;
	};
};

function convertRouterExcute(url) {
	const regex = /{(.*?)}/g;

	var params = url.match(regex);
	if (params == null) {
		return url;
	}
	params.forEach(param => {
		var paramTemp = param.replace('{', '').replace('}', '');
		console.log(paramTemp, param)
		url = url.replace(param, `(?<${paramTemp}>(\\w|-)+)`)
	});
	return url;
}
//async function loadRouterjson() {
//	var json = await fetch("/Packages/router.json").then((response) =>
//		response.json()
//	);
//	json.forEach(element => {
//		console.log(element.Route);
//		routes.push({ pattern: `^/${convertRouterExcute(element.Route)}/?$`, result: element.PageId })
//	});
//	routes.push({ pattern: '', result: json[0].PageId });
//}