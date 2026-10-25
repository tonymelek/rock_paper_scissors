import { spawn } from "node:child_process";
import { watch } from "node:fs";

let pending = false;
let running = false;

function build() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  const child = spawn("lightningcss", ["--minify", "css/input.css", "-o", "css/app.css"], {
    stdio: "inherit",
  });
  child.on("exit", (code) => {
    running = false;
    if (code !== 0) {
      console.error("css build failed");
    } else {
      console.log("wrote css/app.css");
    }
    if (pending) {
      pending = false;
      build();
    }
  });
}

build();
watch("css/input.css", build);
