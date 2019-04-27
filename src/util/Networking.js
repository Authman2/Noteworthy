import sa from 'superagent';

const API_URL = 'https://noteworthy-backend.herokuapp.com';
export default {
    currentUser: undefined,

    async login(email, password) {
        const response = await fetch(`${API_URL}/login?email=${email}&password=${password}`);
        if(response.ok === true) {
            const user = await response.json();
            this.currentUser = user;
            localStorage.setItem('noteworthy-current-user', JSON.stringify(user));
            return { user, ok: true }
        } else return { err: await response.text(), ok: false }
    },

    async createAccount(email, password) {
        const res = await fetch(`${API_URL}/create-account`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
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
    }

}