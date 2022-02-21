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

	addTri(name: string = 'New Tri') {
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

	addCube(name: string = 'New Cube') {
		function rand(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}

		let c: SceneObject = cube.clone();
		c.name = name;
		c.translation = [0, 0, -3];
		
		c.translation = [rand(-1, 1), rand(-1, 1), rand(-5, -3)];
		const r = [rand(0, 360), rand(0, 360), rand(0, 360)];
		c.rotation = [rand(0, 360), rand(0, 360), rand(0, 360)];
		c.updateFunction = (time: number, obj: SceneObject) => {
			const c = 100;
			obj.rotation = [r[0] * time, r[1] * time, r[2] * time];
		}

		this._scene.addObject(c);
		this.forceUpdate();
	}

	addFile(files: FileList) {
		const file: File = files.item(0);
		const fileReader: FileReader = new FileReader();
		fileReader.readAsText(file)
		fileReader.onload = ((event: ProgressEvent) => {
			const fileText: string = fileReader.result as string;
			let fileObj: SceneObject = this._objFileReader.toSceneObject(fileText)
			fileObj.name = 'File Obj';
			fileObj.translation = [0, 0, -10];
			let scale = 0.5;
			fileObj.updateFunction = (time: number, obj: SceneObject) => {
				obj.rotation = [10 * time, 10 * time , 10 * time];
			};
			fileObj.scale = [scale, scale, scale];
			this._scene.addObject(fileObj);
		})
	}

	deleteSceneObject(id: string) {
		this._scene.deleteObject(id);
		this.forceUpdate();
	}

	render() {
		return (
			<div className='scene-editor'>
				<button id="add-tri"className='btn btn-primary' onClick={() => this.addCube.bind(this)('New Cube')}>Add Cube</button>
				<button id="add-cube" className='btn btn-primary' onClick={() => this.addTri.bind(this)('New Tri')}>Add Triangle</button>
				<input type="file" id="add-modle" className='btn btn-primary' onChange={(e) => this.addFile.bind(this)(e.target.files)}></input>
				<div className='obj-list'>
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