define [
  'three'
], (
_t
) ->
	class World
		constructor: ->
      container = document.createElement('div')
      document.body.appendChild( container )

      @camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )
      @camera.position.z = 500
      @camera.lookAt(new THREE.Vector3(0,0,0))

      @scene = new THREE.Scene()
      @renderer = new THREE.WebGLRenderer( { antialias: false, clearColor: 0x000000 } );
      @renderer.setSize( window.innerWidth, window.innerHeight )

      container.appendChild( @renderer.domElement )

    update: =>
      @renderer.render( @scene, @camera )

    rotateCamera: =>