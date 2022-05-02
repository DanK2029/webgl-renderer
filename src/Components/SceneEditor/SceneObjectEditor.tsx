import * as React from 'react';

import { SceneObject } from '../../Renderer/Scene';
import { Texture } from '../../Renderer/Texture';

import 'bootstrap'
import './SceneObjectEditor.scss'
import { MaterialPropertyType } from '../../Renderer/Material';

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

	addTextureFile(files: FileList): any {
		const file: File = files.item(0);
		const fileReader: FileReader = new FileReader();
		fileReader.readAsDataURL(file)
		fileReader.onload = ((event: ProgressEvent<FileReader>) => {
			let context: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d');
			let image = new Image();
			image.src = fileReader.result as string;
			image.onload = () => {
				context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
				const imageData: ImageData = context.getImageData(0, 0, image.width, image.height);
				const texture: Texture = new Texture(imageData.data, imageData.width, imageData.height);
				// TODO: Data in imageData is not correct somethimes. Investigate why.
				console.log(imageData.data);
				this.state.object.material.addProperty({
					type: MaterialPropertyType.TEXTURE,
					name: 'texture',
					value: texture
				});
			}
		});
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
					<div className="input-group mb-3">
						<label className="input-group-text" htmlFor="load-model">Load Texture</label>
						<input type="file" id="load-model" className='form-control' onChange={(e) => this.addTextureFile.bind(this)(e.target.files)}></input>
					</div>
				</div>
			</div>
		</div>
		);
	}
}

export { SceneObjectEditor }