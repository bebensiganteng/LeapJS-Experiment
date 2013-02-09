(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['three', 'scripts/world', 'scripts/background', 'scripts/ballmesh'], function(_t, World, Background, BallMesh) {
    var App;
    App = (function() {

      function App() {
        this.render = __bind(this.render, this);

        this.initWorld = __bind(this.initWorld, this);
        this.initWorld();
        this.render();
      }

      App.prototype.initWorld = function() {
        var b;
        this.world = new World();
        this.world.scene.add(new Background().mesh);
        b = new BallMesh();
        this.world.scene.add(this.ball = b.addMesh());
        return this.world.scene.add(this.particle = b.addParticle());
      };

      App.prototype.render = function() {
        this.world.update();
        requestAnimationFrame(this.render);
        return this.particle.material.uniforms.tick.value += 0.05;
      };

      return App;

    })();
    return new App();
  });

}).call(this);
