import * as React from 'react';

import './App.scss'

import { Renderer } from './Renderer/Renderer';
import { SceneEditor } from './SceneEditor/SceneEditor';

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
				<SceneEditor></SceneEditor>
			</div>
		);
	}
}