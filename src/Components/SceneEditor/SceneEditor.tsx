import * as React from 'react';

import { SceneContext } from '../SceneContext';

import { Scene, SceneObject } from '../Renderer/Scene';
import { triangle } from '../Renderer/SceneObjects';

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
		this.addTri();
	}

	addTri() {
		function rand(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}

		let tri: SceneObject = triangle.clone();
		tri.translation = [rand(-1, 1), rand(-1, 1), rand(-5, -1)];
		tri.rotation = [rand(0, 360), rand(0, 360), rand(0, 360)];
		this._scene.addObject(tri);
		this.forceUpdate();
	}

	render() {
		return (
			<div className='scene-editor'>
				<button id="add-tri"className='btn btn-primary' onClick={this.addTri.bind(this)}>Add Triangle</button>
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