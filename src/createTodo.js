import React, { Component } from 'react';

const fieldsetStyle = {
	textAlign: 'center'
};

class CreateTodo extends Component {
	constructor(props) {
		super(props);

		this.submit = this.submit.bind(this);
		this.updateContent = this.updateContent.bind(this);
	}

	state = { content: '' };

	updateContent(event) {
		this.setState({ content: event.target.value });
	}

	submit() {
		this.props.create(this.state.content);
	}
	render() {
		return (
			<div className="pure-form">
				<fieldset style={fieldsetStyle}>
					<legend>New Todo</legend>
						<input type="text" value={this.state.content} onChange={this.updateContent} />
						<div type="submit" onClick={this.submit} className="pure-button pure-button-primary">
							Create
						</div>
				</fieldset>
			</div>
		);
	}
}

export default CreateTodo;
