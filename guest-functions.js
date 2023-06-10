// JavaScript Document
class User {
    constructor(name, accountID, cart) {
        this.name = name;
        this.accountID = accountID;
        this.cart = cart;
    }
}

var currentUser;
localStorage.setItem("isLoggedIn", false);

function setUser()
{  
    userName  = document.getElementById("username").value;
    accountID = document.getElementById("accountID").value;

    if (localStorage.getItem(userName) === null) {
        user = new User(userName, accountID); //MAKE A NEW USER

        currentUser = localStorage.setItem("currentUser", user); //SET THE CURRENT USER
        localStorage.setItem(userName, user); //KEEP TRACK OF ALL THE USERS
        console.log("made user");
    } else {
        currentUser = localStorage.getItem(userName);
        console.log("got user");
    }
}

function getUserName(){
    obj = localStorage.getItem("currentUser");
    console.log(obj);
}

function switchLogin(loggedIn) {
    loginBtn   = document.getElementById("loginButton");
    loginBoxes = document.getElementsByClassName("loginBox");
    loginDIV   = document.getElementById("loginDIV");

    if (loggedIn == false) {
            loginBtn.value = 'Login';
            loginBtn.onclick = function () {
                setUser();

                //for(let i = 0; i < loginBoxes.length; i++){
                 //   loginBoxes[i].style.visibility = "visible";
                localStorage.setItem("isLoggedIn", false);
            }
            console.log("Currently logged in? " + localStorage.getItem("isLoggedIn"));
        }else{
            loginBtn.value = 'Log Out';
            loginBtn.onclick = function () {
                setGuest();

              //  for(let i = 0; i < loginBoxes.length; i++){
              //      loginBoxes[i].style.visibility = "hidden";
              localStorage.setItem("isLoggedIn", true);
            }
            console.log("Currently logged in? " + localStorage.getItem("isLoggedIn"));
        }
}

function clearName()
{  
    localStorage.clear("currentUser");
}


function setGuest()
{
    currentUser = new User("Guest");
}

