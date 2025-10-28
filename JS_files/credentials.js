const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const changeRegisterBox = document.getElementById('change-registerBtn');
const changeLoginBox = document.getElementById('change-loginBtn');
const register_form = document.getElementById('register-form');
const login_form = document.getElementById('login-form');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const guestBtn = document.querySelectorAll('.guest-submit-bt');
const login_feedback = document.getElementById('login-feedback');
const register_feedback = document.getElementById('register-feedback');

import { user_current, users } from "./module.js";

function OnRegisterClick(){
    let feedback = register_feedback

    const credentials= {
        nickname: register_form.nickname.value.trim(),
        phone: register_form.phone.value.trim(),
        email: register_form.email.value.trim(),
        password: register_form.pass.value.trim(),
        high_score: 0
    };

    if (!credentials.nickname || !credentials.phone || !credentials.email || !credentials.password){
        feedback.textContent = "To Register, You need to Enter all fields.";
        resetFeedback(3, feedback);
        return;
    };

    if (credentials.password.length < 5) {
        feedback.textContent = 'Password must be at least 5 characters long.';
        resetFeedback(3, feedback);
        register_form.password.value = '';
        return;
    };
    if (!(/[A-Z]/.test(credentials.password) && /[a-z]/.test(credentials.password))) {
        feedback.textContent = 'Password must contain both Uppercase and Lowercase letters.';
        resetFeedback(3, feedback);
        register_form.password.value = '';
        return;
    };
    if (!/[0-9]/.test(credentials.password)) {
        feedback.textContent = 'Password must contain at least one number.';
        resetFeedback(3, feedback);
        register_form.password.value = '';
        return;
    };

    const user = users.find(u => u.email === register_form.email.value);
    if (!user) {
        users.push(credentials);

        localStorage.setItem('credentials',JSON.stringify(users));

        feedback.textContent = `Registered User Nickname: ${credentials.nickname}`;
        resetFeedback(3, feedback);
        register_form.reset();
    } else {
        feedback.textContent = `This User ${user.email} aldready exists...`;
        resetFeedback(3, feedback);
        register_form.reset();
        return;
    }

};

function OnLoginClick(){
    let feedback = login_feedback

    if (users.length === 0){
        feedback.textContent = "Please Register Someone First.";
        resetFeedback(3, feedback);
        return;
    }

    const user = users.find(u => u.email === login_form.email.value);

    if (!user){
        feedback.textContent = `Your Email-ID is Invalid\n(or) Doesn't Exist in the Database.\nPlease Register.`;
        resetFeedback(3, feedback);
        login_form.password.value = '';
        return;
    }

    if (user.password === login_form.password.value) {
        if (checkCurrentUser()) {
            currentUser(user.nickname , user.email);

            feedback.textContent = `Logged In as ${user.nickname}`;
            login_form.reset();
            setTimeout(() => location.reload(), 2000);
        } else {
            feedback.textContent = "Please Signout before Logging-In";
            resetFeedback(3, feedback);
            return;
        }
        
    } else {
        feedback.textContent = "Your Password is Invalid.";
        resetFeedback(3, feedback);
        login_form.password.value = '';
        return;
    }
};

function OnGuestClick() {
    if (checkCurrentUser()) {
        window.location.href = 'HTML_Webpages/game.html';
    } else {
        localStorage.removeItem('User_Logged_in');
        window.location.href = 'HTML_Webpages/game.html';
    }
}

function currentUser(nickname , email){
    localStorage.setItem('User_Logged_in', JSON.stringify({
    _nickname: nickname,
    _emailID: email
    }));
};

function checkCurrentUser() {
    return user_current === null;
};

function resetFeedback(timeout, feedback) {
    setTimeout(() => feedback.textContent = '', (timeout * 1000));
};

document.addEventListener('DOMContentLoaded', () => {
    loginBtn.addEventListener('click', (onclick) => {
        onclick.preventDefault();
        if (loginBox.style.display !== 'flex') {
            loginBox.style.display = 'flex';
            registerBox.style.display = 'none';
            return;
        }
        OnLoginClick();
    });

    registerBtn.addEventListener('click', (onclick) => {
        onclick.preventDefault();
        if (registerBox.style.display !== 'flex') {
            loginBox.style.display = 'none';
            registerBox.style.display = 'flex';
            return;
        }
        OnRegisterClick();
    });

    guestBtn.forEach(btn => {
        btn.addEventListener('click', (onclick) => {
        onclick.preventDefault();
        OnGuestClick();
    })});

    changeLoginBox.addEventListener('click', () => {
        loginBox.style.display = 'flex';
        registerBox.style.display = 'none';
    });

    changeRegisterBox.addEventListener('click', () => {
        loginBox.style.display = 'none';
        registerBox.style.display = 'flex';
    });
});