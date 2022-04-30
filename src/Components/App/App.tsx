import * as React from 'react';

import 'bootstrap'
import './App.scss'

import { ViewEditor } from '../ViewEditor/ViewEditor';
import { Scene } from '../../Renderer/Scene';
import { SceneEditor } from '../SceneEditor/SceneEditor';

import { SceneContext } from '../Context/SceneContext';


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
			<div className='container-fluid'>
				<div className='row'>
					<SceneContext.Provider value={new Scene(this._deltaTime)}>
						<div className='col-9'>
							<ViewEditor></ViewEditor>
						</div>
						<div className='col-3'>
							<SceneEditor></SceneEditor>
						</div>
					</SceneContext.Provider>
				</div>
			</div>
		);
	}
}