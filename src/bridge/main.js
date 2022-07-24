const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Body = Matter.Body,
  Constraint = Matter.Constraint,
  Common = Matter.Common,
  Events = Matter.Events;

const width = 800;
const height = 600;

// create engine
const engine = Engine.create();
const world = engine.world;

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
const group = Body.nextGroup(true);
const bridge = Composites.stack(160, 290, 15, 1, 0, 0, (x, y) => {
  return Bodies.rectangle(x - 20, y, 53, 20, {
    collisionFilter: { group },
    chamfer: 5,
    density: 0.001,
    frictionAir: 0.05,
    render: {
      fillStyle: "#060a19",
    },
  });
});
Composites.chain(bridge, 0.3, 0, -0.3, 0, {
  stiffness: 0.9,
  length: 0,
  render: { visible: false },
});

const stack = Composites.stack(250, 50, 6, 3, 0, 0, function (x, y) {
  return Bodies.rectangle(x, y, 50, 50, Common.random(20, 40));
});

Composite.add(world, [
  bridge,
  // stack,
  Bodies.rectangle(30, 490, 220, 380, {
    isStatic: true,
    chamfer: { radius: 20 },
  }),
  Bodies.rectangle(770, 490, 220, 380, {
    isStatic: true,
    chamfer: { radius: 20 },
  }),
  Constraint.create({
    pointA: { x: 140, y: 300 },
    bodyB: bridge.bodies[0],
    pointB: { x: -25, y: 0 },
    length: 2,
    stiffness: 0.9,
  }),
  Constraint.create({
    pointA: { x: 660, y: 300 },
    bodyB: bridge.bodies[bridge.bodies.length - 1],
    pointB: { x: 25, y: 0 },
    length: 2,
    stiffness: 0.9,
  }),
]);

// add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});
Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
// render.mouse = mouse;

Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: width, y: height },
});

let dragging = false;

Events.on(mouseConstraint, "mousedown", (e) => {
  setTimeout(() => {
    if (dragging) return;
    Composite.add(world, [
      Bodies.circle(
        e.mouse.position.x,
        e.mouse.position.y,
        Common.random(20, 30),
        {}
      ),
    ]);
  }, 0);
});

Events.on(mouseConstraint, "startdrag", (e) => {
  dragging = true;
});
Events.on(mouseConstraint, "enddrag", (e) => {
  dragging = false;
})
