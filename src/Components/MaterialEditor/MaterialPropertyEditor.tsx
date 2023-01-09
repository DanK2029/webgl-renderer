import * as React from 'react';
import { MaterialProperty, MaterialPropertyType } from '../../Renderer/Material';

import { VectorEditor } from '../SceneEditor/VectorEditor';

interface MaterialPropertyEditorProps {
	property: MaterialProperty
}

interface MaterialPropertyEditorState {
	property: MaterialProperty
}

class MaterialPropertyEditor extends React.Component<MaterialPropertyEditorProps, MaterialPropertyEditorState> {

	constructor(props: MaterialPropertyEditorProps) {
		super(props);

		this.state = {
			property: props.property
		};
	}

	private renderVector(): React.ReactNode {
		return (
			<VectorEditor name={this.state.property.name} vector={this.state.property.value as number[]}></VectorEditor>
		);
	}

	renderProp(): React.ReactNode {
		const type = this.state.property.type;
		const isVector: boolean = (type === MaterialPropertyType.SCALAR)
			|| (type === MaterialPropertyType.VEC2)
			|| (type === MaterialPropertyType.VEC3)
			|| (type === MaterialPropertyType.VEC4);
		
		if (isVector) {
			return this.renderVector();
		} else if (type == MaterialPropertyType.MAT4) {
			return (<div>MAT4 TYPE</div>);
		} else if (type == MaterialPropertyType.TEXTURE) {
			return (<div>TEXTURE TYPE</div>);
		} else {
			return (<div>UNKNOWN TYPE</div>);
		}
	}

	render(): React.ReactNode {
		return (
			<div>
				{this.renderProp()}
				<div className='dropdown'>
					<button className='btn btn-secondary dropdown-toggle' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
						Dropdown button
					</button>
					<ul className='dropdown-menu' aria-labelledby="dropdownMenuButton1">
						<li><a className='dropdown-item' href="#">Action</a></li>
						<li><a className='dropdown-item' href="#">Another action</a></li>
						<li><a className='dropdown-item' href="#">Something else here</a></li>
					</ul>
				</div>
			</div>
		);
	}
}

export { MaterialPropertyEditor };