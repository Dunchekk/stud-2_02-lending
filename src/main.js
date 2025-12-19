import "./styles/reset.css";
import "./styles/fonts.css";
import "./styles/global.css";
import "./styles/layers.css";
import "./styles/blocks.css";
import "./styles/cursor.css";
import "./styles/manifesto.css";

import { mountTextLayer } from "./add-layers/mountTextLayer.js";
import textData from "./data/textLayer.json";

const app = document.getElementById("app");

mountTextLayer({
  mountTo: app,
  data: textData,
  zIndex: 1,
});
