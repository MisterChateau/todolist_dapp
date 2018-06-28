import React, { Component } from 'react';

const todoStyle = {
	width: '500px',
	alignSelf: 'center',
	borderRadius: '2px',
	boxShadow: '0 1px 2px 1px rgba(0, 0, 0, .5)',
	display: 'flex',
	justifyContent: 'space-evenly',
	marginBottom: '2em',
	lineHeight: '2em',
	padding: '0 1em',
	backgroundColor: '#0c1a2b',
	color: 'white'
}

const contentStyle = (completed) => {
	return { flexGrow: 2, textDecoration: completed ? 'line-trough' : 'normal' }
}

class Todo extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.props.toggle(this.props.todo.id);
	}

	render() {
		return (
			<section style={todoStyle}>
				<div style={contentStyle(this.props.todo.completed)}>{ this.props.todo.content }</div>
				<label htmlFor="status" className="pure-checkbox">
					<input id="status" type="checkbox" onChange={ this.toggle } checked={this.props.todo.completed}/>
				</label>
			</section>
		);
	}
}

export default Todo;
