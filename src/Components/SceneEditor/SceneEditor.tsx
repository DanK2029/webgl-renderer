import * as React from 'react';

import RendererContext from '../Renderer/Context';
import { GenerateCube, GenerateTriangle } from '../Renderer/Geometry'

import './SceneEditor.scss';

type EventCallback = (event: any) => void;

interface SceneEditorProps {
	eventCallback: EventCallback;
}

export default class SceneEditor extends React.Component<SceneEditorProps> {

	private _eventCallback: EventCallback;

	constructor(props: any) {
		super(props);
		this._eventCallback = props.eventCallback.bind(this);
	}

	addTri() {

	}

	render() {
		return (
			<button id='add-tri-button' onClick={this.addTri.bind(this)}>Add Triangle</button>
		);
	}
}
SceneEditor.contextType = RendererContext;