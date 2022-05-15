import * as React from 'react';

import 'bootstrap'
import './App.scss'

import { SceneEditor } from '../SceneEditor/SceneEditor';

enum AppState {
	EDIT_SCENE,
	EDIT_MATERIAL,
	EDIT_SHADER
}

export default class App extends React.Component {

	constructor(props: any) {
		super(props);
	}

	recieveEvent(event: any) {
		
	}

	render() {
		return (
			<div className='container-fluid'>
				<nav className="navbar navbar-light bg-light">
					<span className="navbar-brand mb-0 h1">Navbar</span>
				</nav>
				<SceneEditor></SceneEditor>
			</div>
		);
	}
}