window.onAjaxReturned = function(url, res){
	var json = res;
	$("#title").html(json["bookinfo"]["title"]);
	$("#isbn").html("ISBN: " + json["bookinfo"]["isbn13"]);
	$("#author").html("作者：" + json["bookinfo"]["author"]);
	$("#picture").html("<img src='" + json["link"][2]["@href"] + "'>");
	$("#summary").html("推荐阅读：<br>" + json["summary"]["$t"]);
};

window.onBarcodeScanSuccessed = function(text, format, type, metadata, content){
	var text = unescape(text);
	var fm = unescape(format);
	var type = unescape(type);
	var md = unescape(metadata);
	var con = unescape(content);
	$.getJSON("http://10.13.124.201:3000/getapi?isbn=" + text + "&callback=?", function(data){
		$.sessionStorage.setItem("book", JSON.stringify(data));
		onAjaxReturned("", data);
	});
}
$("#ClickToScan").click(function(){
	rexseeBarcode.start(true,false,false);
});