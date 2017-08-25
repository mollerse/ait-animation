const {
  aitFFIUnwrapValue: unwrap,
  aitFFIWrapValue: wrap,
  aitFFI__F: aitFFIF,
  aitFFILookupVariable: lookup,
  aitFFIStoreRootVariable: store
} = require('ait-lang/ffi');

function fpsToMs(fps) {
  // We know that 60fps means 16.5ms to do all calcs
  return 60 / fps * 16.5;
}

var ANIMATIONS = '__aitAnimationAnimations';

function stopAnimations() {
  var animations = lookup(this, ANIMATIONS);
  if (!animations) {
    return;
  } else {
    animations = unwrap(animations);
    Object.keys(animations).forEach(function(t) {
      cancelAnimationFrame(animations[t]);
      delete animations[t];
    });
  }
}

function animate(fps, quote) {
  var animations = lookup(this, ANIMATIONS);

  if (!animations) {
    animations = {};
    store(this, ANIMATIONS, wrap(animations));
  } else {
    animations = unwrap(animations);
  }

  var timestamp = new Date().valueOf();
  var msThreshold = fpsToMs(unwrap(fps));

  var frame = () => {
    this.program = [...quote.body];
    this.executeProgram();
  };
  var animationId = id => (animations[timestamp] = id);

  var rafID;
  var lastFrame = 0;
  function inner(t) {
    var delta = t - lastFrame;

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

module.exports = {
  animate: aitFFIF(2, 'animate', animate),
  stopAnimations: aitFFIF(0, 'stopAnimations', stopAnimations)
};
