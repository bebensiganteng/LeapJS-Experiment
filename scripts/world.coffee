define [
  'three'
  'vendor/TrackballControls'
  'vendor/TweenLite.min'
  'vendor/easing/EasePack.min'
], (
_t
TrackballControls
Tweenlite
EasePack
) ->
	class World

		constructor: ->
      @reset = false
      @init()

    init: =>
      container = document.createElement('div')
      document.body.appendChild( container )

      @camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )
      @camera.position.z = @radius = 500
      @camera.lookAt(new THREE.Vector3(0,0,0))

      @controls = new THREE.TrackballControls(@camera)
      
      @scene = new THREE.Scene()
      @renderer = new THREE.WebGLRenderer( { antialias: false, clearColor: 0x000000 } );
      @renderer.setSize( window.innerWidth, window.innerHeight )

      container.appendChild( @renderer.domElement )

    update: =>
      @renderer.render( @scene, @camera )

    resetWorld: =>
      ###
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
      ###
      @point1 = null
      @point2 = null


    updateCamera: (point) =>

      ###
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

      ###