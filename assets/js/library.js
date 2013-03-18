$(document).bind("pageinit", function(){
	$.sessionStorage.setItem("host", "http://10.13.124.200:8080/book");
	
	$("#App-submit").click(function(e){
		var host = $.sessionStorage.getItem("host");
		var login = host + "/login";
		
		$.post(login, $('#loginForm').serialize(), function(data) {			
			if(data.isSuccess){
				$.sessionStorage.setItem("userinfo", JSON.stringify(data.userinfo));
				window.location.href = "list.html";
				//$.mobile.changePage("list.html");
			}else{
				alert("登录失败，请检查用户名和密码。");
			}
		}, 'json');
		
		e.preventDefault();
	});
});