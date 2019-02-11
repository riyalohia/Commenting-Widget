var ls = localStorage;
class localStorageHandler {
	set(key, val) {
        ls.setItem(key, JSON.stringify(val));
	};
	get(key) {
        return JSON.parse(ls.getItem(key));
	};
}

let form = document.getElementById('mainForm');
let html = '<div class="group">\
                <input type="text" id="email"></p></span><span class="bar"></span>\
                <label>Email</label>\
            </div>\
            <div class="group">\
                <input type="text" id="password"></span>\
                <label>Password</label>\
            </div>';

// Sign Up and LogIn Form
makeForm = function (event) {
	form.innerHTML = '';
	form.innerHTML = html;
	if (event.target.id == 'signUpForm') {
		form.innerHTML +=  '<div id = "loadImage">\
                			<input type="file" id="bannerImg"  />\
							<img src="" id="tableBanner" height="100px"/>\
							<div id="res"></div>\
            		    </div>\
						<button type="button" id="signUp" class="button buttonBlue">\
							Sign Up\
                	  	</button>';

		let bannerImage = document.getElementById('bannerImg');
		bannerImage.addEventListener("change", imageHandler);
		var signUp = document.getElementById('signUp');
	} else {
		form.innerHTML = '';
		form.innerHTML = html;
		form.innerHTML += '<button type="button" id="LogIn" class="button buttonBlue">\
							LogIn\
                	  	   </button>';
        var signUp = document.getElementById('LogIn');	
	}

	signUp.addEventListener("click", signUpUser);
	
}

// Sign Up Button
let signUpForm = document.getElementById('signUpForm');
signUpForm.addEventListener("click", makeForm);

// Login Button
let loginForm = document.getElementById('loginForm');
loginForm.addEventListener("click", makeForm);


// Take the details of user from signup/login form.
signUpUser = function(event) {
  	let id = document.getElementById('email');
 	let password = document.getElementById('password').value;

 	if (event.target.id == 'signUp') {
 		let img = document.getElementById('tableBanner');
  		let userDetails = new UserSignUp(id.value, password, img);
  		userDetails.addUserDetails();
  		alert('Sign Up Successful');
  		makeForm(event);
 	} else {
 		let userlogin = new UserLogIn(id.value, password);
 		userlogin.checkUserDetails();
 	}
  	
}

// Add user details in 'users' database.
class UserSignUp {
  	constructor(id, password, img) {
    	this.id = id;
    	this.password = password;
    	this.img = img;
  	}
  	addUserDetails() {
  		let localStorageWork = new localStorageHandler();
  		if (localStorageWork.get('users') == null) {
  			var users = new Object();
  		} else {
  			var users = localStorageWork.get('users');
  		}
  		let id = this.id;
  		users[id] = [this.password, getBase64Image(this.img)];
  		localStorageWork.set('users', users);
  		console.log(localStorageWork.get('users'));
  	}
}

class UserLogIn {
	constructor(id, password) {
		this.id = id;
		this.password = password;
	}
	checkUserDetails() {
		let localStorageWork = new localStorageHandler();
		let users = localStorageWork.get('users');
		for (var id in users) {
			if (id == this.id) {
				let password = users[id][0];
				if (password == this.password) {
					alert("Login Successful");
					break;
				} else {
					alert("Enter Correct Password");
					break;
				}
			}
		}
	}
}

class Reply extends localStorageHandler {
	constructor(chat) {
		super();
    	this.chat = chat;
  	}
  	showChat() {
  		super.set('chat', this.chat);
  	}
  	makeNode(ide) {
		var node = document.createElement("LI");
  		var textnode = document.createTextNode("Water");
  		var btn = document.createElement("BUTTON");
  		var textnode1 = document.createTextNode("Reply");
  		var id=Number(ide)+1;
  		btn.appendChild(textnode1);
  		btn.setAttribute("id", id);
  		btn.setAttribute("class", "replyButton");
  		node.appendChild(textnode);
  		node.appendChild(btn);
  		node.setAttribute("id", "li_"+id);
  		return node;
	}
  	addBiggerReply() {
  		let ulNode = document.getElementById("chatsection");
  		ulNode.appendChild(this.makeNode());
  		var buttonArray = document.getElementsByClassName('replyButton');
    	for(var i = 0; i < buttonArray.length; i++)
    	{
    		buttonArray[i].addEventListener("click", reply_click);
    	}
  	}
  	addNestedReply(event) {
  		var parentNode = event.target.parentNode;
  		parentNode.appendChild(this.makeNode());
  		var buttonArray = document.getElementsByClassName('replyButton');
    	for(var i = 0; i < buttonArray.length; i++) {
    		buttonArray[i].addEventListener("click", this.addNestedReply);
    	}
  	}

}

checkUsername = function(id) {
	let localStorageWork = new localStorageHandler();
	let users = localStorageWork.get('users');
	if (users == null) {
		//return false;
	}
	for (username in users) {
		if (id.value == username) {
			id.innerHTML = '';
			break;
		}
	}
	
}



/*var reply = document.getElementById('reply');

reply.addEventListener('click', function getTarget(e) {
  e.preventDefault();
  var chat = document.getElementById('chat').value;
  let chats = new Reply(chat);
  chats.showChat();
  chats.addBiggerReply();
});*/

reply_click = function(event) {
	var parentNode = event.target.parentNode;
	var node = document.createElement("LI");
  	var textnode = document.createTextNode("Water");
  	var btn = document.createElement("BUTTON");
  	var textnode1 = document.createTextNode("Reply");
  	var id=Number(event.target.id)+1;
  	btn.appendChild(textnode1);
  	btn.setAttribute("id", id);
  	btn.setAttribute("class", "replyButton");
  	node.appendChild(textnode);
  	node.appendChild(btn);
  	node.setAttribute("id", "li_"+id);
  	parentNode.appendChild(node);
  	var buttonArray = document.getElementsByClassName('replyButton');
    for(var i = 0; i < buttonArray.length; i++) {
    	buttonArray[i].addEventListener("click", reply_click);
    }
}

// Image Handler Functions
getBase64Image = function(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

imageHandler = function() {
	let result = document.getElementById('res');
	let img = document.getElementById('tableBanner');
    let file = this.files[0];

    if (file.type.indexOf('image') < 0) {
        res.innerHTML = 'invalid type';
        return;
    }

    let fReader = new FileReader();

    fReader.onload = function() {
        img.src = fReader.result;
    };

    fReader.readAsDataURL(file);
};