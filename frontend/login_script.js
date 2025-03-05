
function clicked(id1,id2){
    const element1=document.getElementById(id1)
    const element2=document.getElementById(id2)
    element1.style.backgroundImage='linear-gradient(to right, rgb(132, 0, 255),rgb(179, 0, 255),rgb(239, 6, 239))'
    element2.style.backgroundColor='white'
    
}
var state="176px"
var e2_state="-176px"
var bkg_color='linear-gradient(to left, rgb(132, 0, 255),rgb(179, 0, 255),rgb(239, 6, 239))'
var text="Sign Up"
var sign_in_state="none"
var sign_up_state="visible"
function move(){
  const element=document.getElementById("sign-in");
  const sign_in=document.getElementById("middle-bar-sign-in")
  const sign_up=document.getElementById("middle-bar-sign-up")
  element.style.translate=state;
  element.style.backgroundImage=bkg_color;
  element.innerHTML=text;
  sign_in.style.display=sign_in_state;
  sign_up.style.visibility=sign_up_state;
  if (state==="176px"){
    state="0px";
    e2_state="0px"
    bkg_color="linear-gradient(to right, rgb(132, 0, 255),rgb(179, 0, 255),rgb(239, 6, 239))";
    text="Sign In";
    sign_in_state="flex";
    sign_up_state="hidden"
  }
  else{
    state="176px";
    e2_state="-176px"
    bkg_color='linear-gradient(to left, rgb(132, 0, 255),rgb(179, 0, 255),rgb(239, 6, 239))';
    text="Sign Up"
    sign_in_state="none";
    sign_up_state="visible"
  }
}

const dragElement = document.getElementById("sign-in-btn");

function create_account(){
  alert("Account Created Successfully")
}


async function send_data() {
  const fname = document.getElementById("fname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cnf_password = document.getElementById("cnf_password").value;
  if (fname.length===0){
    alert("Please enter your full name")
  } 
  else if(email.length===0){
    alert("Please enter your email")
  }
  else if (password.length==0 || cnf_password.length==0){
    alert("Please enter password")
  }
  else if (password!==cnf_password) {
    alert("Password is not same as confirm password")
  }
  else{
  const response = await fetch("https://my-to-do-web-app.vercel.app/submit", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ "fname":fname,"email":email,"password":password }),
  });

  const result = await response.json();
  alert(result.message);
}
}

async function login() {
  const email_login = document.getElementById("email_login").value;
  const password_login = document.getElementById("password_login").value;
  const response = await fetch(`https://my-to-do-web-app.vercel.app/credentials`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({"email_login":email_login,"password_login":password_login }),
    credentials:"include"
});
  data= await response.json()
  console.log(data)
  // if (response.ok){
  //   window.location.href = "todo";
  // }
  // else{
  //   alert("Login Failed");
  // }
  console.log(data.message)
  alert(data.message)
 
}
function enter_btn_login(el){
	el.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
		  login()
		}
	  });
}
function enter_btn_sign_up(el){
	el.addEventListener("keydown", function(event) {
		if (event.key === "Enter") {
		  send_data()
		}
	  });
}
enter_btn_login(document.getElementById("password_login"))
enter_btn_login(document.getElementById("email_login"))

enter_btn_sign_up(document.getElementById("fname"))
enter_btn_sign_up(document.getElementById("email"))
enter_btn_sign_up(document.getElementById("password"))
enter_btn_sign_up(document.getElementById("cnf_password"))
