import * as React from 'react';

import { Scene } from '../../Renderer/Scene';

import { AiFillBug } from 'react-icons/ai';

import { SceneEditor } from '../SceneEditor/SceneEditor';
import { ShaderEditor } from '../ShaderEditor/ShaderEditor';
import { MaterialEditor } from '../MaterialEditor/MaterialEditor';

import { Material } from '../../Renderer/Material';

import 'bootstrap';
import './App.scss';

enum EditorState {
	EDIT_SCENE = 'EDIT_SCENE',
	EDIT_MATERIAL = 'EDIT_MATERIAL',
	EDIT_SHADER = 'EDIT_SHADER',
}

interface AppState {
	editorState: EditorState;
	materialLibrary: Record<string, Material>;
}

export default class App extends React.Component<
	Record<string, never>,
	AppState
> {
	private _deltaTime: number;
	private _scene: Scene;

	private _loadSceneRef = React.createRef<HTMLInputElement>();

	constructor(props: Record<string, never>) {
		super(props);

		this._deltaTime = 0.01;
		this._scene = new Scene(this._deltaTime);

		this.state = {
			editorState: EditorState.EDIT_SCENE,
			materialLibrary: {},
		};
	}

	private switchAppState(editorState: EditorState): void {
		this.setState({
			editorState: editorState,
		});
	}

	private getEditorStateComponent() {
		switch (this.state.editorState) {
			case EditorState.EDIT_SCENE:
				return <SceneEditor scene={this._scene}></SceneEditor>;

			case EditorState.EDIT_SHADER:
				return <ShaderEditor></ShaderEditor>;

			case EditorState.EDIT_MATERIAL:
				return (
					<MaterialEditor
						materialSet={this.state.materialLibrary}
					></MaterialEditor>
				);
		}
	}

	private loadScene(file: File) {
		const fileReader = new FileReader();
		fileReader.readAsText(file);
		fileReader.onload = () => {
			const data: string = fileReader.result as string;
			const scene: Scene = JSON.parse(data);
			console.log(scene);
		};
	}

	private saveScene() {
		console.log('saving scene...');
	}

	render() {
		return (
			<div className="app-container">
				<nav className="app-navbar">
					<div className="container-fluid">
						<span className="navbar-brand">
							<AiFillBug></AiFillBug>
							FireFly
						</span>

						<div className="collapse navbar-collapse">
							<ul className="navbar-nav">
								<li className="nav-item">
									<span
										onClick={() =>
											this.switchAppState(
												EditorState.EDIT_SCENE
											)
										}
									>
										Scene Editor
									</span>
								</li>
								<li className="nav-item">
									<span
										onClick={() =>
											this.switchAppState(
												EditorState.EDIT_SHADER
											)
										}
									>
										Shader Editor
									</span>
								</li>
								<li className="nav-item">
									<span
										onClick={() =>
											this.switchAppState(
												EditorState.EDIT_MATERIAL
											)
										}
									>
										Material Editor
									</span>
								</li>
							</ul>
						</div>
						<div>
							<button
								type="button"
								className="load-scene-button"
								onClick={() => {
									this._loadSceneRef.current.click();
								}}
							>
								Load Scene
							</button>
							<input
								type="file"
								ref={this._loadSceneRef}
								style={{ display: 'none' }}
								onChange={(event) => {
									this.loadScene(event.target.files[0]);
								}}
							/>
						</div>
					</div>
				</nav>

				<div className="editor-container">
					{this.getEditorStateComponent()}
				</div>
			</div>
		);
	}
}
