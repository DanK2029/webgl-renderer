import * as React from 'react';

import './App.scss'

import { Renderer } from './New_Renderer/Renderer';

export default class App extends React.Component {

	constructor(props: any) {
		super(props);
	}

	recieveEvent(event: any) {
		console.log(event);
	}

	render() {
		return (
			<div id='app-container'>
				<Renderer></Renderer>
			</div>
		);
	}
}