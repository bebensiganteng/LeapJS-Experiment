define [
  'three'
  'scripts/world'
  'scripts/background'
  'scripts/ballmesh'
  'vendor/leap'
], (
_t
World
Background
BallMesh
Leap
) ->

  class App

    constructor: ->
      @initWorld()
      window.Leap.loop(@renderLeap)
      #@render()

      document.addEventListener( 'keydown', @mousedown, false );

    initWorld: =>
      @world = new World()
      @world.scene.add new Background().mesh
      @world.resetWorld()

      @ballMesh = new BallMesh()
      @world.scene.add @ball = @ballMesh.addMesh()
      @world.scene.add @particle = @ballMesh.addParticle()

    mousedown: (event) =>
      console.log event
      @ballMesh.resetMesh()
      @world.resetWorld()
      
    render: =>
      @world.update()
      requestAnimationFrame @render

      @ballMesh.update()
      #@ball.rotation.x = @ball.rotation.y = Date.now() * 0.0005;

    renderLeap: (frame) =>
      @world.update()

      if frame.valid
        ###
        for vertex in @ball.material.uniforms.uVec4Array.value
          vertex.w = 0
        ###

        if frame.pointables.length > 0
          @ballMesh.modify(frame)
          @world.resetWorld()
        else
          if frame.hands[0]
            @world.updateCamera(frame.hands[0].palmPosition)

      @world.controls.update()
      @ballMesh.update()
    
  new App()