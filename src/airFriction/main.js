function main() {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite;

  // create an engine
  var engine = Engine.create();
  var world = engine.world;

  // create a renderer
  var render = Render.create({
    element: document.body,
    engine,
    options: {
      width: 800,
      height: 600,
      background: "white",
      pixelRatio: window.devicePixelRatio,

      // showVelocity: true, // 显示速度
      // showAxes: true, // 显示坐标轴
      // showBounds: true,
      // showCollisions: true,  // 显示碰撞
    },
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  Composite.add(world, [
    // falling block
    Bodies.rectangle(200, 100, 60, 60, { frictionAir: 0.001 }), // 空气阻力 0.001
    Bodies.rectangle(400, 100, 60, 60, { frictionAir: 0.05 }), // 空气阻力 0.05
    Bodies.rectangle(600, 100, 60, 60, { frictionAir: 0.1 }), // 空气阻力 0.1

    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
  ]);

  // add mouse controll
  var mouse = Mouse.create(render.canvas);
  var mouseConstraint = MouseConstraint.create(engine, {
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
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 },
  });
}

main();
