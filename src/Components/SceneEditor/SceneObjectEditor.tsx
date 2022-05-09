import * as React from 'react';

import { MdOutlineClear } from 'react-icons/md';
import { IoMdCube } from 'react-icons/io';

import { SceneObject } from '../../Renderer/Scene';
import { Texture } from '../../Renderer/Texture';
import { MaterialPropertyType } from '../../Renderer/Material';

import { VectorEditor } from './VectorEditor';

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

	addTextureFile(files: FileList): any {
		const file: File = files.item(0);
		const fileReader: FileReader = new FileReader();
		
		fileReader.readAsDataURL(file)
		fileReader.onload = (() => {
			let canvas: HTMLCanvasElement = document.createElement('canvas');
			let context: CanvasRenderingContext2D = canvas.getContext('2d');
			
			let image = new Image();
			image.src = fileReader.result as string;

			image.onload = () => {
				canvas.width = image.width;
				canvas.height = image.height;
				context.drawImage(image, 0, 0);

				const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
				const texture: Texture = new Texture(imageData.data, canvas.width, canvas.height);

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
		<div className='scene-object'>
			<div className='row'>
				<div className='col-10 vertically-align'>
					<IoMdCube className='scene-object-icon'></IoMdCube>
					<div className="scene-object-name">{obj.name}</div>
				</div>
				<div className='col-2 vertically-align'>
					<button 
						className='delete-button'
						onClick={() => this.state.onDeleteSceneObject(obj.id)}>
						<MdOutlineClear style={{ color: 'white' }}></MdOutlineClear>
					</button>
				</div>
			</div>

			<div className='row'>
				<div className='col'>
					<VectorEditor name='Position' vector={obj.translation as number[]}></VectorEditor>
				</div>
			</div>

			<div className='row'>
				<div className='col'>
					<VectorEditor name='Scale' vector={obj.scale as number[]}></VectorEditor>
				</div>
			</div>

			<div className='row'>
				<div className='col'>
					<VectorEditor name='Rotation' vector={obj.rotation as number[]}></VectorEditor>
				</div>
			</div>
		</div>
		);
	}
}

export { SceneObjectEditor }