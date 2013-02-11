(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['three', 'vendor/TrackballControls', 'vendor/TweenLite.min', 'vendor/easing/EasePack.min'], function(_t, TrackballControls, Tweenlite, EasePack) {
    var World;
    return World = (function() {

      function World() {
        this.updateCamera = __bind(this.updateCamera, this);

        this.resetWorld = __bind(this.resetWorld, this);

        this.update = __bind(this.update, this);

        this.init = __bind(this.init, this);
        this.reset = false;
        this.init();
      }

      World.prototype.init = function() {
        var container;
        container = document.createElement('div');
        document.body.appendChild(container);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.z = this.radius = 500;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.controls = new THREE.TrackballControls(this.camera);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
          antialias: false,
          clearColor: 0x000000
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        return container.appendChild(this.renderer.domElement);
      };

      World.prototype.update = function() {
        return this.renderer.render(this.scene, this.camera);
      };

      World.prototype.resetWorld = function() {
        /*
              scope = @
              @reset = true
              TweenLite.to(@camera.position, 1, 
                x:0
                y:0
                z:500
                ease:Power4.easeInOut
                onComplete: ->
                  scope.reset = false
              )
        */
        this.point1 = null;
        return this.point2 = null;
      };

      World.prototype.updateCamera = function(point) {
        /*
              if !@reset
                if @point1 == null 
                  @point1 = point[0]
                  @point2 = point[1] - 100
        
                theta = - ( point[0] * 2 ) + 45
                phi = ((point[1] - 100) * 2) + 60
                phi = Math.min( 180, Math.max( 0, phi ) );
                @camera.position.x = @radius * Math.sin(theta * Math.PI / 360) * Math.cos( phi * Math.PI / 360 )
                @camera.position.y = @radius * Math.sin(phi * Math.PI / 360)
                @camera.position.z = @radius * Math.cos(theta * Math.PI / 360) * Math.cos( phi * Math.PI / 360 )
              
              @camera.lookAt(new THREE.Vector3(0,0,0))
        */

      };

      return World;

    })();
  });

}).call(this);
