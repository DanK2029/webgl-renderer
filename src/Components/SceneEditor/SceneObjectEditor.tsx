import * as React from 'react';

import { SceneObject } from '../../Renderer/Scene';

import 'bootstrap'
import './SceneObjectEditor.scss'

interface SceneObjectEditorProps {
	object: SceneObject;
	onDeleteSceneObject: (id: string) => void
}

class SceneObjectEditor extends React.Component<SceneObjectEditorProps, SceneObjectEditorProps> {

	constructor(props: SceneObjectEditorProps) {
		super(props);
		this.state = {
			object: props.object,
			onDeleteSceneObject: props.onDeleteSceneObject
		}
	}

	render() {
		let obj: SceneObject = this.state.object;
		return (
		<div className='card'>
			<div className='card-body'>
				<div className='card-text'>
					{obj.name}
					<button type='button' className='btn btn-danger delete-scene-object' 
					onClick={() => {this.state.onDeleteSceneObject(this.state.object.id)}}>X</button>
				</div>
			</div>
		</div>
		);
	}
}

export { SceneObjectEditor }