import React, { Component } from 'react';
import TodoListContract from '../build/contracts/TodoList.json';
import getWeb3 from './utils/getWeb3';

import CreateTodo from './createTodo';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			storageValue: 0,
			web3: null,
		};

		// seriously need to bind every method consumed in template ???
		this.createTodo = this.createTodo.bind(this);
	}

	componentWillMount() {
		// Get network provider and web3 instance.
		// See utils/getWeb3 for more info.

		getWeb3
			.then((results) => {
				this.setState({
					web3: results.web3
				});
				// Instantiate contract once web3 provided.
				this.instantiateContract();
			})
			.catch(() => {
				console.log('Error finding web3.');
			});
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
		});
	}
	createTodo(content) {
		this.todoListInstance.createTodo(content, { from: this.accounts[0]})
	}
	render() {
		return (
			<div className="App">
				<div className="pure-menu pure-menu-horizontal">
					<a href="#" className="pure-menu-heading pure-menu-link">ETH TODO</a>
				</div>
					<CreateTodo create={this.createTodo}></CreateTodo>
			</div>
		);
	}
}

export default App;
