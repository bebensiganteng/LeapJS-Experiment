(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['three', 'scripts/world', 'scripts/background', 'scripts/ballmesh', 'vendor/leap'], function(_t, World, Background, BallMesh, Leap) {
    var App;
    App = (function() {

      function App() {
        this.renderLeap = __bind(this.renderLeap, this);

        this.render = __bind(this.render, this);

        this.mousedown = __bind(this.mousedown, this);

        this.initWorld = __bind(this.initWorld, this);
        this.initWorld();
        window.Leap.loop(this.renderLeap);
        document.addEventListener('keydown', this.mousedown, false);
      }

      App.prototype.initWorld = function() {
        this.world = new World();
        this.world.scene.add(new Background().mesh);
        this.world.resetWorld();
        this.ballMesh = new BallMesh();
        this.world.scene.add(this.ball = this.ballMesh.addMesh());
        return this.world.scene.add(this.particle = this.ballMesh.addParticle());
      };

      App.prototype.mousedown = function(event) {
        console.log(event);
        this.ballMesh.resetMesh();
        return this.world.resetWorld();
      };

      App.prototype.render = function() {
        this.world.update();
        requestAnimationFrame(this.render);
        return this.ballMesh.update();
      };

      App.prototype.renderLeap = function(frame) {
        this.world.update();
        if (frame.valid) {
          /*
                  for vertex in @ball.material.uniforms.uVec4Array.value
                    vertex.w = 0
          */

          if (frame.pointables.length > 0) {
            this.ballMesh.modify(frame);
            this.world.resetWorld();
          } else {
            if (frame.hands[0]) {
              this.world.updateCamera(frame.hands[0].palmPosition);
            }
          }
        }
        this.world.controls.update();
        return this.ballMesh.update();
      };

      return App;

    })();
    return new App();
  });

}).call(this);
