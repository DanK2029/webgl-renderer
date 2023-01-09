import * as React from 'react';

import './VectorEditor.scss';

interface VectorEditorProps {
	name: string;
	vector: number[];
}

class VectorEditor extends React.Component<VectorEditorProps, VectorEditorProps> {

	private _editName: boolean;
	private _nameInputRef: React.RefObject<HTMLInputElement>;

	constructor(props: VectorEditorProps) {
		super(props);

		this._editName = false;
		this._nameInputRef = React.createRef<HTMLInputElement>();

		this.state = {
			name: props.name,
			vector: props.vector
		};
	}

	updateValue(newValue: number, index: number): void {
		const updatedVector: number[] = this.state.vector;
		updatedVector[index] = newValue;
		this.setState({
			vector: updatedVector
		});
	}

	startEditName(): void {
		this._editName = true;
		this.forceUpdate();
	}

	changeName(): void {
		this._editName = false;
		const newName = this._nameInputRef.current.value;
		this.setState({
			name: newName,
		});
	}

	keyHandler(event: React.KeyboardEvent<HTMLInputElement>): void {
		const key: string = event.key;
		switch(key) {
			case 'Enter':
				this.changeName();
				break;
		}
	}

	getName(): React.ReactNode {
		if (this._editName) {
			console.log('input');
			return (
				<input type='text' defaultValue={this.state.name} ref={this._nameInputRef} onKeyUp={this.keyHandler.bind(this)}></input>
			);
		} else {
			return (
				<span className='input-group-text' onDoubleClick={() => {this.startEditName();}}>
					{this.state.name}
				</span>
			);
		}
	}

	render(): React.ReactNode {
		const vector: number[] = this.state.vector;
		return (
			<div className='row vector-editor'>
				<div className='col vector-values input-group'>
					{this.getName()}
					{vector.map((v: number, index: number) => {
						return (
							<input type='number' step='0.01' key={index} className='form-control vector-value'
								defaultValue={v} onChange={(e) => {
									const stringVal: string = e.target.value;
									const valueNum: number = +stringVal;
									this.updateValue(valueNum, index);
								}}>
							</input>
						);
					})}
				</div>
			</div>
		);
	}
}

export { VectorEditorProps, VectorEditor };