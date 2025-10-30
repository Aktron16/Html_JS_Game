export const user_current = JSON.parse(sessionStorage.getItem('User_Logged_in')) || null;
export const users = JSON.parse(localStorage.getItem('credentials')) || [];
export const leaderboards = JSON.parse(localStorage.getItem('Leaderboards')) || [];