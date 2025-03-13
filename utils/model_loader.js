import * as tf from "@tensorflow/tfjs-react-native";

const collisionModel = require("../assets/collision.onnx");
const defectsModel = require("../assets/defects.onnx");

export default async function loadModels() {
  await tf.ready(); // Ensure TensorFlow.js is ready
  const model1 = await tf.loadGraphModel(collisionModel);
  const model2 = await tf.loadGraphModel(defectsModel);
  return { model1, model2 };
}
