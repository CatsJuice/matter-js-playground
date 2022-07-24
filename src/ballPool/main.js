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

// create engine
var engine = Engine.create();
var world = engine.world;

// create renderer
var render = Render.create({
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
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
Composite.add(world, [
  Bodies.rectangle(width / 2, height + 25, 1200, 50, {
    isStatic: true,
    render: { fillStyle: "#E5E7E9" },
  }),
]);

var stack = Composites.stack(100, 0, 10, 8, 10, 10, (x, y) => {
  return Bodies.circle(x, y, Common.random(15, 30), {
    restitution: 0.6,
    friction: 0.1,
  });
});

Composite.add(world, [
  stack,
  Bodies.polygon(200, 460, 3, 60),
  Bodies.polygon(400, 460, 5, 60),
  Bodies.rectangle(600, 460, 80, 80),
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
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: width, y: height },
});


// wrapping using matter-wrap plugin
var allBodies = Composite.allBodies(world);
for (var i = 0; i < allBodies.length; i++) {
  allBodies[i].plugin.wrap = {
    min: { x: render.bounds.min.x, y: render.bounds.min.y },
    max: { x: render.bounds.max.x, y: render.bounds.max.y },
  }
}