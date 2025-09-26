const form = document.getElementById('user-form');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const feedback = document.getElementById('feedback');


function OnRegisterClick(){
    let users = JSON.parse(localStorage.getItem('credentials')) || [];

    const credentials= {
        nickname: form.nickname.value,
        email: form.email.value,
        password: form.password.value
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
    const credential_check = JSON.parse(localStorage.getItem('credentials'));

    if (!credential_check){
        alert('Add a user first...');
        return;
    }

    const user = credential_check.find(u => u.email === form.email.value);

    if (!user){
        feedback.textContent = "Your Email-ID is Invalid\n(or) Doesn't Exist in the Database.\nPlease Register.";
        setTimeout(() => feedback.textContent = "", 3000);
        return;
    }

    if (user.password === form.password.value){
        alert(`Welcome, ${user.nickname}!`);
        location.reload();
    } else {
        feedback.textContent = "Your Password is Invalid.";
        setTimeout(() => feedback.textContent = "", 3000);
        return;
    }
};

loginBtn.addEventListener('click',function(onclick) {
    onclick.preventDefault();
    OnLoginClick();
});

registerBtn.addEventListener('click',function(onclick) {
    onclick.preventDefault();
    OnRegisterClick();
});