(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    _this = this;

  App = (function() {

    App.vertexShader = "void main() {\n\n}\n";

    App.fragmentshader = "\nvoid main() {\n\n}\n";

    function App() {
      this.addPolyhedron = __bind(this.addPolyhedron, this);

      this.addDome = __bind(this.addDome, this);

      this.initWorld = __bind(this.initWorld, this);

      this.animate = __bind(this.animate, this);
      this.initWorld();
      this.addDome();
      this.addPolyhedron();
      this.animate();
      this.count = 0;
    }

    App.prototype.animate = function() {
      this.renderer.render(this.scene, this.camera);
      return requestAnimationFrame(this.animate);
    };

    App.prototype.initWorld = function() {
      var container, pointLight;
      container = document.createElement('div');
      document.body.appendChild(container);
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
      this.camera.position.z = 500;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene = new THREE.Scene();
      pointLight = new THREE.PointLight(0xffaa00, .5, 5000);
      pointLight.position.set(0, 0, 0);
      this.scene.add(pointLight);
      this.renderer = new THREE.WebGLRenderer({
        antialias: false,
        clearColor: 0x000000
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);
      return this.fingers = {};
    };

    App.prototype.addDome = function() {
      var sky, skyGeo, skyMat;
      skyGeo = new THREE.IcosahedronGeometry(1500, 1);
      skyMat = new THREE.MeshBasicMaterial({
        wireframe: true,
        side: THREE.BackSide,
        color: new THREE.Color(0xcde2d5)
      });
      sky = new THREE.Mesh(skyGeo, skyMat);
      return this.scene.add(sky);
    };

    App.prototype.addPolyhedron = function() {
      var geometry, material, vertex, _i, _len, _ref, _results;
      geometry = new THREE.IcosahedronGeometry(100, 4);
      material = new THREE.MeshNormalMaterial();
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
      console.log(geometry);
      this.aPos = [];
      _ref = geometry.vertices;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        vertex = _ref[_i];
        _results.push(this.aPos.push(vertex.clone()));
      }
      return _results;
    };

    return App;

  })();

  ({
    render: function(frame) {
      var d, direction, face, finger, fingerId, fingerIds, handsIds, i, origin, pointable, pointableCount, pointableID, _i, _len, _ref;
      _this.renderer.render(_this.scene, _this.camera);
      /*
          if frame.pointables.length > 0 and not @log
            #@log = true
            debug = []
            for key of frame
              if frame.hasOwnProperty(key)
                sub_frame = frame[key]
                if sub_frame.length > 0
                  for key of sub_frame
                    debug.push("<p>SUBFRAME::" + key + " -> " + sub_frame[key] + "</p>")
                else
                  debug.push("<p>FRAME::" + key + " -> " + frame[key] + "</p>")
            debug.push("<p>FRAME::" + frame.pointables + "</p>")
          
      
          for point in frame.pointables
            debug.push("<p>point::" + point + "</p>")
            origin = new THREE.Vector3(point.tipPosition[0], point.tipPosition[1], -point.tipPosition[2])
            direction = new THREE.Vector3(point.direction[0], point.direction[1], -point.direction[2])
            
            finger = new THREE.ArrowHelper(direction, origin, point.length, Math.random() * 0xffffff)
            finger.name = point.id
      */

      pointableID = 0;
      pointableCount = frame.pointables.length;
      fingerIds = {};
      handsIds = {};
      if (frame.valid && frame.pointables.length === 0) {
        if (frame.hands[0]) {
          /*
                  theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
                    phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
          
                    phi = Math.min( 180, Math.max( 0, phi ) );
          
                    camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
                    camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
                    camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
          */

          _this.camera.lookAt(_this.mesh.position);
          console.log(frame.hands[0].palmPosition[0]);
        }
      }
      while (pointableID !== pointableCount) {
        pointable = frame.pointables[pointableID];
        finger = _this.fingers[pointable.id];
        origin = new THREE.Vector3(pointable.tipPosition[0], pointable.tipPosition[1] - 100, pointable.tipPosition[2]);
        direction = new THREE.Vector3(pointable.direction[0], pointable.direction[1], pointable.direction[2]);
        _ref = _this.mesh.geometry.faces;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          face = _ref[i];
          d = origin.distanceTo(face.centroid);
          if (d < 50) {
            clearTimeout(_this.timeout);
            _this.timeout = setTimeout(_this.reset, 1000);
            _this.modifyFace(origin, face, d);
          }
        }
        if (!finger) {
          finger = new THREE.ArrowHelper(direction, origin, pointable.length, Math.random() * 0xffffff);
          _this.fingers[pointable.id] = finger;
          _this.scene.add(finger);
        } else {
          finger.position = origin;
          finger.setDirection(direction);
        }
        finger.length = pointable.length;
        fingerIds[pointable.id] = true;
        finger = _this.fingers[pointable.id];
        pointableID++;
      }
      for (fingerId in _this.fingers) {
        if (!fingerIds[fingerId]) {
          _this.scene.remove(_this.fingers[fingerId]);
          delete _this.fingers[fingerId];
        }
      }
      return _this.mesh.geometry.verticesNeedUpdate = true;
    },
    modifyFace: function(origin, face, d) {
      var a, b, c, x, y, z;
      a = face.a;
      b = face.b;
      c = face.c;
      x = face.normal.x;
      y = face.normal.y;
      z = face.normal.z;
      _this.mesh.geometry.vertices[a].x += face.normal.x * d;
      _this.mesh.geometry.vertices[a].y += face.normal.y * d;
      _this.mesh.geometry.vertices[a].z += face.normal.z * d;
      _this.mesh.geometry.vertices[b].x += face.normal.x * d;
      _this.mesh.geometry.vertices[b].y += face.normal.y * d;
      _this.mesh.geometry.vertices[b].z += face.normal.z * d;
      _this.mesh.geometry.vertices[c].x += face.normal.x * d;
      _this.mesh.geometry.vertices[c].y += face.normal.y * d;
      return _this.mesh.geometry.vertices[c].z += face.normal.z * d;
    },
    reset: function() {
      var i, vertex, _i, _len, _ref, _results;
      _ref = _this.mesh.geometry.vertices;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        vertex = _ref[i];
        _results.push(TweenLite.to(vertex, 1, {
          delay: i / 500,
          x: _this.aPos[i].x,
          y: _this.aPos[i].y,
          z: _this.aPos[i].z,
          ease: Elastic.easeOut
        }));
      }
      return _results;
    }
  });

  window.onload = function() {
    return new App();
  };

}).call(this);
