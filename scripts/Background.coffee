define [
  'three'
], (
_t
) ->
	
	class Background
		constructor: ->
			geometry = new THREE.IcosahedronGeometry(1500, 1)
			material = new THREE.MeshBasicMaterial
				wireframe: true
				side: THREE.BackSide
				color: new THREE.Color 0xcde2d5

			@mesh = new THREE.Mesh geometry, material

