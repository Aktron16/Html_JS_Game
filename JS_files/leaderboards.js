const thead = document.getElementById('table-body');

import { users as credentials } from './module.js';

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