$(document).bind("pageinit", function(){
	$.sessionStorage.setItem("host", "http://10.13.124.224:8080/book");
	$("#App-submit").click(function(e){
		var un = $("#App-user").val();
		var up = $("#App-pass").val();
		var host = $.sessionStorage.getItem("host");
		var login = host + "/login?callback=?&username=" + un + "&password=" + up;

		$.getJSON(login + "&t=" + new Date().getTime(), function(data){
		    //alert(JSON.stringify(data));
			if(data.isSuccess){
				$.sessionStorage.setItem("userinfo", JSON.stringify(data.userinfo));
				window.location.href = "list.html";
				//$.mobile.changePage("list.html");
			}else{
				alert("登录失败，请检查用户名和密码。");
			}
		});
		e.preventDefault();
	});
});