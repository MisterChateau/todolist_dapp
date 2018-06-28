import React, { Component } from 'react';
import TodoListContract from '../build/contracts/TodoList.json';
import getWeb3 from './utils/getWeb3';

import CreateTodo from './createTodo';
import Todo from './todo';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

const listContainer = {
	display: 'flex',
	flexDirection: 'column',
	textAlign: 'center'
};

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			web3: null,
			todos: [],
		};

		// seriously need to bind every method consumed in template ???
		this.createTodo = this.createTodo.bind(this);
		this.toggle = this.toggle.bind(this);

	}

	componentWillMount() {
		// Get network provider and web3 instance.
		// See utils/getWeb3 for more info.

		getWeb3
			.then((results) => {
				this.setState({
					web3: results.web3,
				});
				// Instantiate contract once web3 provided.
				this.instantiateContract();
			})
			.catch(() => {
				console.log('Error finding web3.');
			});
	}

	getLastTodoIndex() {
		return this.todoListInstance.getLastTodoIndex({ from: this.accounts[0], gas: 3000000 }).then((i) => i.toNumber());
	}

	getTodosUntiIndex(index) {
		return Promise.all(
			Array(index + 1)
				.fill(0)
				.reduce((a, v, i) => a.concat([this.todoListInstance.getTodoAtIndex(i)]), [])
		).then((todoTuples) => todoTuples.map((todo) => todoMapper(todo)));
	}

	instantiateContract() {
		/*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

		const contract = require('truffle-contract');
		const todoList = contract(TodoListContract);
		todoList.setProvider(this.state.web3.currentProvider);

		// Get accounts.
		this.state.web3.eth.getAccounts((error, accounts) => {
			this.accounts = accounts;
			todoList
				.deployed()
				.then((instance) => {
					this.todoListInstance = instance;
				})
				.then(this.getLastTodoIndex.bind(this))
				.then(this.getTodosUntiIndex.bind(this))
				.then((todos) => {
					this.setState({ ...this.state, ...{ todos } });
				});
		});
	}

	createTodo(content) {
		this.todoListInstance
			.createTodo(content, { from: this.accounts[0], gas: 3000000 })
			.then(() => this.todoListInstance.getLastTodo())
			.then((todo) =>
				this.setState({ ...this.state, ...{ todos: this.state.todos.concat(todoMapper(todo)) } }),
			);
	}

	toggle(id) {
		this.todoListInstance
			.toggleTodoCompletedStatusAtIndex(id, { from: this.accounts[0], gas: 3000000 })
			.then(() => this.todoListInstance.getTodoAtIndex(id))
			.then((updatedTodo) => this.setState(
					{
					...this.state,
					...{
							todos: this.state.todos.reduceRight((a, t) => {
								return a.concat([ t.id === id ? todoMapper(updatedTodo) : t ])
							}, [])
						}
					})
			);
	}

	render() {
		return (
			<div className="App">
				<div className="pure-menu pure-menu-horizontal">
					<a href="#" className="pure-menu-heading pure-menu-link">
						ETH TODO
					</a>
				</div>
				<CreateTodo create={this.createTodo} />
				<div style={listContainer}>{this.state.todos.reverse().map((todo) => <Todo todo={todo} key={todo.id} toggle={this.toggle} />)}</div>
			</div>
		);
	}
}

export default App;

function todoMapper(todo) {
	return { content: todo[0], completed: todo[1], id: todo[2].toNumber() };
}
