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
				//_this.bindEvent($(ct).find("a"));
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
	scanSuccess: function(text, type){
		var _this = this;
		var text = text;
		var type = type;
		//if(sf === "borrow"){
		if(type.toUpperCase() === "EAN_13"){
			$.getJSON(_this.host + "/scanborrow?isbn=" + text + "&callback=?", function(data){
				_this.onAjaxReturned("", data);
			});
		}else{
			_this.onAjaxReturned("", {"isSuccess": false, "error": "条码类型错误。"});
		}
		//}
	},
	goAddBook: function(text, type){
        var _this = this;
        var text = text;
        var type = type;
        //if(sf === "borrow"){
        if(type.toUpperCase() !== "EAN_13"){
            text = "";
        }
        $.mobile.changePage($("#AppAddBook"));
        
        $("#App-isbn").val(text);
        //}
    },
    returnSuccess: function(text, type){
        var _this = this;
        var text = text;
        var type = type;
        //if(sf === "borrow"){
        if(type.toUpperCase() !== "EAN_13"){
            text = "";
        }
        $.mobile.changePage($("#AppReturnBook"));
        
        $("#App-risbn").val(text);
        /*$.getJSON(_this.host + "/mreturn?isbn=" + text + "&callback=?", function(data){
            //_this.onAjaxReturned("", data);
            if(data.isSuccess){
                alert(data.book);
            }else{
                alert(data.error);
            }
        });*/
        //}
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
	var userinfo = JSON.parse($.sessionStorage.getItem("userinfo"));
	var bs = new book({host: host});

	bs.getData(api + "&t=" + new Date().getTime(), "#App-template", "#App-list");
    
    if(userinfo.isadmin !== 0){
        $("#App-manage").css("display", "block");
    }
    
    $("#App-search").unbind("click");
	$("#App-search").click(function(e){
		e.preventDefault();
		var kw = $("#App-kw").val();
		bs.getData(api + "&keyword=" + kw + "&t=" + new Date().getTime(), "#App-template", "#App-list");
	});
    
    $("#App-borrow").unbind("click");
	$("#App-borrow").click(function(e){
		window.plugins.barcodeScanner.scan(function(result) {
            if(result.cancelled){
                alert("取消借书。");
            }else{
                //alert("扫描结果如下：\n" + "解码: " + result.text + "\n" + "编码类型: " + result.format);
                //alert(result.format);
                bs.scanSuccess(result.text, result.format);
            }
        }, function(error) {
            alert("扫描失败: " + error);
        });
        e.preventDefault();
	});
	
	$("#App-return").unbind("click");
    $("#App-return").click(function(e){
        window.plugins.barcodeScanner.scan(function(result) {
            if(result.cancelled){
                alert("取消还书。");
            }else{
                bs.returnSuccess(result.text, result.format);
            }
        }, function(error) {
            alert("扫描失败: " + error);
        });
        e.preventDefault();
    });
	
	$("#App-add").unbind("click");
	$("#App-add").click(function(e){
        window.plugins.barcodeScanner.scan(function(result) {
            if(result.cancelled){
                alert("取消添加。");
            }else{
                //alert("扫描结果如下：\n" + "解码: " + result.text + "\n" + "编码类型: " + result.format);
                //alert(result.format);
                bs.goAddBook(result.text, result.format);
            }
        }, function(error) {
            alert("扫描失败: " + error);
        });
        e.preventDefault();
	});
	
	$("#App-addbook").unbind("click");
	$("#App-addbook").click(function(e){
        var isbn = $("#App-isbn").val();
        var cate = $("#App-cate").val();
        var numb = $("#App-number").val();
        var save = host + "/madd?callback=?&isbn=" + isbn + "&bookcate=" + cate + "&number=" + numb;

        $.getJSON(save + "&t=" + new Date().getTime(), function(data){
            if(data.isSuccess){
                alert(data.book);
            }else{
                alert(data.error);
            }
            $.mobile.changePage($("#AppBookList"));
        });
        e.preventDefault();
    });
    
    $("#App-returnbook").unbind("click");
    $("#App-returnbook").click(function(e){
        var isbn = $("#App-risbn").val();
        var nick = $("#App-rname").val();
        var rb = host + "/mreturn";
        $.post(rb, $("#App-returnForm").serialize(), function(data){
            var json = {};
            if(typeof data === "string"){
                json = JSON.parse(data);
            }else{
                json = data;
            }
            if(json.isSuccess){
                alert(json.book);
            }else{
                alert(json.error);
            }
            $.mobile.changePage($("#AppBookList"));
        });
        e.preventDefault();
    });
});