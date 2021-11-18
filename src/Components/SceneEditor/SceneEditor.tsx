import * as React from 'react';

import './SceneEditor.scss';

type EventCallback = (event: any) => void;

interface SceneEditorProps {
	
}

class SceneEditor extends React.Component<SceneEditorProps> {

	constructor(props: SceneEditorProps) {
		super(props);
	}

	addTri() {

	}

	render() {
		return (
			<button id='add-tri-button' onClick={this.addTri.bind(this)}>Add Triangle</button>
		);
	}
}

export { SceneEditor };