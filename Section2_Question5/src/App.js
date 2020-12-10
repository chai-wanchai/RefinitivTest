import React, { useEffect, useState } from 'react'
//const electron = require('electron');
// const path = require('path');
// const fs = require('fs');
// const dialog = electron.remote.dialog;
const App = () => {

	const [numberData, setNumberData] = useState({
		a: '',
		b: ''
	})
	const [operator, setOperator] = useState({
		value: '',
		id: ''
	})
	const [ans, setAns] = useState({
		eq: '',
		value: ''
	})
	const click_operation = (e) => {
		const { id } = e.target
		const valueOps = operation(id)
		setOperator({
			value: valueOps,
			id: id
		})
		highlight(id)
	}
	const operation = (id) => {
		switch (id) {
			case 'plus':
				return '+'
				break;
			case 'minus':
				return '-'
				break;
			case 'multiply':
				return '*'
				break;
			case 'divide':
				return '/'
				break;
			case 'pow':
				return '**'
				break;
			default:
				return ''
				break;
		}
	}
	const highlight = (opsId) => {
		const targetId = opsId || operator.id
		const listOp = document.getElementsByClassName('operation')[0].children
		for (let i = 0; i < listOp.length; i++) {
			if (listOp[i].id === targetId) {
				listOp[i].classList.add('highlight')
			} else {
				listOp[i].classList.remove('highlight')
			}
		}
	}
	const getResult = () => {
		if (!numberData.a || !numberData.b) {
			return
		}
		const eq = `${numberData.a}${operator.value}${numberData.b}`
		const answer = eval(eq)
		setAns({ value: answer, eq: eq })


	}
	const saveResult = () => {
		const result = {
			a: numberData.a,
			b: numberData.b,
			operator: operator.value,
			eq: ans.eq,
			ans: ans.value
		}
		console.log(JSON.stringify(result))
		// dialog.showSaveDialog({
		// 	title: 'Select the File Path to save',
		// 	defaultPath: path.join(__dirname, '../assets/sample.txt'),
		// 	// defaultPath: path.join(__dirname, '../assets/'), 
		// 	buttonLabel: 'Save',
		// 	// Restricting the user to only Text Files. 
		// 	filters: [
		// 		{
		// 			name: 'Text Files',
		// 			extensions: ['txt', 'docx']
		// 		},],
		// 	properties: []
		// }).then(file => {
		// 	// Stating whether dialog operation was cancelled or not. 
		// 	console.log(file.canceled);
		// 	if (!file.canceled) {
		// 		console.log(file.filePath.toString());

		// 		// Creating and Writing to the sample.txt file 
		// 		fs.writeFile(file.filePath.toString(),
		// 			'This is a Sample File', function (err) {
		// 				if (err) throw err;
		// 				console.log('Saved!');
		// 			});
		// 	}
		// }).catch(err => {
		// 	console.log(err)
		// });
	}
	useEffect(() => {
		getResult()
	}, [operator])
	return (
		<>
			<div className="window">
				<div className="input-section">
					<label>A</label><input type="number" name="a" id="a" value={numberData.a} onChange={(e) => setNumberData({ ...numberData, a: e.target.value })} />
				</div>
				<div className="input-section">
					<label>B</label><input type="number" name="b" id="b" value={numberData.b} onChange={(e) => setNumberData({ ...numberData, b: e.target.value })} />
				</div>

				<div className="operation">
					<button id="plus" onClick={click_operation}>+</button>
					<button id="minus" onClick={click_operation}>-</button>
					<button id="multiply" onClick={click_operation}>x</button>
					<button id="divide" onClick={click_operation}>/</button>
					<button id="pow" onClick={click_operation}>Pow</button>
				</div>
				<div className="result">
					<label>Result</label><input id="result" value={ans.value} />
				</div>
				<div className="btn">
					<button>Load</button>
					<button onClick={saveResult}>Save</button>
				</div>
			</div>
		</>
	)
}

export default App