const API_URL = /*http://localhost:8000';*/'https://noteworthy-backend.herokuapp.com';
export default {
    currentUser: undefined,

    async login(email, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
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
        const res = await fetch(`${API_URL}/forgot-password`, {
            method: 'PUT',
            body: JSON.stringify({ email })
        });
        if(res.ok === true) return { user: await res.json(), ok: true }
        else return { err: await res.text(), ok: false }
    },

    async loadNotebooks() {
        if(!this.currentUser) return { err: 'No current user', ok: false };
        
        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/notebooks?token=${token}`);
        if(response.ok === true) return { notebooks: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async loadNotes(notebookID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };
        
        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/notes?token=${token}&notebookID=${notebookID}`);
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async createNotebook(title) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/create-notebook?token=${token}`, {
            method: 'POST',
            body: JSON.stringify({ title })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async createNote(title, content, notebookID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/create-note?token=${token}`, {
            method: 'POST',
            body: JSON.stringify({ title, content, notebookID })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async save(noteID, title, content) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/save?token=${token}`, {
            method: 'POST',
            body: JSON.stringify({ noteID: noteID, title: title, content: content })
        });
        if(response.ok === true) return { message: await response.text(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async restore(notebooksAndNotes) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/restore?token=${token}`, {
            method: 'PUT',
            body: JSON.stringify({ notebooksAndNotes })
        });
        if(response.ok === true) return { message: await response.text(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async move(noteID, fromNotebook, toNotebook) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/move-note?token=${token}`, {
            method: 'PUT',
            body: JSON.stringify({ noteID, fromNotebook, toNotebook })
        });
        if(response.ok === true) return { response: await response.text(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async deleteNote(noteID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/delete-note?token=${token}`, {
            method: 'DELETE',
            body: JSON.stringify({ noteID })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },

    async deleteNotebook(notebookID) {
        if(!this.currentUser) return { err: 'No current user', ok: false };

        const token = this.currentUser.token;
        const response = await fetch(`${API_URL}/delete-notebook?token=${token}`, {
            method: 'DELETE',
            body: JSON.stringify({ notebookID })
        });
        if(response.ok === true) return { notes: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    }

}