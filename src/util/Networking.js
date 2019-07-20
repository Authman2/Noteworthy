import axios from 'axios';

const DEV_API_URL = 'http://localhost:8000';
const API_URL = 'https://noteworthy-backend.herokuapp.com';
let currentUser = undefined;

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
        const user = await res.json();
        currentUser = user;
        localStorage.setItem('noteworthy-current-user', JSON.stringify(user));
        return { user, ok: true };
    } else return { error: await res.text(), code: res.status, ok: false }
}

export async function logout() {
    const res = await fetch(`${API_URL}/logout`);
    if(res.ok === true) {
        currentUser = undefined;
        localStorage.removeItem('noteworthy-current-user');
        return { user: await res.json(), ok: true }
    } else return { error: await res.text(), code: res.status, ok: false }
}

export async function refreshUser() {
    // const token = currentUser.customToken;
    // const res = await fetch(`${API_URL}/refresh-user?token=${token}`);
    // if(res.ok === true) {
    //     const user = await res.json();
    //     currentUser = user;
    //     localStorage.setItem('noteworthy-current-user', JSON.stringify(user));
    //     return { user: user, ok: true }
    // } else return { error: await res.text(), code: res.status, ok: false }
}

export async function createAccount(email, password) {
    const res = await fetch(`${API_URL}/create-account`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    if(res.ok === true) return { user: await res.json(), ok: true }
    else return { error: await res.text(), code: res.status, ok: false }
}

export async function forgotPassword(email) {
    // const res = await fetch(`${API_URL}/forgot-password`, {
    //     method: 'PUT',
    //     body: JSON.stringify({ email })
    // });
    // if(res.ok === true) return { user: await res.json(), ok: true }
    // else return { err: await res.text(), code: res.status, ok: false }
}

export async function loadNotebooks() {
    // if(!currentUser) return { err: 'No current user', ok: false };
    
    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/notebooks?token=${token}`);
    // if(response.ok === true) return { notebooks: await response.json(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function loadNotes(notebookID) {
    // if(!currentUser) return { err: 'No current user', ok: false };
    
    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/notes?token=${token}&notebookID=${notebookID}`);
    // if(response.ok === true) return { notes: await response.json(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function createNotebook(title) {
    // if(!currentUser) return { err: 'No current user', ok: false };

    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/create-notebook?token=${token}`, {
    //     method: 'POST',
    //     body: JSON.stringify({ title })
    // });
    // if(response.ok === true) return { notes: await response.json(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function createNote(title, content, notebookID) {
    // if(!currentUser) return { err: 'No current user', ok: false };

    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/create-note?token=${token}`, {
    //     method: 'POST',
    //     body: JSON.stringify({ title, content, notebookID })
    // });
    // if(response.ok === true) return { notes: await response.json(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function save(noteID, title, content) {
    // if(!currentUser) return { err: 'No current user', ok: false };

    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/save?token=${token}`, {
    //     method: 'POST',
    //     body: JSON.stringify({ noteID: noteID, title: title, content: content })
    // });
    // if(response.ok === true) return { message: await response.text(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function restore(notebooksAndNotes) {
    // if(!currentUser) return { err: 'No current user', ok: false };

    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/restore?token=${token}`, {
    //     method: 'PUT',
    //     body: JSON.stringify({ notebooksAndNotes })
    // });
    // if(response.ok === true) return { message: await response.text(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function move(noteID, fromNotebook, toNotebook) {
    // if(!currentUser) return { err: 'No current user', ok: false };

    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/move-note?token=${token}`, {
    //     method: 'PUT',
    //     body: JSON.stringify({ noteID, fromNotebook, toNotebook })
    // });
    // if(response.ok === true) return { response: await response.text(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function deleteNote(noteID) {
    // if(!currentUser) return { err: 'No current user', ok: false };

    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/delete-note?token=${token}`, {
    //     method: 'DELETE',
    //     body: JSON.stringify({ noteID })
    // });
    // if(response.ok === true) return { notes: await response.json(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}

export async function deleteNotebook(notebookID) {
    // if(!currentUser) return { err: 'No current user', ok: false };

    // const token = currentUser.idToken;
    // const response = await fetch(`${API_URL}/delete-notebook?token=${token}`, {
    //     method: 'DELETE',
    //     body: JSON.stringify({ notebookID })
    // });
    // if(response.ok === true) return { notes: await response.json(), ok: true }
    // else return { err: await response.text(), code: response.status, ok: false }
}