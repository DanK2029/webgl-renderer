import * as React from "react";

import { Scene } from "./Renderer/Scene";

const deltaTime: number = 0.01;
let scene = new Scene(deltaTime);
const SceneContext = React.createContext(new Scene(0.01));

export { SceneContext }