import * as React from 'react';

import { ViewEditor } from './ViewEditor';
import { SceneObjectEditor } from './SceneObjectEditor';

import { Scene, SceneObject } from '../../Renderer/Scene';
import { empty } from '../../res/TestObjects/Empty';

import 'bootstrap'
import './SceneEditor.scss';

type EventCallback = (event: any) => void;

interface SceneEditorProps {
	
}

class SceneEditor extends React.Component<SceneEditorProps> {

	private _deltaTime: number = 0.01;
	private _scene: Scene;

	constructor(props: SceneEditorProps) {
		super(props);
		this._scene = new Scene(this._deltaTime);
	}

	addSceneObject(name: string = 'New Scene Object') {
		let obj: SceneObject = empty.clone();
		obj.name = name;

		this._scene.addObject(obj);
		this.forceUpdate();
	}

	deleteSceneObject(id: string) {
		this._scene.deleteObject(id);
		this.forceUpdate();
	}

	render() {
		return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-9'>
					<ViewEditor scene={this._scene}></ViewEditor>
				</div>
				<div className='col-3'>
					<div className='scene-editor'>
						<button 
							id="add-scene-object" 
							className='btn btn-primary' 
							onClick={() => this.addSceneObject.bind(this)('New Scene Object')}
						>
						Add Object
						</button>

						<div className="scene-object-list">
							{this._scene && this._scene.objectList.map((obj: SceneObject) => (
								<SceneObjectEditor 
									key={obj.id} 
									object={obj} 
									onDeleteSceneObject={this.deleteSceneObject.bind(this)}
								>
								</SceneObjectEditor>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
		);
	}
}

export { SceneEditor };