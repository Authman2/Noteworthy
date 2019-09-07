import Globals from "./Globals";

const DEV_API_URL = 'http://localhost:8000';
const API_URL = 'https://noteworthy-backend.herokuapp.com';
export let currentUser = undefined;

export async function login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if(res.ok === true) {
        const data = await res.json();
        return {
            message: data.message,
            token: data.token, 
            ok: true
        };
    } else {
        const data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function logout() {
    localStorage.removeItem('noteworthy-token');
}

export async function getUserInfo() {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/get-user`, {
        method: 'get',
        headers: { 'Authorization': token }
    });
    if(res.ok === true) {
        return { info: await res.json(), ok: true }
    } else {
        const data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function createAccount(email, firstName, lastName, password) {
    const res = await fetch(`${API_URL}/create-user`, {
        method: 'POST',
        body: JSON.stringify({ email, firstName, lastName, password })
    });
    if(res.ok === true) return { user: await res.json(), ok: true }
    else return { error: await res.text(), code: res.status, ok: false }
}

export async function loadNotebooks() {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/get-notebooks`, {
        method: 'get',
        headers: { 'Authorization': token }
    });
    if(res.ok === true) {
        return { notebooks: await res.json(), ok: true }
    } else {
        const data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function loadNotes(notebookID) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/get-notes?notebookID=${notebookID}`, {
        method: 'get',
        headers: { 'Authorization': token }
    });
    if(res.ok === true) {
        return { notes: await res.json(), ok: true }
    } else {
        const data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function createNotebook(title) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/create-notebook`, {
        method: 'post',
        headers: { 'Authorization': token },
        body: JSON.stringify({ title, id: Globals.randomID() })
    });
    if(res.ok === true) {
        let data = await res.json();
        return { message: data.message, ok: true }
    } else {
        let data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function createNote(title, content, notebookID) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/create-note`, {
        method: 'post',
        headers: { 'Authorization': token },
        body: JSON.stringify({ title, content, notebookID, id: Globals.randomID() })
    });
    if(res.ok === true) {
        let data = await res.json();
        return { message: data.message, ok: true }
    } else {
        let data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function save(noteID, title, content) {
    const user = localStorage.getItem('noteworthy-current-user');
    if(!user) return { err: 'No current user', ok: false };
    currentUser = JSON.parse(user);

    const token = currentUser.idToken;
    const response = await fetch(`${API_URL}/save?token=${token}`, {
        method: 'POST',
        body: JSON.stringify({ noteID: noteID, title: title, content: content })
    });
    if(response.ok === true) return { message: await response.text(), ok: true }
    else return { err: await response.text(), code: response.status, ok: false }
}

export async function restore(notebooks, notes) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/restore`, {
        method: 'post',
        headers: { 'Authorization': token },
        body: JSON.stringify({ notebooks, notes }),
    });
    if(res.ok === true) {
        const _data = await res.json();
        return { message: _data.message, ok: true }
    } else {
        const data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function move(noteID, fromNotebook, toNotebook) {
    const user = localStorage.getItem('noteworthy-current-user');
    if(!user) return { err: 'No current user', ok: false };
    currentUser = JSON.parse(user);

    const token = currentUser.idToken;
    const response = await fetch(`${API_URL}/move-note?token=${token}`, {
        method: 'PUT',
        body: JSON.stringify({ noteID, fromNotebook, toNotebook })
    });
    if(response.ok === true) return { response: await response.text(), ok: true }
    else return { err: await response.text(), code: response.status, ok: false }
}

export async function deleteNote(noteID) {
    const user = localStorage.getItem('noteworthy-current-user');
    if(!user) return { err: 'No current user', ok: false };
    currentUser = JSON.parse(user);

    const token = currentUser.idToken;
    const response = await fetch(`${API_URL}/delete-note?token=${token}`, {
        method: 'DELETE',
        body: JSON.stringify({ noteID })
    });
    if(response.ok === true) return { notes: await response.json(), ok: true }
    else return { err: await response.text(), code: response.status, ok: false }
}

export async function deleteNotebook(notebookID) {
    const user = localStorage.getItem('noteworthy-current-user');
    if(!user) return { err: 'No current user', ok: false };
    currentUser = JSON.parse(user);

    const token = currentUser.idToken;
    const response = await fetch(`${API_URL}/delete-notebook?token=${token}`, {
        method: 'DELETE',
        body: JSON.stringify({ notebookID })
    });
    if(response.ok === true) return { notes: await response.json(), ok: true }
    else return { err: await response.text(), code: response.status, ok: false }
}