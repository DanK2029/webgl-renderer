import * as React from 'react';

import 'bootstrap'
import './App.scss'

import { Renderer } from './Renderer/Renderer';
import { Scene } from './Renderer/Scene';
import { SceneEditor } from './SceneEditor/SceneEditor';

import { SceneContext } from './SceneContext';
export default class App extends React.Component {

	private _deltaTime: number = 0.01;

	constructor(props: any) {
		super(props);
	}

	recieveEvent(event: any) {
		console.log(event);
	}

	render() {
		return (
			<div className='container'>
				<SceneContext.Provider value={new Scene(this._deltaTime)}>
					<Renderer></Renderer>
					<SceneEditor></SceneEditor>
				</SceneContext.Provider>
			</div>
		);
	}
}