function book(cfg){
	this.host = cfg.host;
};

book.prototype = {
	itemReplace: function(t, d){
		var temp = t;
		for(var n in d){
			temp = temp.replace(new RegExp("\{\{" + n + "\}\}", "g"), d[n]);
		}
		return temp;
	},
	getData: function(url, tpl, dest){
		var _this = this;
		$.getJSON(url, function(data){
			if(data.isSuccess){
				var tpls = $(tpl).html();
				var ct = $(dest);
				var list = data.books.list, len = list.length;
				var str = "";
				for(var i = 0; i < len; i++){
					list[i].href = "detail.html?isbn=" + list[i].isbn;
					str += _this.itemReplace(tpls, list[i]);
				}
				
				ct.html(str);
				_this.bindEvent($(ct).find("a"));
			}else{
				alert("图书列表获取失败。");
			}
		});
	},
	/*bindEvent: function(nodes){
		$(nodes).each(function(i, n){
			$(n).click(function(ev){
				ev.preventDefault();
				$.sessionStorage.setItem("isbn", $(n).attr("data-isbn"));
				window.location.href = $(n).attr("href");
			});
		});
	},*/
	scanSuccess: function(text, format, type, metadata, content){
		var _this = this;
		var text = unescape(text);
		var fm = unescape(format);
		var type = unescape(type);
		var md = unescape(metadata);
		var con = unescape(content);
		//alert(text + ": " + type);
		//alert(text + "--" + type + "--" + $.sessionStorage.getItem("userinfo"));
		//var userinfo = JSON.parse($.sessionStorage.getItem("userinfo"));
		if(type.toUpperCase() === "ISBN"){
			//alert(_this.host + "/scanborrow?isbn=" + text + "&nick=" + userinfo.nick + "callback=?");
			$.getJSON(_this.host + "/scanborrow?isbn=" + text + "&callback=?", function(data){
				//$.sessionStorage.setItem("book", JSON.stringify(data));
				_this.onAjaxReturned("", data);
			});
		}else{
			_this.onAjaxReturned("", {"isSuccess": false, "error": "条码类型错误。"});
		}
	},
	onAjaxReturned: function(url, data){
		if(data.isSuccess){
			alert("图书《" + data.bookname + "》借阅成功！");
		}else{
			alert(data.error);
		}
	}
};

$(document).bind("pageinit", function(){
	var host = $.sessionStorage.getItem("host");
	var api = host + "/mindex?callback=?";
	//console.log(host);
	//console.log($.sessionStorage.getItem("userinfo"));
	var bs = new book({host: host});

	bs.getData(api + "&t=" + new Date().getTime(), "#App-template", "#App-list");

	$("#App-search").click(function(e){
		e.preventDefault();
		var kw = $("#App-kw").val();
		bs.getData(api + "&keyword=" + kw + "&t=" + new Date().getTime(), "#App-template", "#App-list");
	});

	$("#App-borrow").click(function(e){
		e.preventDefault();
		window.onBarcodeScanSuccessed = function(){
			var args = arguments;
			bs.scanSuccess.apply(bs, args);
		};
		rexseeBarcode.start(true,false,false);
	});
});