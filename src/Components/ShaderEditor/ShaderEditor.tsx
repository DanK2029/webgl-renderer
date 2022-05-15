import * as React from 'react';

interface ShaderEditorProps {

}

class ShaderEditor extends React.Component<ShaderEditorProps> {

	constructor(props: ShaderEditorProps) {
		super(props);
		console.log('Shader Editor Coinstructor')
	}

	render(): React.ReactNode {
		return (
			<div>
				Shader Editor
			</div>
		)
	}
}

export { ShaderEditor }