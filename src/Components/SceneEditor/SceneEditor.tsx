import * as React from 'react';

import { SceneContext } from '../Context/SceneContext';

import { Camera } from '../../Renderer/Scene';
import { Scene, SceneObject } from '../../Renderer/Scene';

import { triangle } from '../../res/TestObjects/Triangle';
import { cube } from '../../res/TestObjects/Cube';
import { square } from '../../res/TestObjects/Square';
import { empty } from '../../res/TestObjects/Empty';

import { SceneObjectEditor } from './SceneObjectEditor';

import { ObjFileReader } from '../../FileReader/ObjReader';

import 'bootstrap'
import './SceneEditor.scss';
import { Texture } from '../../Renderer/Texture';
import { Material, MaterialProperty, MaterialPropertyType } from '../../Renderer/Material';

type EventCallback = (event: any) => void;

interface SceneEditorProps {
	
}

class SceneEditor extends React.Component<SceneEditorProps> {

	private _scene: Scene;

	constructor(props: SceneEditorProps) {
		super(props);
	}

	componentDidMount(): void {
		this._scene = this.context;
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
			<div className='scene-editor'>
				<button 
					id="add-scene-object" 
					className='btn btn-primary' 
					onClick={() => this.addSceneObject.bind(this)('New Scene Object')}>
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
		);
	}
}

SceneEditor.contextType = SceneContext;

export { SceneEditor };