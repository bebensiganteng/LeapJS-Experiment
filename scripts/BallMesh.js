(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['three', 'scripts/ballmaterial', 'scripts/particlematerial', 'vendor/TweenLite.min', 'vendor/easing/EasePack.min'], function(_t, BallMaterial, ParticleMaterial, Tweenlite, EasePack) {
    var BallMesh;
    return BallMesh = (function() {

      function BallMesh() {
        this.update = __bind(this.update, this);

        this.modify = __bind(this.modify, this);

        this.resetMesh = __bind(this.resetMesh, this);

        this.modifyFace = __bind(this.modifyFace, this);

        this.addParticle = __bind(this.addParticle, this);

        this.addMesh = __bind(this.addMesh, this);
        this.reset = false;
      }

      BallMesh.prototype.addMesh = function() {
        /*
              material = new THREE.MeshBasicMaterial
                vertexColors: true 
                map: new THREE.ImageUtils.loadTexture( "images/large.jpeg" )
        */

        var face, geometry, i, material, n, v, _i, _j, _len, _ref;
        material = new BallMaterial();
        material.uniforms.value = new THREE.ImageUtils.loadTexture("images/large.jpeg");
        for (i = _i = 0; _i <= 20; i = ++_i) {
          material.uniforms.uVec4Array.value.push(new THREE.Vector4(0, 0, 0, 0));
        }
        geometry = new THREE.IcosahedronGeometry(100, 2);
        _ref = geometry.faces;
        for (i = _j = 0, _len = _ref.length; _j < _len; i = ++_j) {
          face = _ref[i];
          n = i / geometry.faces.length;
          v = face.centroid.clone().normalize();
          face.color = new THREE.Color();
          face.color.r = v.x;
          face.color.g = v.y;
          face.color.b = v.z;
          material.attributes.aPosition.value[face.a] = geometry.vertices[face.a].clone();
          material.attributes.aPosition.value[face.b] = geometry.vertices[face.b].clone();
          material.attributes.aPosition.value[face.c] = geometry.vertices[face.c].clone();
        }
        return this.mesh = new THREE.Mesh(geometry, material);
      };

      BallMesh.prototype.addParticle = function() {
        var geometry, i, material, v, vertex, _i, _len, _ref;
        material = new ParticleMaterial();
        material.uniforms.texture.value = new THREE.ImageUtils.loadTexture("images/spark.png");
        geometry = new THREE.Geometry();
        _ref = this.mesh.geometry.vertices;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          vertex = _ref[i];
          v = vertex.clone();
          geometry.vertices.push(v);
          material.attributes.aNoise.value.push(Math.random() + .5);
        }
        material.attributes.aPosition.value = this.mesh.geometry.vertices.slice(0);
        /* 
        for face in @mesh.geometry.faces
          va = @mesh.geometry.vertices[face.a]
          vb = @mesh.geometry.vertices[face.b]
          vc = @mesh.geometry.vertices[face.c]
          geometry.vertices[face.a] = va.clone()
          geometry.vertices[face.b] = vb.clone()
          geometry.vertices[face.c] = vc.clone()
          
          material.attributes.aNormal.value[face.a] = Mat
          material.attributes.aNormal.value[face.b] = face.normal
          material.attributes.aNormal.value[face.c] = face.normal
        
        material = new THREE.ParticleBasicMaterial
          color: 0xffffff
          size: 20
          map: new THREE.ImageUtils.loadTexture( "images/spark.png" )
        */

        this.particle = new THREE.ParticleSystem(geometry, material);
        this.particle.dynamic = true;
        return this.particle;
      };

      BallMesh.prototype.modifyFace = function(face, d, normal) {
        var a, b, c, o, x, y, z;
        a = face.a;
        b = face.b;
        c = face.c;
        o = 0.004;
        x = face.normal.x;
        y = face.normal.y;
        z = face.normal.z;
        this.mesh.geometry.vertices[a].x += x * d * o;
        this.mesh.geometry.vertices[a].y += y * d * o;
        this.mesh.geometry.vertices[a].z += z * d * o;
        this.mesh.geometry.vertices[b].x += x * d * o;
        this.mesh.geometry.vertices[b].y += y * d * o;
        this.mesh.geometry.vertices[b].z += z * d * o;
        this.mesh.geometry.vertices[c].x += x * d * o;
        this.mesh.geometry.vertices[c].y += y * d * o;
        return this.mesh.geometry.vertices[c].z += z * d * o;
      };

      BallMesh.prototype.resetMesh = function() {
        var i, pos, scope, vertex, _i, _len, _ref, _results;
        scope = this;
        this.reset = true;
        _ref = this.mesh.geometry.vertices;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          vertex = _ref[i];
          pos = this.mesh.material.attributes.aPosition.value[i];
          _results.push(TweenLite.to(vertex, 1, {
            delay: i / 500,
            x: pos.x,
            y: pos.y,
            z: pos.z,
            ease: Elastic.easeOut,
            onComplete: function() {
              return scope.reset = false;
            }
          }));
        }
        return _results;
      };

      BallMesh.prototype.modify = function(frame) {
        var key, vertex, _i, _len, _ref, _results;
        if (!this.reset) {
          _ref = this.mesh.material.uniforms.uVec4Array.value;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            vertex = _ref[_i];
            vertex.w = 0;
          }
          _results = [];
          for (key in frame.pointables) {
            if (frame.pointables.hasOwnProperty(key)) {
              this.mesh.material.uniforms.uVec4Array.value[key].x = frame.pointables[key].tipPosition[0];
              this.mesh.material.uniforms.uVec4Array.value[key].y = frame.pointables[key].tipPosition[1] - 100;
              this.mesh.material.uniforms.uVec4Array.value[key].z = frame.pointables[key].tipPosition[2];
              _results.push(this.mesh.material.uniforms.uVec4Array.value[key].w = 1);
              /*
                          point = new THREE.Vector3(frame.pointables[key].tipPosition[0], frame.pointables[key].tipPosition[1] - 100, frame.pointables[key].tipPosition[2] + 100)
                          normal = new THREE.Vector3(frame.pointables[key].direction[0], frame.pointables[key].direction[1], frame.pointables[key].direction[2])
                              
                          for face, i in @mesh.geometry.faces
                            d = point.distanceTo(face.centroid)
                            if d < 50
                              @modifyFace(face,d, normal)
              */

            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      };

      BallMesh.prototype.update = function() {
        this.particle.material.uniforms.tick.value += 0.08;
        this.particle.material.attributes.aPosition.value = this.mesh.geometry.vertices;
        this.particle.material.attributes.aPosition.needsUpdate = true;
        this.mesh.material.attributes.aPosition.needsUpdate = true;
        return this.mesh.geometry.verticesNeedUpdate = true;
      };

      return BallMesh;

    })();
  });

}).call(this);
