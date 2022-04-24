import { expose } from "comlink";

const streamData = () => {
  console.log("test");
};

expose({ streamData });
