var _detailBook = {
	detail: function(cfg){
		this.host = cfg.host;
	}
};

_detailBook.detail.prototype = {
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
				var list = data.book;
				_detailBook.book = list;
				list.href = "detail.html?isbn=" + list.isbn;
				list.book_number = list.book_total - list.book_borrowed;
				var str = "";
				str = _this.itemReplace(tpls, list);
				
				ct.html(str);
			}else{
				alert("图书列表获取失败。");
			}
		});
	},
	renderHistory: function(tpl, con){
		var _this = this;
		var tplc = $(tpl).html();
		var hcon = $(con);
		var hs = _detailBook.book.history, hlen = hs.length;
		var html = "";
		for(var i = 0; i < hlen; i++){
			html += _this.itemReplace(tplc, hs[i]);
		}
		hcon.html(html);
	},
	renderComment: function(tpl, con){
		var _this = this;
		var tplc = $(tpl).html();
		var hcon = $(con);
		var hs = _detailBook.book.comments, hlen = hs.length;
		var html = "";
		for(var i = 0; i < hlen; i++){
			html += _this.itemReplace(tplc, hs[i]);
		}

		hcon.html(html);
	}
};

$(document).bind("pageinit", function(){
	var host = $.sessionStorage.getItem("host");
	var reg = /isbn=(\d+)(\&|$)/;
	//var isbn = $.sessionStorage.getItem("isbn");
	var isbn = "";
	//console.log(window.location.href.match(reg));
	var arr = window.location.href.match(reg);
	if(arr.length > 0){
		isbn = arr[1];
		reg.lastIndex = 0;
	}
	var api = host + "/mdetail?isbn=" + isbn + "&callback=?";
	//console.log(host);
	//console.log($.sessionStorage.getItem("userinfo"));
	var bs = new _detailBook.detail({host: host});

	bs.getData(api + "&t=" + new Date().getTime(), "#App-template", "#App-detail");

	$("#App-history .his-title").click(function(e){
		bs.renderHistory("#App-hisTemp", "#App-history .his-main");
	});

	$("#App-Comments .com-title").click(function(e){
		bs.renderComment("#App-comTemp", "#App-Comments .com-main");
	});
});