const API_URL = /*'http://localhost:8000';*/'https://noteworthy-backend.herokuapp.com';
export default {
    currentUser: undefined,

    async login(email, password, token) {
        const response = token ? await fetch(`${API_URL}/login?email=${email}&password=${password}&token=${token}`)
                                : await fetch(`${API_URL}/login?email=${email}&password=${password}`);
        if(response.ok === true) {
            const user = await response.json();
            this.currentUser = user;
            localStorage.setItem('noteworthy-current-user', JSON.stringify(user));
            return { user, ok: true }
        } else return { err: await response.text(), ok: false }
    },

    async logout() {
        const res = await fetch(`${API_URL}/logout`);
        if(res.ok === true) {
            localStorage.removeItem('noteworthy-current-user');
            return { user: await res.json(), ok: true }
        } else return { err: await res.text(), ok: false }
    },

    async createAccount(email, password) {
        const res = await fetch(`${API_URL}/create-account`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if(res.ok === true) return { user: await res.json(), ok: true }
        else return { err: await res.text(), ok: false }
    },

    async forgotPassword(email) {
        const res = await fetch(`${API_URL}/forgot-password?email=${email}`, {
            method: 'put',
        });
        if(res.ok === true) return { user: await res.json(), ok: true }
        else return { err: await res.text(), ok: false }
    },

    async loadNotebooks() {
        if(!this.currentUser) return { err: 'No current user', ok: false };
        
        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/notebooks?uid=${uid}`);
        if(response.ok === true) return { notebooks: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async loadNotes(notebookID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };
        
        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/notes?uid=${uid}&notebookID=${notebookID}`);
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async createNotebook(title) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/create-notebook?uid=${uid}`, {
            method: 'post',
            body: JSON.stringify({ title })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async createNote(title, content, notebookID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/create-note?uid=${uid}`, {
            method: 'post',
            body: JSON.stringify({ title, content, notebookID })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async save(noteID, title, content) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/save?uid=${uid}`, {
            method: 'post',
            body: JSON.stringify({ noteID, title, content })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async move(noteID, fromNotebook, toNotebook) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/move-note?uid=${uid}`, {
            method: 'put',
            body: JSON.stringify({ noteID, fromNotebook, toNotebook })
        });
        if(response.ok === true) return { notes: await response.text(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async deleteNote(noteID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/delete-note?uid=${uid}`, {
            method: 'delete',
            body: JSON.stringify({ noteID })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async deleteNotebook(notebookID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const uid = this.currentUser.uid;
        const response = await fetch(`${API_URL}/delete-notebook?uid=${uid}`, {
            method: 'delete',
            body: JSON.stringify({ notebookID })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    }

}