const form = document.getElementById('user-form');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const feedback = document.getElementById('feedback');


let user_current = JSON.parse(localStorage.getItem('User_Logged_in')) || null;
let users = JSON.parse(localStorage.getItem('credentials')) || [];

function OnRegisterClick(){

    const credentials= {
        nickname: form.nickname.value,
        email: form.email.value,
        password: form.password.value,
        high_score: 0
    };

    if (!credentials.nickname || !credentials.email || !credentials.password){
        feedback.textContent = "To Register, You need to Enter all fields.";
        setTimeout(() => feedback.textContent = "", 3000);
        return;
    }

    const user = users.find(u => u.email === form.email.value);
    if (!user) {
        users.push(credentials);

        localStorage.setItem('credentials',JSON.stringify(users));
        alert(`Registered!\nNickname: ${credentials.nickname}`);
        location.reload();
    } else {
        feedback.textContent = `This User ${user.email} aldready exists...`;
        setTimeout(() => feedback.textContent = "", 3000);
        return;
    }

};

function OnLoginClick(){

    if (users.length === 0){
        alert('Add a user first...');
        return;
    }

    const user = users.find(u => u.email === form.email.value);

    if (!user){
        feedback.textContent = "Your Email-ID is Invalid\n(or) Doesn't Exist in the Database.\nPlease Register.";
        setTimeout(() => feedback.textContent = "", 3000);
        return;
    }

    if (user.password === form.password.value) {
        if (checkCurrentUser()) {
            currentUser(user.nickname , user.email, user.high_score);
            alert(`Welcome, ${user.nickname}!`);
            location.reload();
        } else {
            feedback.textContent = "Please Signout before Logging-In"
            setTimeout(() => feedback.textContent = "", 3000);
            return;
        }
        
    } else {
        feedback.textContent = "Your Password is Invalid.";
        setTimeout(() => feedback.textContent = "", 3000);
        return;
    }
};

function currentUser(nickname , email , highscore){
    localStorage.setItem('User_Logged_in', JSON.stringify({
    _nickname: nickname,
    _emailID: email,
    _highscore: highscore
    }));
};

function checkCurrentUser() {
    return user_current === null;
}

loginBtn.addEventListener('click',function(onclick) {
    onclick.preventDefault();
    OnLoginClick();
});

registerBtn.addEventListener('click',function(onclick) {
    onclick.preventDefault();
    OnRegisterClick();
});