const thead = document.getElementById('table-body');

import { users as credentials } from './module.js';

function addRow(nickname, username, highscore) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${nickname}</td><td>${username}</td><td>${highscore}</td>`;
    thead.appendChild(row);
};

credentials.sort((a,b) => b.high_score - a.high_score);

credentials.forEach(element => {
    const display_email = element.email.replace(/@.*$/,'');
    addRow(element.nickname, display_email, element.high_score);
});