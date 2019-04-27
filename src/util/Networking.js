import sa from 'superagent';

const API_URL = 'https://noteworthy-backend.herokuapp.com';
export default {

    async login(email, password) {
        const response = await fetch(`${API_URL}/login?email=${email}&password=${password}`);
        if(response.ok === true) return { user: await response.json(), ok: true }
        else return { err: await response.text(), ok: false }
    },


    async createAccount(email, password) {
        const res = await fetch(`${API_URL}/create-account`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if(res.ok === true) return { user: await res.json(), ok: true }
        else return { err: await res.text(), ok: false }
    }

}