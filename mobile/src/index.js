const Creds = require('./other/creds.json');
firebase.initializeApp(Creds);

const Mosaic = require('@authman2/mosaic').default;

const Home = require('./pages/home');
const Work = require('./pages/work');

new Mosaic({
	element: '#root',
	data: { page: 0 },
	view: data => html`<div id='root'>
		<div class='title-bar'></div>
		${ data.page === 0 ? Home.new() : Work.new() }
	</div>`,
	created() {
		firebase.auth().onAuthStateChanged(user => {
			if(user) this.data.page = 1;
			else this.data.page = 0;
		});
	}
}).paint();