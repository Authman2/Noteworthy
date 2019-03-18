const Mosaic = require('@authman2/mosaic').default;
const Creds = require('./other/creds.json');

const Home = require('./pages/home');
const Work = require('./pages/work');

new Mosaic({
	element: '#root',
	data: { page: 0 },
	view: (data) => html`<div>
		<div class='title-bar'></div>
		${ data.page === 0 ? Home.new() : Work.new() }
	</div>`
}).paint();