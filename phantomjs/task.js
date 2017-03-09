//var page = require('webpage').create();

// page.onConsoleMessage = function(msg) {
//     console.log(msg);
// };

// page.onResourceRequested = function (req) {
//     console.log('requested: ' + JSON.stringify(req, undefined, 4));
// }; 

// page.onResourceReceived = function (res) {
//     console.log('received: ' + JSON.stringify(res, undefined, 4));
// }; 


// page.open('https://www.baidu.com/s?wd=javasctipt', function() {
// 	console.log('Status: ' + status);
// 	if (status === "success") {
// 		page.includeJs("http://libs.baidu.com/jquery/1.9.1/jquery.min.js", function() {
// 	    page.evaluate(function() {
		    
// 		});

// 		phantom.exit(0);
// 	}else{
// 		phantom.exit(1);
// 	}

  
// });


// var page = require('webpage').create(),
// 	system = require('system'),
// 	address;
// if (system.args.length === 1) {
// 	phantom.exit(1);
// } else {
// 	address = system.args[1];
// 	page.open(address, function (status) {
// 		console.log(page.content);
// 		phantom.exit();
// 	});
// }


// var page = require('webpage').create();
// page.onResourceRequested = function(request) {
//   console.log('Request ' + JSON.stringify(request, undefined, 4));
// };
// page.onResourceReceived = function(response) {
//   console.log('Receive ' + JSON.stringify(response, undefined, 4));
// };
// page.open('http://www.baidu.com');





// var responseData={
//    code: 1, //返回状态码，1为成功，0为失败
//    msg: '抓取成功', //返回的信息
//    word: '示例关键字', //抓取的关键字
//    time: 2000, //任务的时间
//    dataList:[   //抓取结果列表
//        {
//            title: 'xx',  //结果条目的标题
//            info: ‘’, //摘要
//            link: ‘’, //链接            
//            pic: '' //缩略图地址
//            }
//    ]
// };
var page = require('webpage').create();
var system = require('system');
var url="https://www.baidu.com/s?wd=";
var t = Date.now();
var word="";
var resData={};
if(system.args.length===1){
	t = Date.now() - t;
	resData.code=0;
	resData.msg='请输入关键词';
	resData.time=t;
	resData.dataList=[];
	console.log(JSON.stringify(resData));
	phantom.exit(1);
}else{
	word=system.args[1];
	page.open(url+word,function(status){
		if (status !== 'success') {
			t = Date.now() - t;
		    resData.code=0;
			resData.msg='网络连接失败';
			resData.time=t;
			resData.dataList=[];
			console.log(JSON.stringify(resData));
		} else {
			t = Date.now() - t;
			resData.code=1;
			resData.msg='请求成功';
			resData.time=t;
			resData.dataList=[];
			page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
				var data = page.evaluate(function() {
					items=$('.result');
					var _items=[]
					$result.each(function() {
	                    var imgs = $(this).find('.c-img')
	                    data.push({
	                        title: $(this).children('h3').text(),
	                        info: $(this).find('.c-abstract').text(),
	                        link: $(this).find('h3 a')[0].href,
	                        pic: imgs.length > 0 ? imgs[0].src : ''
	                    })
	                })
			    	return _items;
				});
				resData.dataList=data;
			});
			phantom.outputEncoding = 'gb2312';
			console.log(JSON.stringify(resData));
		}
		phantom.exit();
	});
}