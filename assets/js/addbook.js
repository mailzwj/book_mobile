$(document).bind("pageinit", function(){
	var host = $.sessionStorage.getItem("host");
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
		});
		e.preventDefault();
	});
});