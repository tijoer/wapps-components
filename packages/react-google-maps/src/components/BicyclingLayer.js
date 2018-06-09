import createEntity from './createEntity';
import { withMapContext } from './Context';

/** see https://developers.google.com/maps/documentation/javascript/reference/3.exp/map?hl=de#BicyclingLayer */
const evtNames = [];

const propertyNames = ['map'];

const BicyclingLayer = createEntity('BicyclingLayer', evtNames, propertyNames);

export default withMapContext(BicyclingLayer);
