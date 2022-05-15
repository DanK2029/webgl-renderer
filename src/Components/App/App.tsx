import * as React from 'react';

import { Scene } from '../../Renderer/Scene';

import { AiFillBug } from 'react-icons/ai';

import { SceneEditor } from '../SceneEditor/SceneEditor';
import { ShaderEditor } from '../ShaderEditor/ShaderEditor';
import { MaterialEditor } from '../MaterialEditor/MaterialEditor';

import 'bootstrap'
import './App.scss'


enum AppState {
	EDIT_SCENE = 'EDIT_SCENE',
	EDIT_MATERIAL = 'EDIT_MATERIAL',
	EDIT_SHADER = 'EDIT_SHADER'
}

export default class App extends React.Component {

	private _state: AppState;

	private _deltaTime: number;
	private _scene: Scene;
	private _renderingContext: WebGL2RenderingContext;

	constructor(props: any) {
		super(props);
		
		this._deltaTime = 0.01;
		this._scene = new Scene(this._deltaTime);
		this._state = AppState.EDIT_SCENE;
	}

	recieveEvent(event: any) {
	}

	private switchAppState(state: AppState): void {
		this._state = state;
		this.forceUpdate();
	}

	private setContext(context: WebGL2RenderingContext): void {
		this._renderingContext = context;
	}

	private getAppStateComponent() {
		switch (this._state) {
			case AppState.EDIT_SCENE:
				return <SceneEditor 
					scene={this._scene}
					setContext={this.setContext.bind(this)}
				></SceneEditor>;
			
			case AppState.EDIT_SHADER:
				return <ShaderEditor></ShaderEditor>;
			
			case AppState.EDIT_MATERIAL:
				return <MaterialEditor></MaterialEditor>;
		}
	}

	render() {
		return (
			<div className='app-container'>
				<nav className='navbar navbar-expand-lg app-navbar'>
					<div className='container-fluid'>
						<span className='navbar-brand'>
							<AiFillBug></AiFillBug>
							FireFly
						</span>
						
						<div className='collapse navbar-collapse'>
							<ul className='navbar-nav'>
								<li className='nav-item'>
									<span onClick={() => this.switchAppState(AppState.EDIT_SCENE)}>
										Scene Editor
									</span>
								</li>
								<li className='nav-item'>
									<span onClick={() => this.switchAppState(AppState.EDIT_SHADER)}>
										Shader Editor
									</span>
								</li>
								<li className='nav-item'>
									<span onClick={() => this.switchAppState(AppState.EDIT_MATERIAL)}>
										Material Editor
									</span>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				{this.getAppStateComponent()}
			</div>
		);
	}
}