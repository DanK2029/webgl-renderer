import * as React from 'react';

import { ViewEditor } from './ViewEditor';
import { SceneObjectEditor } from './SceneObjectEditor';

import { Scene, SceneObject } from '../../Renderer/Scene';
import { empty } from '../../res/TestObjects/Empty';

import 'bootstrap'
import './SceneEditor.scss';

type EventCallback = (event: any) => void;

interface SceneEditorProps {
	scene: Scene;
	setContext: (context: WebGL2RenderingContext) => void;
}

class SceneEditor extends React.Component<SceneEditorProps> {

	private _scene: Scene;
	private _renderingContext: WebGL2RenderingContext;

	constructor(props: SceneEditorProps) {
		super(props);
		this._scene = this.props.scene;
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

	private setContext(context: WebGL2RenderingContext): void {
		this.props.setContext(context);
	}

	render() {
		return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-9'>
					<ViewEditor scene={this._scene} setContext={this.setContext.bind(this)}></ViewEditor>
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