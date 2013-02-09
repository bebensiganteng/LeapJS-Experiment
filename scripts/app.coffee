define [
  'three'
  'scripts/world'
  'scripts/background'
  'scripts/ballmesh'
], (
_t
World
Background
BallMesh
) ->

  class App
    constructor: ->
      @initWorld()
      @render()

    initWorld: =>
      @world = new World()
      @world.scene.add new Background().mesh

      b = new BallMesh()
      @world.scene.add @ball = b.addMesh()
      @world.scene.add @particle = b.addParticle()
      
    render: =>
      @world.update()
      requestAnimationFrame @render

      #@ball.rotation.x = @ball.rotation.y = Date.now() * 0.0005;

      @particle.material.uniforms.tick.value += 0.05

    
  new App()