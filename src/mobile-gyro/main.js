const Engine = Matter.Engine,
  Render = Matter.Render,
  Bodies = Matter.Bodies,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  Common = Matter.Common,
  // Events = Matter.Events,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Runner = Matter.Runner;

const width = document.body.clientWidth;
const height = document.body.clientHeight;
const allowPermissionBtn = document.getElementById("allowPermission");

// create engine
const engine = Engine.create();
const world = engine.world;

function run() {
  // create renderer
  const render = Render.create({
    element: document.body,
    engine,
    options: {
      width,
      height,
      pixelRatio: window.devicePixelRatio,
      wireframes: false,
      background: "#E5E7E9",
    },
  });

  Render.run(render);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  const stack = Composites.stack(0, 0, 20, 4, 0, 0, (x, y) => {
    return Bodies.circle(x, y, Common.random(15, 30), {
      restitution: 0.6,
      friction: 0.1,
    });
  });

  const thick = 50;
  Composite.add(world, [
    stack,
    // walls
    Bodies.rectangle(width / 2, -thick / 2, width, thick, { isStatic: true }),
    Bodies.rectangle(width / 2, height + thick / 2, width, thick, {
      isStatic: true,
    }),
    Bodies.rectangle(-thick / 2, height / 2, thick / 2, height, {
      isStatic: true,
    }),
    Bodies.rectangle(width + thick / 2, height / 2, thick, height, {
      isStatic: true,
    }),
  ]);
}
function listenOrientation() {
  window.addEventListener("deviceorientation", (event) => {
    var x = event.beta; // In degree in the range [-180,180)
    var y = event.gamma; // In degree in the range [-90,90)
    engine.gravity.y = x / 90;
    engine.gravity.x = y / 90;
  });
}

// setInterval(() => {
//   engine.gravity.y = -0.5;
//   engine.gravity.x = -0.5;
// }, 3000);
// DeviceOrientationEvent.requestPermission();

function permission() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    document.getElementById("allowPermission").addEventListener("click", () => {
      // (optional) Do something before API request prompt.
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          // (optional) Do something after API prompt dismissed.
          if (response == "granted") {
            run();
            listenOrientation();
          } else {
            alert("Permission not granted or browser version not supported");
          }
        })
        .catch((error) => alert("Not supported"));
    });
  } else {
    document.body.removeChild(allowPermissionBtn);
    run();
    listenOrientation();
  }
}
permission();
