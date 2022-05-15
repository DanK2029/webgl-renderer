import * as React from 'react';

interface MaterialEditorProps {

}

class MaterialEditor extends React.Component<MaterialEditorProps> {

	constructor(props: MaterialEditorProps) {
		super(props);
	}

	render(): React.ReactNode {
		return (
			<div>
				Material Editor
			</div>
		)
	}
}

export { MaterialEditor }