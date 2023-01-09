import * as React from 'react';

import { MdOutlineClear } from 'react-icons/md';
import { IoMdCube } from 'react-icons/io';

import { SceneObject } from '../../Renderer/Scene';
import { Texture } from '../../Renderer/Texture';
import { MaterialPropertyType } from '../../Renderer/Material';

import { ObjFileReader } from '../../FileReader/ObjReader';

import { VectorEditor } from './VectorEditor';

import 'bootstrap';
import './SceneObjectEditor.scss';

interface SceneObjectEditorProps {
	object: SceneObject;
	onDeleteSceneObject: (id: string) => void;
}

class SceneObjectEditor extends React.Component<
	SceneObjectEditorProps,
	SceneObjectEditorProps
> {
	constructor(props: SceneObjectEditorProps) {
		super(props);
		this.state = {
			object: props.object,
			onDeleteSceneObject: props.onDeleteSceneObject,
		};
	}

	addModelFile(files: FileList): void {
		const file: File = files.item(0);
		const fileReader: FileReader = new FileReader();

		fileReader.readAsText(file);
		fileReader.onload = () => {
			const data: string = fileReader.result as string;
			const objFileReader = new ObjFileReader();
			const newObj: SceneObject = objFileReader.toSceneObject(data);

			this.state.object.updateGeometry(
				newObj.indexBuffer,
				newObj.vertexBuffer
			);
		};
	}

	addTextureFile(files: FileList): void {
		const file: File = files.item(0);
		const fileReader: FileReader = new FileReader();

		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			const canvas: HTMLCanvasElement = document.createElement('canvas');
			const context: CanvasRenderingContext2D = canvas.getContext('2d');

			const image = new Image();
			image.src = fileReader.result as string;

			image.onload = () => {
				canvas.width = image.width;
				canvas.height = image.height;
				context.drawImage(image, 0, 0);

				const imageData: ImageData = context.getImageData(
					0,
					0,
					canvas.width,
					canvas.height
				);
				const texture: Texture = new Texture(
					imageData.data,
					canvas.width,
					canvas.height
				);

				this.state.object.material.addProperty({
					type: MaterialPropertyType.TEXTURE,
					name: 'texture',
					value: texture,
				});
			};
		};
	}

	render() {
		const obj: SceneObject = this.state.object;
		return (
			<div className="scene-object container card">
				<div className="row">
					<div className="col-10 vertically-align">
						<IoMdCube className="scene-object-icon"></IoMdCube>
						<div className="scene-object-name">{obj.name}</div>
					</div>
					<div className="col-2 vertically-align">
						<button
							className="delete-button"
							onClick={() =>
								this.state.onDeleteSceneObject(obj.id)
							}
						>
							<MdOutlineClear
								style={{ color: 'white' }}
							></MdOutlineClear>
						</button>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<VectorEditor
							name="Position"
							vector={obj.translation as number[]}
						></VectorEditor>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<VectorEditor
							name="Scale"
							vector={obj.scale as number[]}
						></VectorEditor>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<VectorEditor
							name="Rotation"
							vector={obj.rotation as number[]}
						></VectorEditor>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<label className="form-label" htmlFor="customFile">
							Scene Object Model
						</label>
						<input
							type="file"
							className="form-control"
							onChange={(e) => this.addModelFile(e.target.files)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<label className="form-label" htmlFor="customFile">
							Scene Object Texture
						</label>
						<input
							type="file"
							className="form-control"
							onChange={(e) =>
								this.addTextureFile(e.target.files)
							}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export { SceneObjectEditor };
