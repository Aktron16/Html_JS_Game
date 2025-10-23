const thead = document.getElementById('table-body');

const credentials = JSON.parse(localStorage.getItem('credentials')) || [];

function addRow(nickname, username, highscore) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${nickname}</td><td>${username}</td><td>${highscore}</td>`;
    thead.appendChild(row);
};

credentials.sort((a,b) => b.highscore - a.highscore);

credentials.forEach(element => {
    element.email = element.email.replace(/@.*$/,'');
    addRow(element.nickname, element.email, element.high_score);
});