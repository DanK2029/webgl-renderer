import * as React from "react";

import { Scene } from "./Renderer/Scene";

const SceneContext = React.createContext(new Scene(0.01));

export { SceneContext }