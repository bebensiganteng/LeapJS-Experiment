(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['three', 'scripts/ballmaterial', 'scripts/particlematerial'], function(_t, BallMaterial, ParticleMaterial) {
    var BallMesh;
    return BallMesh = (function() {

      function BallMesh() {
        this.addParticle = __bind(this.addParticle, this);

        this.addMesh = __bind(this.addMesh, this);

      }

      BallMesh.prototype.addMesh = function() {
        var face, geometry, i, material, n, v, _i, _j, _len, _ref;
        geometry = new THREE.IcosahedronGeometry(100, 2);
        _ref = geometry.faces;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          face = _ref[i];
          n = i / geometry.faces.length;
          v = face.centroid.clone().normalize();
          face.color = new THREE.Color();
          face.color.r = v.x;
          face.color.g = v.y;
          face.color.b = v.z;
        }
        /*
              material = new THREE.MeshBasicMaterial
                vertexColors: true 
                map: new THREE.ImageUtils.loadTexture( "images/large.jpeg" )
        */

        material = new BallMaterial();
        material.uniforms.value = new THREE.ImageUtils.loadTexture("images/large.jpeg");
        for (i = _j = 0; _j <= 10; i = ++_j) {
          if (i === 0) {
            material.uniforms.uVec4Array.value.push(new THREE.Vector4(100, 100, 100, 1));
          }
          material.uniforms.uVec4Array.value.push(new THREE.Vector4(0, 0, 0, 0));
        }
        return this.mesh = new THREE.Mesh(geometry, material);
      };

      BallMesh.prototype.addParticle = function() {
        var geometry, i, material, vertex, _i, _len, _ref;
        material = new ParticleMaterial();
        material.uniforms.texture.value = new THREE.ImageUtils.loadTexture("images/spark.png");
        geometry = new THREE.Geometry();
        _ref = this.mesh.geometry.vertices;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          vertex = _ref[i];
          geometry.vertices.push(vertex.clone());
          material.attributes.aNoise.value[i] = Math.random();
        }
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

      return BallMesh;

    })();
  });

}).call(this);
