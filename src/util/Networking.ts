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
        body: JSON.stringify({ title })
    });
    if(res.ok === true) {
        let data = await res.json();
        return { message: data.message, ok: true }
    } else {
        let data = await res.json();
        return { message: data.message, code: res.status, ok: false }
    }
}

export async function createNote(title, content, notebookID) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/create-note`, {
        method: 'post',
        headers: { 'Authorization': token },
        body: JSON.stringify({ title, content, notebookID })
    });
    if(res.ok === true) {
        let data = await res.json();
        return { message: data.message, ok: true }
    } else {
        let data = await res.json();
        return { message: data.message, code: res.status, ok: false }
    }
}

export async function toggleFavorite(id) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/favorite`, {
        method: 'post',
        headers: { 'Authorization': token },
        body: JSON.stringify({ id })
    });
    if(res.ok === true) {
        let data = await res.json();
        return { message: data.message, ok: true }
    } else {
        let data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function getFavorites() {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/get-favorites`, {
        method: 'get',
        headers: { 'Authorization': token },
    });
    if(res.ok === true) {
        let data = await res.json();
        return { favorites: data, ok: true }
    } else {
        let data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function save(noteID, title, content) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/save-note`, {
        method: 'put',
        headers: { 'Authorization': token },
        body: JSON.stringify({ id: noteID, title, content })
    });
    if(res.ok === true) {
        let data = await res.json();
        return { message: data.message, ok: true }
    } else {
        let data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
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
        return { message: data.message, code: res.status, ok: false }
    }
}

export async function move(noteID, fromNotebook, toNotebook) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/move-note`, {
        method: 'put',
        headers: { 'Authorization': token },
        body: JSON.stringify({ id: noteID, fromNotebook, toNotebook }),
    });
    if(res.ok === true) {
        const _data = await res.json();
        return { message: _data.message, ok: true }
    } else {
        const data = await res.json();
        return { message: data.message, code: res.status, ok: false }
    }
}

export async function deleteNote(noteID) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/delete-note`, {
        method: 'delete',
        headers: { 'Authorization': token },
        body: JSON.stringify({ id: noteID }),
    });
    if(res.ok === true) {
        const _data = await res.json();
        return { message: _data.message, ok: true }
    } else {
        const data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}

export async function deleteNotebook(notebookID) {
    const token = localStorage.getItem('noteworthy-token');
    const res = await fetch(`${API_URL}/delete-notebook`, {
        method: 'delete',
        headers: { 'Authorization': token },
        body: JSON.stringify({ id: notebookID }),
    });
    if(res.ok === true) {
        const _data = await res.json();
        return { message: _data.message, ok: true }
    } else {
        const data = await res.json();
        return { error: data.message, code: res.status, ok: false }
    }
}