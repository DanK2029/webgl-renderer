// React test
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './Components/App'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

ReactDOM.render(<App />, document.getElementById('app'));

// import { Renderer } from './Renderer/Renderer.js';
// import { Scene, SceneObject, Light } from './Renderer/Scene.js'
// import { Camera } from './Renderer/Camera.js'
// import { GenerateCube, GenerateTriangle, GeneratePlane } from './Renderer/Geometry.js'



// window.addEventListener('load', setup);

// function setup() {
// 	const canvasId = 'canvas';
// 	let renderer = new Renderer(canvasId);

// 	let camera = new Camera(canvasId, 90, 0.001, 1000);
// 	camera.translation = [0, 0, 2];
// 	camera.updateFunction = (t, obj) => {
// 		obj.translation = [Math.sin(t), 0, 2];
// 	};

// 	const cube = GenerateCube(1);
// 	const tri = GenerateTriangle();
// 	const plane = GeneratePlane(-0.5);

// 	let objects = [
// 		{
// 			name: 'Plane',
// 			vertices: plane.vertices,
// 			layout: plane.layout,
// 			indices: plane.indices,
// 			color: [0.43, 0.21, 0.3, 1],
// 			translation: [0, 0, 0],
// 			scale: [1, 1, 1],
// 			rotation: [0, 0, 0],
// 		},
// 		{
// 			name: 'Test Obj',
// 			vertices: cube.vertices,
// 			layout: cube.layout,
// 			indices: cube.indices,
// 			color: [0.43, 0.21, 0.3, 1],
// 			translation: [0, 0, 0],
// 			scale: [1, 1, 1],
// 			rotation: [0, 0, 0],
// 			update: (t, obj) => {
// 				obj.rotation = [0, 0.025, 0];
// 				obj.translation = [0, 0, Math.sin(t)];
// 			}
// 		},
// 	].map((obj) => {
// 		let sceneObj = new SceneObject(obj.vertices, obj.layout, obj.indices, obj.color);
// 		sceneObj.translation = obj.translation;
// 		sceneObj.scale = obj.scale;
// 		sceneObj.rotation = obj.rotation;
// 		sceneObj.updateFunction = obj.update;
// 		sceneObj.name = obj.name;
// 		return sceneObj;
// 	});

// 	let lights = [
// 		{
// 			position: [1, 1, 0],
// 			color: [1, 1, 1]
// 		},
// 		{
// 			position: [-1, 1, 0],
// 			color: [1, 0, 0]
// 		}
// 	].map((light) => {
// 		return new Light(light.position, light.color);
// 	});

// 	let scene = new Scene();
// 	scene.camera = camera;
// 	scene.addObjects(objects);
// 	//scene.addLights(lights);
// 	renderer.scene = scene;
	
// 	renderer.drawScene();
// }
