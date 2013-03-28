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
                    list[i].href = "?isbn=" + list[i].isbn + "#AppBookDetail";
                    //list[i].href = "javascript:void(0);";
                    str += _this.itemReplace(tpls, list[i]);
                }
                
                ct.html(str);
                _this.bindEvent($(ct).find("a"));
            }else{
                alert("图书列表获取失败。");
            }
        });
    },
    bindEvent: function(nodes){
        $(nodes).each(function(i, n){
            $(n).click(function(ev){
                currentisbn = $(n).attr("data-isbn");
            });
        });
    },
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

var _detailBook = {
    detail: function(cfg){
        this.host = cfg.host;
    }
};

_detailBook.detail.prototype = {
    itemReplace: function(t, d){
        var temp = t;
        if(d !== 'undefined'){
	        for(var n in d){
	            temp = temp.replace(new RegExp("\{\{" + n + "\}\}", "g"), d[n]);
	        }
	    }else{
	       temp = "";
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
                list.href = "?isbn=" + list.isbn + "#AppBookDetail";
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

var currentisbn = "";

$(document).bind("pageinit", function(){
	$.sessionStorage.setItem("host", "http://10.13.124.201:8080/book");
	//点击登录
	$("#App-submit").unbind("click");
	$("#App-submit").click(function(e){
		var host = $.sessionStorage.getItem("host");
		var login = host + "/login";
		
		$.post(login, $('#loginForm').serialize(), function(data) {
		    //alert(JSON.stringify(data));		
			if(data.isSuccess){
				$.sessionStorage.setItem("userinfo", JSON.stringify(data.userinfo));
				//window.location.href = "list.html";
				$.mobile.changePage($("#AppBookList"));
			}else{
				alert("登录失败，请检查用户名和密码。");
			}
		}, 'json');
		
		e.preventDefault();
	});
	
	//退出功能
	$(document).unbind("backbutton");
	$(document).bind("backbutton", function(){
	    navigator.app.exitApp();
	});
});
//获取图书列表
$("#AppBookList").bind("pageshow", function(event, ui){
    //alert("changePage is show!");
	var host = $.sessionStorage.getItem("host");
    var api = host + "/mindex?callback=?";
    var userinfo = JSON.parse($.sessionStorage.getItem("userinfo"));
    var bs = new book({host: host});

    bs.getData(api + "&t=" + new Date().getTime(), "#App-template", "#App-list");
    
    if(userinfo.isadmin !== 0){
        $("#App-manage").css("display", "block");
    }
    //搜索图书
    $("#App-search").unbind("click");
    $("#App-search").click(function(e){
        e.preventDefault();
        var kw = $("#App-kw").val();
        bs.getData(api + "&keyword=" + kw + "&t=" + new Date().getTime(), "#App-template", "#App-list");
    });
    //扫描借书按钮点击事件
    $("#App-borrow").unbind("click");
    $("#App-borrow").click(function(e){
        try {
           window.plugins.barcodeScanner.scan(function(result) {
               if(result.cancelled){
                   alert("取消借书。");
               }else{
                   //alert("扫描结果如下：\n" + "解码: " + result.text + "\n" + "编码类型: " + result.format);
                   //alert(result.format);
                   bs.scanSuccess(result.text, result.format);
               }
           });
       } catch (ex) {
            alert(ex.message);
       }
        e.preventDefault();
    });
    //扫描还书按钮点击事件
    $("#App-return").unbind("click");
    $("#App-return").click(function(e){
        try {
            window.plugins.barcodeScanner.scan(function(result) {
                if(result.cancelled){
                    alert("取消还书。");
                }else{
                    bs.returnSuccess(result.text, result.format);
                }
            });
        } catch (ex) {
            alert(ex.message);
        }
        e.preventDefault();
    });
    //通过扫描添加书籍点击事件
    $("#App-add").unbind("click");
    $("#App-add").click(function(e){
        try {
            window.plugins.barcodeScanner.scan(function(result) {
                if(result.cancelled){
                    alert("取消添加。");
                }else{
                    //alert("扫描结果如下：\n" + "解码: " + result.text + "\n" + "编码类型: " + result.format);
                    //alert(result.format);
                    bs.goAddBook(result.text, result.format);
                }
            });
        } catch (ex) {
            alert(ex.message);
        }
        e.preventDefault();
    });
});
$("#AppAddBook").bind("pageshow", function(event, ui){
    //保存书籍按钮点击事件
    $("#App-addbook").unbind("click");
    $("#App-addbook").click(function(e){
        var host = $.sessionStorage.getItem('host');
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
});

$("#AppAddBook").bind("pagehide", function(){
    $("#App-isbn").val("");
    $("#App-cate").val("");
    $("#App-number").val("");
});

$("#AppReturnBook").bind("pageshow", function(event, ui){
    //确认还书按钮点击
    $("#App-returnbook").unbind("click");
    $("#App-returnbook").click(function(e){
        var host = $.sessionStorage.getItem('host');
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

$("App-returnbook").bind("pagehide", function(){
    $("#App-risbn").val("");
    $("#App-rname").val("");
});

//图书详情
$("#AppBookDetail").bind("pageshow", function(event, ui){
    //alert(11);
	var host = $.sessionStorage.getItem("host");
    //var reg = /isbn=(\d+)(#|\&|$)/;
    //var isbn = "";
    //var arr = window.location.href.match(reg);
    //alert(window.location.href);
    //if(arr.length > 0){
    //    isbn = arr[1];
    //    reg.lastIndex = 0;
    //}
    //alert("ISBN:" + isbn);
    var api = host + "/mdetail?isbn=" + currentisbn + "&callback=?";
    var bsd = new _detailBook.detail({host: host});
    
    bsd.getData(api + "&t=" + new Date().getTime(), "#App-detailtemplate", "#App-detail");

    $("#App-history .his-title").unbind("click");
    $("#App-history .his-title").click(function(e){
        bsd.renderHistory("#App-hisTemp", "#App-history .his-main");
    });

    $("#App-Comments .com-title").unbind("click");
    $("#App-Comments .com-title").click(function(e){
        bsd.renderComment("#App-comTemp", "#App-Comments .com-main");
    });
});

$("#AppBookDetail").bind("pagehide", function(){
    $("#App-detail").html("");
    $("#App-history .his-main").html("");
    $("#App-Comments .com-main").html("");
});
