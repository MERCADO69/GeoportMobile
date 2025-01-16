import { registerRootComponent } from 'expo';

import App from './Navigation/Maincontainer';


import Mylogo from './Images/Geo.svg';
import Tagline from './Images/Sibya.svg';
import Fb from './Images/facebook.svg';
import ContinueG from './Images/continue.svg';
import Either from './Images/choices.svg';


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

registerRootComponent(App);