import * as React from 'react';

import './VectorEditor.scss';

interface VectorEditorProps {
	name: string;
	vector: number[];
}

class VectorEditor extends React.Component<VectorEditorProps, VectorEditorProps> {

	constructor(props: VectorEditorProps) {
		super(props);
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

	render(): React.ReactNode {
		const name: string = this.state.name;
		const vector: number[] = this.state.vector;
		return (
			<div className='row vector-editor'>
				<div className='col-3'>
					<p className='vector-name'>{name}:</p>
				</div>
				<div className="col vector-values input-group">
					{vector.map((v: number, index: number) => {
						return (
							<input type="number" key={index} className='form-control vector-value'
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