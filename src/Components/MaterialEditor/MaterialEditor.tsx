import * as React from 'react';

import { Material, MaterialProperty, MaterialPropertyType } from '../../Renderer/Material';

import { cube } from '../../res/TestObjects/Cube';

import 'bootstrap';
import './MaterialEditor.scss';
import { Shader, ShaderProgram, ShaderType } from '../../Renderer/Shader';

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

	private renderCurMaterial(curMaterial: Material): React.ReactNode {
		if (curMaterial) {
			return (
				<div>
					<div>{curMaterial.name}</div>
					<div>
						{curMaterial.properties.map((prop: MaterialProperty) => {
							return (<div key={prop.name}>{prop.name}</div>);
						})}
					</div>
				</div>
			);
		} else {
			return (
				<div>No Current Material</div>
			);
		}
	}

	render(): React.ReactNode {
		return (
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-9'>
						{this.renderCurMaterial(this.state.curMaterial)}
					</div>
					<div className='col-3'>
						<button id='add-material' className='' onClick={() => this.addMaterial()}>
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