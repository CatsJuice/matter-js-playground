var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Common = Matter.Common;

var width = 800;
var height = 600;

// create an engine
var engine = Engine.create();
var world = engine.world;

// create a renderer
var render = Render.create({
  element: document.body,
  engine,
  options: {
    width,
    height,
    wireframes: false,
    background: "#E5E7E9",
    pixelRatio: window.devicePixelRatio,

    // showAngleIndicator: true,
  },
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
function drop() {
  var stack = Composites.stack(0, -300, 20, 5, 0, 0, function (x, y) {
    return Bodies.circle(x, y, Common.random(10, 20), {
      friction: 0.00001,
      restitution: 0.5,
      density: 0.001,
      render: {
        fillStyle: Common.choose([
          "#F1C40F",
          "#F39C12",
          "#E74C3C",
          "#76D7C4",
          "#273746",
        ]),
      },
    });
  });
  Composite.add(world, stack);
}
drop();
setInterval(drop, 8000);

Composite.add(world, [
  Bodies.rectangle(200, 150, 700, 20, {
    isStatic: true,
    angle: Math.PI * 0.06,
    render: { fillStyle: "#fff" },
  }),
  Bodies.rectangle(500, 350, 700, 20, {
    isStatic: true,
    angle: Math.PI * -0.06,
    render: { fillStyle: "#fff" },
  }),
  Bodies.rectangle(200, 550, 700, 20, {
    isStatic: true,
    angle: Math.PI * 0.04,
    render: { fillStyle: "#fff" },
  }),

  // walls
  // Bodies.rectangle(width / 2, -1, width, 1, { isStatic: true }),
  // Bodies.rectangle(width / 2, height + 1, width, 1, { isStatic: true }),
  Bodies.rectangle(-1, height / 2, 1, height, { isStatic: true }),
  Bodies.rectangle(width + 1, height / 2, 1, height, { isStatic: true }),
]);

// add mouse control
var mouse = Mouse.create(render.canvas);
var mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.2,
    render: { visible: false },
  },
});
Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
// Render.lookAt(render, Composite.allBodies(world));
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: width, y: height },
});
