import * as React from 'react';

import { Material, MaterialProperty, MaterialPropertyType } from '../../Renderer/Material';
import { Shader, ShaderProgram, ShaderType } from '../../Renderer/Shader';

import { cube } from '../../res/TestObjects/Cube';

import 'bootstrap';
import './MaterialEditor.scss';
import { MaterialPropertyEditor } from './MaterialPropertyEditor';

interface MaterialEditorProps {
	materialSet: Record<string, Material>;
}

interface MaterialEditorState {
	curMaterial: Material | undefined;
}

class MaterialEditor extends React.Component<MaterialEditorProps, MaterialEditorState> {

	private _materialSet: Record<string, Material>;

	constructor(props: MaterialEditorProps) {
		super(props);

		this.state = {
			curMaterial: undefined
		};

		this._materialSet = props.materialSet;

		this._materialSet['Test Material'] = cube.material;
	}

	private addMaterial(): void {
		const fragShader: Shader = new Shader('', ShaderType.FRAGMENT);
		const vertShader: Shader = new Shader('', ShaderType.VERTEX);
		const shaderProgram: ShaderProgram = new ShaderProgram(vertShader, fragShader);
		const material: Material = new Material('New Material', shaderProgram, []);
		this._materialSet[material.name] = material;
		this.forceUpdate();
	}

	private selectMaterial(material: Material): void {
		this.setState({
			curMaterial: material
		});
	}

	private addMaterialProp(): void {
		const numNewProperties: number = this.state.curMaterial.properties.filter((prop: MaterialProperty) => 
			prop.name.includes('New Material Property')
		).length;

		this.state.curMaterial.addProperty({
			type: MaterialPropertyType.SCALAR,
			name: numNewProperties > 0 
				? `New Material Property (${numNewProperties})`
				: 'New Material Property',
			value: [0],
		});

		this.forceUpdate();
	}

	private renderCurMaterial(curMaterial: Material): React.ReactNode {
		if (curMaterial) {
			return (
				<div className='card material-editor-container'>
					<h2 className='material-name'>
						{curMaterial.name}
					</h2>

					<div className='input-group mb-3'>
						<label className='input-group-text'>
							Vertex Shader
						</label>
						<select className='form-select' >
							<option>Test Vertex</option>
						</select>
					</div>

					<div className='input-group mb-3'>
						<label className='input-group-text'>
							Fragment Shader
						</label>
						<select className='form-select'>
							<option>Test Fragment</option>
						</select>
					</div>

					<div className='d-flex flex-row'>
						<h4 className='properties-header'>Properties</h4>
						<button className='light-blue-btn' onClick={() => {this.addMaterialProp();}}>
							Add Property
						</button>
					</div>
					<div>
						{curMaterial.properties.map((prop: MaterialProperty) => {
							return (
								<div key={prop.name}>
									<MaterialPropertyEditor property={prop}></MaterialPropertyEditor>
								</div>
							);
						})}
					</div>
				</div>
			);
		} else {
			return (
				<div className='alert alert-light no-material-alert center-block'>
					<h2>
						No Current Material
					</h2>
				</div>
			);
		}
	}

	render(): React.ReactNode {
		return (
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-9 justify-content-center'>
						{this.renderCurMaterial(this.state.curMaterial)}
					</div>
					<div className='col-3'>
						<button className='light-blue-btn full-width' onClick={() => this.addMaterial()}>
							Add Material
						</button>
						<div className='material-list'>
							{Object.keys(this._materialSet).map((materialName: string) => {
								const material = this._materialSet[materialName];
								return (
									<button className='material-item' 
										key={material.id} 
										onClick={() => this.selectMaterial(material)}>
										{material.name}
									</button>
								);
							})};
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export { MaterialEditor };