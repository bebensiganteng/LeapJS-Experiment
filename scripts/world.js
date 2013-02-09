(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['three'], function(_t) {
    var World;
    return World = (function() {

      function World() {
        this.rotateCamera = __bind(this.rotateCamera, this);

        this.update = __bind(this.update, this);

        var container;
        container = document.createElement('div');
        document.body.appendChild(container);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.z = 500;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
          antialias: false,
          clearColor: 0x000000
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);
      }

      World.prototype.update = function() {
        return this.renderer.render(this.scene, this.camera);
      };

      World.prototype.rotateCamera = function() {};

      return World;

    })();
  });

}).call(this);
