const { aitFFIUnwrapValue: unwrap, aitFFI__F } = require('ait-lang/ffi');

function fpsToMs(fps) {
  // We know that 60fps means 16.5ms to do all calcs
  return 60 / fps * 16.5;
}

function rAF(fps, quote) {
  const timestamp = new Date().valueOf();
  const msThreshold = fpsToMs(unwrap(fps));

  const frame = () => {
    this.program = [...quote.body];
    this.executeProgram();
  };
  const animationId = id => this.addAnimation(timestamp, id);

  let rafID;
  let lastFrame = 0;
  function inner(t) {
    const delta = t - lastFrame;

    rafID = requestAnimationFrame(inner);
    animationId(rafID);

    if (lastFrame && delta < msThreshold) {
      return;
    }

    frame();

    lastFrame = t;
  }

  rafID = requestAnimationFrame(inner);
  animationId(rafID);
}

module.exports = { rAF: aitFFI__F(2, 'rAF', rAF) };
