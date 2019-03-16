import firebase from 'firebase';

import Globals from './other/Globals';
import Creds from './other/creds.json';
firebase.initializeApp(Creds);

import Home from './pages/home';
import Work from './pages/work';

new Mosaic({
	element: '#root',
	data: { page: 0 },
	view: function() {
		return html`<div>
			${ this.data.page === 0 ? Home.new({ name: 'home' }) : Work.new({ name: 'work' }) }
		</div>`
	}
}).paint();