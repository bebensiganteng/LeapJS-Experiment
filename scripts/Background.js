(function() {

  define(['three'], function(_t) {
    var Background;
    return Background = (function() {

      function Background() {
        var geometry, material;
        geometry = new THREE.IcosahedronGeometry(1500, 1);
        material = new THREE.MeshBasicMaterial({
          wireframe: true,
          side: THREE.BackSide,
          color: new THREE.Color(0xcde2d5)
        });
        this.mesh = new THREE.Mesh(geometry, material);
      }

      return Background;

    })();
  });

}).call(this);
