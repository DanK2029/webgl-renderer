import * as React from 'react';

import { SceneObject } from '../../Renderer/Scene';

import 'bootstrap'
import './SceneObjectEditor.scss'

interface SceneObjectEditorProps {
	object: SceneObject;
}

class SceneObjectEditor extends React.Component<SceneObjectEditorProps, SceneObjectEditorProps> {

	constructor(props: SceneObjectEditorProps) {
		super(props);
		this.state = {
			object: props.object
		}
	}

	render() {
		let obj: SceneObject = this.state.object;
		return (
		<div className='card'>
			<div className='card-body'>
				<div className='card-text'>
					{obj.name}
				</div>
			</div>
		</div>
		);
	}
}

export { SceneObjectEditor }