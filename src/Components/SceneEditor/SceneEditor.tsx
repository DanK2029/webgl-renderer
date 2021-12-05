import * as React from 'react';

import { SceneContext } from '../SceneContext';

import { Scene, SceneObject } from '../Renderer/Scene';
import { triangle } from '../Renderer/TestObjects/Triangle';
import { cube } from '../Renderer/TestObjects/Cube';

import { SceneObjectEditor } from './SceneObjectEditor';

import 'bootstrap'
import './SceneEditor.scss';

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
		this.addCube('cube 1');
		this.addTri('Tri 1');
	}

	addTri(name: string = 'New Tri') {
		function rand(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}

		let tri: SceneObject = triangle.clone();
		tri.name = name;
		tri.translation = [rand(-1, 1), rand(-1, 1), rand(-5, -3)];
		tri.rotation = [rand(0, 360), rand(0, 360), rand(0, 360)];
		
		const r = [rand(0, 360), rand(0, 360), rand(0, 360)];
		tri.updateFunction = (time: number, obj: SceneObject) => {
			obj.rotation = [time * r[0], time * r[1], time * r[2]];
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
		c.translation = [rand(-1, 1), rand(-1, 1), rand(-5, -3)];
		const r = [rand(0, 360), rand(0, 360), rand(0, 360)];
		c.rotation = [rand(0, 360), rand(0, 360), rand(0, 360)];
		c.updateFunction = (time: number, obj: SceneObject) => {
			const c = 100;
			obj.rotation = [time * r[0], time * r[1], time * r[2]];
		}

		this._scene.addObject(c);
		this.forceUpdate();
	}

	render() {
		return (
			<div className='scene-editor'>
				<button id="add-tri"className='btn btn-primary' onClick={() => this.addCube.bind(this)('New Cube')}>Add Cube</button>
				<button id="add-cube" className='btn btn-primary'onClick={() => this.addTri.bind(this)('New Tri')}>Add Triangle</button>
				<div className='obj-list'>
					{this._scene && this._scene.objectList.map((obj: SceneObject) => (
						<SceneObjectEditor key={obj.id} object={obj}></SceneObjectEditor>
					))}
				</div>
			</div>
		);
	}
}

SceneEditor.contextType = SceneContext;

export { SceneEditor };