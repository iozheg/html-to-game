import "./styles/style.css";
import "./styles/walls.css";
import "./styles/animations.css";
import "./images/github.png";
import "./images/background.png";
import "./images/bg-middle.png";
import "./images/tileset.png";
import "./images/props.png";
import "./images/vue.png";
import "./images/css.png";
import "./images/html.png";
import "./images/javascript.png";
import "./images/webpack.png";
import "./images/python.png";
import SceneController from "./sceneController";

function initDomElements() {
  const container = document.getElementById("pixi-container");
  const scene = document.getElementById("dom-container");

  new SceneController(scene, container);
}

window.onload = initDomElements;
