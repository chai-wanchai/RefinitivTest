import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import config from './config'
const App = () => {
	const refFile = useRef(null)
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
	const [cloud, setCloud] = useState(false)
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
				return '+';
			case '+':
				return 'plus';
			case 'minus':
				return '-';
			case '-':
				return 'minus';
			case 'multiply':
				return '*';
			case '*':
				return 'multiply'
			case 'divide':
				return '/';
			case '/':
				return 'divide'
			case 'pow':
				return '**';
			case '**':
				return 'pow'
			default:
				return '';
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
		if (!numberData.a || !numberData.b || operator.value === '') {
			return
		}
		const eq = `${numberData.a}${operator.value}${numberData.b}`
		const answer = eval(eq)
		setAns({ value: answer, eq: eq })
	}
	const saveResult = async () => {
		const result = {
			a: numberData.a,
			b: numberData.b,
			operator: operator.value,
			eq: ans.eq,
			ans: ans.value
		}
		if (cloud) {
			toCloud(result)
		} else {
			const url = window.URL.createObjectURL(new Blob([JSON.stringify(result)]))
			const a = document.createElement('a')
			a.href = url;
			a.download = 'result.json'
			document.body.appendChild(a);
			a.click();
		}
	}
	const loadResult = async () => {
		let data = null
		if (cloud) {
			data = await getFromCloud()
			checkDataToApp(data)
		} else {
			refFile.current.click()
		}
	}
	const onUploadFile = (e) => {
		e.preventDefault();
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader();
			reader.onload = function (event) {
				try {
					const data = JSON.parse(event.target.result.toString())
					checkDataToApp(data)
				} catch (error) {
					alert('Invalid Format')
				}
			};
			reader.readAsText(file)
		}
	}
	const checkDataToApp = (data) => {
		if ('a' in data && 'b' in data) {
			setNumberData({
				a: data.a,
				b: data.b
			})
		}
		if ('operator' in data) {
			const opsId = operation(data.operator)
			highlight(opsId)
			setOperator({
				id: opsId,
				value: data.operator
			})
		}
		if ('ans' in data && 'eq' in data) {
			setAns({
				eq: data.eq,
				value: data.ans
			})
		}
	}
	const toCloud = async (data) => {
		try {
			const res = await axios.post(`${config.API}/save-data`, data)
			if (res.data.data) {
				return res.data.data
			} else {
				throw new Error('Wrong')
			}
		} catch (error) {
			throw error
		}

	}
	const getFromCloud = async () => {
		try {
			const res = await axios.get(`${config.API}/data`)
			const data = res.data.data
			if (data) {
				return data
			} else {
				throw new Error('Wrong')
			}
		} catch (error) {
			throw error
		}
	}
	const onNumberChange = (e) => {
		setNumberData({ ...numberData, [e.target.id]: e.target.value })
		
	}

	useEffect(() => {
		getResult()
	}, [operator,numberData])
	return (
		<>
			<div className="window">
				<div className="input-section">
					<label>A</label><input type="number" name="a" id="a" value={numberData.a} onChange={onNumberChange} />
				</div>
				<div className="input-section">
					<label>B</label><input type="number" name="b" id="b" value={numberData.b} onChange={onNumberChange} />
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
					<label>Cloud Drive<input type="checkbox" id="cloud-drive" onChange={(e) => { setCloud(e.target.checked) }} /></label>
				</div>
				<div className="btn">
					<button onClick={loadResult}>Load</button>
					<input id="file-input" type="file" onChange={onUploadFile} hidden={true} ref={refFile} />
					<button onClick={saveResult}>Save</button>
				</div>
			</div>
		</>
	)
}

export default App