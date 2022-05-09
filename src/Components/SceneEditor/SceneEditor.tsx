import * as React from 'react';

import { SceneContext } from '../Context/SceneContext';

import { Camera } from '../../Renderer/Scene';
import { Scene, SceneObject } from '../../Renderer/Scene';

import { triangle } from '../../res/TestObjects/Triangle';
import { cube } from '../../res/TestObjects/Cube';
import { square } from '../../res/TestObjects/Square';

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
	private _objFileReader: ObjFileReader;

	constructor(props: SceneEditorProps) {
		super(props);
		this._objFileReader = new ObjFileReader();
	}

	componentDidMount(): void {
		this._scene = this.context;
	}

	addSceneObject(name: string = 'New Tri') {
		function rand(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}

		let tri: SceneObject = triangle.clone();
		tri.name = name;
		tri.translation = [0, 0, -3];
		tri.translation = [rand(-1, 1), rand(-1, 1), rand(-5, -3)];
		tri.rotation = [rand(0, 360), rand(0, 360), rand(0, 360)];
		
		const r = [rand(0, 360), rand(0, 360), rand(0, 360)];
		tri.updateFunction = (time: number, obj: SceneObject) => {
			//obj.rotation = [time * r[0], time * r[1], time * r[2]];
		}

		this._scene.addObject(tri);
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