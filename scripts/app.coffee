class App

  @vertexShader: """
    void main() {

    }

  """
  @fragmentshader: """

    void main() {

    }
    
  """
  constructor: ->
    @initWorld()
    @addDome()
    @addPolyhedron()

    @animate()
    #Leap.loop(@render)

    @count = 0

  animate: =>
    @renderer.render( @scene, @camera )
    requestAnimationFrame @animate

  initWorld: =>
    container = document.createElement('div')
    document.body.appendChild( container )

    @camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )
    @camera.position.z = 500
    @camera.lookAt(new THREE.Vector3(0,0,0))

    @scene = new THREE.Scene()
    
    pointLight = new THREE.PointLight( 0xffaa00, .5, 5000 );
    pointLight.position.set( 0, 0, 0 );
    @scene.add( pointLight );

    @renderer = new THREE.WebGLRenderer( { antialias: false, clearColor: 0x000000 } );
    @renderer.setSize( window.innerWidth, window.innerHeight )

    container.appendChild( @renderer.domElement )

    @fingers = {}

  addDome: =>
    skyGeo = new THREE.IcosahedronGeometry(1500, 1)
    skyMat = new THREE.MeshBasicMaterial
      wireframe:true
      side: THREE.BackSide
      color: new THREE.Color(0xcde2d5)

    sky = new THREE.Mesh(skyGeo, skyMat)

    @scene.add sky

  addPolyhedron: =>
    geometry = new THREE.IcosahedronGeometry(100, 4)
    material = new THREE.MeshNormalMaterial()

    @mesh = new THREE.Mesh(geometry, material)
    @scene.add @mesh

    console.log geometry

    @aPos = []
    
    for vertex in geometry.vertices
      @aPos.push vertex.clone()

	render: (frame) =>
    @renderer.render( @scene, @camera )
    
    #debug = []

    #@mesh.rotation.x += .01
    #@mesh.rotation.y += .01
    
    ###
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
    ###

    pointableID = 0
    pointableCount = frame.pointables.length

    fingerIds = {}
    handsIds = {}

    if frame.valid and frame.pointables.length == 0
      if frame.hands[0]
        ###
        theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
          phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;

          phi = Math.min( 180, Math.max( 0, phi ) );

          camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
          camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
          camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
        ###
        #@camera.position.x = Math.cos(frame.hands[0].palmPosition[0]) * 10
        @camera.lookAt(@mesh.position)
        console.log frame.hands[0].palmPosition[0]
        
    while pointableID isnt pointableCount
      pointable = frame.pointables[pointableID]
      finger = @fingers[pointable.id]
      origin = new THREE.Vector3(pointable.tipPosition[0], pointable.tipPosition[1] - 100, pointable.tipPosition[2])
      direction = new THREE.Vector3(pointable.direction[0], pointable.direction[1], pointable.direction[2])
    
      for face, i in @mesh.geometry.faces
        d = origin.distanceTo(face.centroid)
        if d < 50
          clearTimeout(@timeout)
          @timeout = setTimeout(@reset,1000);
          @modifyFace(origin,face,d)
        
          #console.log face.a
          #@mesh.geometry.vertices[face]
      
      unless finger
        finger = new THREE.ArrowHelper(direction, origin, pointable.length , Math.random() * 0xffffff)
        @fingers[pointable.id] = finger        
        @scene.add finger
      else
        finger.position = origin
        finger.setDirection direction
      finger.length = pointable.length
      fingerIds[pointable.id] = true
  
      finger = @fingers[pointable.id]
      pointableID++

    for fingerId of @fingers
      unless fingerIds[fingerId]
        @scene.remove @fingers[fingerId]
        delete @fingers[fingerId]

    @mesh.geometry.verticesNeedUpdate = true
    #document.getElementById('debugger').innerHTML = debug.join("<br>")

  modifyFace: (origin,face, d) =>
    a = face.a
    b = face.b
    c = face.c

    x = face.normal.x
    y = face.normal.y
    z = face.normal.z

    @mesh.geometry.vertices[a].x += face.normal.x * d
    @mesh.geometry.vertices[a].y += face.normal.y * d
    @mesh.geometry.vertices[a].z += face.normal.z * d
    
    @mesh.geometry.vertices[b].x += face.normal.x * d
    @mesh.geometry.vertices[b].y += face.normal.y * d
    @mesh.geometry.vertices[b].z += face.normal.z * d

    @mesh.geometry.vertices[c].x += face.normal.x * d
    @mesh.geometry.vertices[c].y += face.normal.y * d
    @mesh.geometry.vertices[c].z += face.normal.z * d

  reset: =>
    for vertex, i in @mesh.geometry.vertices
      TweenLite.to(vertex, 1, {delay: i/500, x:@aPos[i].x, y:@aPos[i].y, z:@aPos[i].z, ease:Elastic.easeOut})
    
window.onload = ->
	new App()