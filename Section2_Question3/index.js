const axios = require('axios').default
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
async function getData() {
	let data = {}
	try {
		const val = await axios.get('https://codequiz.azurewebsites.net/', { headers: { Cookie: 'hasCookie=true' } })
		const dom = new JSDOM(val.data);
		const table = dom.window.document.querySelectorAll("table tr")
		for (var i = 1; i < table.length; i++) {
			const Name = table[i].querySelector('td:nth-child(1)').textContent.trim()
			const Nav = table[i].querySelector('td:nth-child(2)').textContent
			const Bid = table[i].querySelector('td:nth-child(3)').textContent
			const Offer = table[i].querySelector('td:nth-child(4)').textContent
			const Change = table[i].querySelector('td:nth-child(5)').textContent
			data[Name] = {
				Nav,
				Bid,
				Offer,
				Change
			}
		}
	} catch (error) {
		console.log(error)
		throw error
	} finally {
		return data
	}
}

getData().then((data) => {
	const code = process.argv.slice(-1).pop()
	if (code in data) {
		console.log(data[code].Nav)
	} else {
		console.log('Not found')
	}
}).catch(err => {
	console.log(err)
})
