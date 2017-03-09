phantom.outputEncoding = 'utf-8';									//修复控制台乱码

var webpage = require("webpage"),
	system = require("system"),
	fs = require("fs");												//调用文件系统模块

var keyword = system.args[1],										//搜索关键字
	devices = system.args[2],										//设备
	path = "result2.json",											//生成JSON文件名
	page = webpage.create(),
	url = "https://www.baidu.com/s?wd=" + encodeURI(keyword);		//访问url
	jquery = 'https://code.jquery.com/jquery-3.1.1.min.js',
	time = Date.now(),
	result = {};

var devicesconfig = {												//设备信息初始化
	iPhone5: {
		ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
		width: 320,
		height: 568
	},
	iPhone6: {
		ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
		width: 375,
		height: 667
	},
	iPad: {
		ua: "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
		width: 768,
		height: 1024
	}
};

if (system.args.length === 1 || system.args.length === 2  || system.args.length > 3) {
	console.log("Format ERROR, Please enter Keyword and Device name.");
	phantom.exit();
}

if (system.args[2] !== "iPhone5" && system.args[2] !== "iPhone6" && system.args[2] !== "iPad") {
	console.log("Device name only: iPhone5, iPhone6, iPad.");
	phantom.exit();
}

page.settings.userAgent = devicesconfig[devices].ua;

page.viewportSize = {
	width: devicesconfig[devices].width,
	height: devicesconfig[devices].height
}

page.onConsoleMessage = function (msg) {
	console.log("msg:" + msg);
}

page.open (url, function (status) {
	page.includeJs (jquery, function (){
		var resultfile = page.evaluate ( function (status, result, time, keyword) {
			if (status !== "success") {
				result.code = 0;
				result.msg = "抓取失败";
				result.word = keyword;
				result.time = Date.now() - time;
				result.device = [];
				result.dataList = [];
			} else {
				result.code = 1;
				result.msg = "抓取成功";
				result.word = keyword;
				result.time = 0;
				result.device = [];
				result.dataList = [];
				$(".c-container").each ( function () {
					var list = {};
					list.title = $(this).find(".t").text().trim();
					var abstract = $(this).find(".c-abstract");
					var subabstract = $(this).find(".c-span24.c-span-last p");
					list.info = "";
					if (abstract.length > 0) {
						list.info = abstract.text().trim();
					}
					if (subabstract.length > 0) {
						list.info = subabstract.text().trim();
					}
					list.link = $(this).find(".t a").attr("href");
					list.pic = "";
					var picture = $(this).find(".c-img");
					if (picture.length > 0) {
						list.pic = picture.attr("src");
					}
					result.dataList.push(list);
				})
				var devicelist = {};
				devicelist.ua = window.navigator.userAgent;
				devicelist.width = document.body.clientWidth;
				devicelist.height = document.body.clientHeight;
				result.device.push(devicelist);
				result.time = Date.now() - time;
				return JSON.stringify(result, undefined, 4);
			}
		}, status, result, time, keyword);
		fs.write(path, resultfile, "w");							//生成JSON
		console.log(resultfile);									//显示JSON
		var pagetitle = page.evaluate( function () {
			return document.title;
		})
		page.clipRect = {
					top: 0,
					left: 0,
					width: devicesconfig[devices].width,
					height: devicesconfig[devices].height
		};
		page.render( "[" + devices + "截屏]：" + pagetitle + ".jpg", { format: "jpg", quality: "100"});
		phantom.exit();
	});
});