import * as React from 'react';

import { Scene } from './Scene';

const RendererContext: React.Context<Scene> = React.createContext(new Scene());

const RendererProvider: React.Provider<Scene> = RendererContext.Provider;
const RendererConsumer: React.Consumer<Scene> = RendererContext.Consumer;

export {RendererProvider, RendererConsumer }
export default RendererContext;