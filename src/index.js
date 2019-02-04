import { Mosaic } from '@authman2/mosaic';
import firebase from 'firebase';

import Globals from './other/Globals';
import Creds from './other/creds.json';
firebase.initializeApp(Creds);

import Home from './pages/home';
import Work from './pages/work';

const app = new Mosaic({
	element: document.getElementById('root'),
	data: { page: 0 },
	view: function() {
		return <div>
			{ this.data.page === 0 ? 
				<Home link={{ name: 'home', parent: this }} /> : 
				<Work link={{ name: 'work', parent: this }}/> }
		</div>
	},
	created: function() {
		// Handle auto login with firebase.
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
				this.data.page = 1;

				// Tell the user how to switch context menus.
				Globals.showActionAlert(`<b>NOTE</b>: Long press the top portion of the screen to change context menus!`,
										Globals.ColorScheme.blue,
										4500);

				// Load the notebooks and notes from firebase.
				Globals.loadData((loadedData) => { this.work.data.loadedData = loadedData });
            }
        })
	}
});
app.paint();