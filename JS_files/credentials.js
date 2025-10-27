const form = document.getElementById('user-form');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const guestBtn = document.getElementById('guestBtn');
const feedback = document.getElementById('feedback');

import { user_current, users } from "./module.js";

function OnRegisterClick(){

    const credentials= {
        nickname: form.nickname.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value.trim(),
        high_score: 0
    };

    if (!credentials.nickname || !credentials.email || !credentials.password){
        feedback.textContent = "To Register, You need to Enter all fields.";
        resetFeedback(3);
        return;
    };

    if (credentials.password.length < 5) {
        feedback.textContent = 'Password must be at least 5 characters long.';
        resetFeedback(3);
        form.password.value = '';
        return;
    };
    if (!(/[A-Z]/.test(credentials.password) && /[a-z]/.test(credentials.password))) {
        feedback.textContent = 'Password must contain both Uppercase and Lowercase letters.';
        resetFeedback(3);
        form.password.value = '';
        return;
    };
    if (!/[0-9]/.test(credentials.password)) {
        feedback.textContent = 'Password must contain at least one number.';
        resetFeedback(3);
        form.password.value = '';
        return;
    };

    const user = users.find(u => u.email === form.email.value);
    if (!user) {
        users.push(credentials);

        localStorage.setItem('credentials',JSON.stringify(users));

        feedback.textContent = `Registered User Nickname: ${credentials.nickname}`;
        resetFeedback(3);
        form.nickname.value = '';
    } else {
        feedback.textContent = `This User ${user.email} aldready exists...`;
        resetFeedback(3);
        form.reset();
        return;
    }

};

function OnLoginClick(){

    if (users.length === 0){
        feedback.textContent = "Please Register Someone First.";
        resetFeedback(3);
        return;
    }

    const user = users.find(u => u.email === form.email.value);

    if (!user){
        feedback.textContent = `Your Email-ID is Invalid\n(or) Doesn't Exist in the Database.\nPlease Register.`;
        resetFeedback(3);
        form.password.value = '';
        return;
    }

    if (user.password === form.password.value) {
        if (checkCurrentUser()) {
            currentUser(user.nickname , user.email);

            feedback.textContent = `Logged In as ${user.nickname}`;
            form.reset();
            setTimeout(() => location.reload(), 2000);
        } else {
            feedback.textContent = "Please Signout before Logging-In";
            resetFeedback(3);
            return;
        }
        
    } else {
        feedback.textContent = "Your Password is Invalid.";
        resetFeedback(3);
        form.password.value = '';
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

function resetFeedback(timeout) {
    setTimeout(() => feedback.textContent = '', (timeout * 1000));
};

document.addEventListener('DOMContentLoaded', () => {
    if (loginBtn && registerBtn && guestBtn) {
        loginBtn.addEventListener('click',function(onclick) {
            onclick.preventDefault();
            OnLoginClick();
        });

        registerBtn.addEventListener('click',function(onclick) {
            onclick.preventDefault();
            OnRegisterClick();
        });

        guestBtn.addEventListener('click', function(onclick) {
            onclick.preventDefault();
            OnGuestClick();
        });
    };
});