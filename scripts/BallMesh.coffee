define [
  'three'
  'scripts/ballmaterial'
  'scripts/particlematerial'
  'vendor/TweenLite.min'
  'vendor/easing/EasePack.min'
], (
_t
BallMaterial
ParticleMaterial
Tweenlite
EasePack
) ->
	
	class BallMesh

    constructor: ->
      #not the best solution
      @reset = false

    addMesh: =>
      ###
      material = new THREE.MeshBasicMaterial
        vertexColors: true 
        map: new THREE.ImageUtils.loadTexture( "images/large.jpeg" )
      ###
      material = new BallMaterial()
      material.uniforms.value = new THREE.ImageUtils.loadTexture( "images/large.jpeg" )
      for i in [0..20]
        material.uniforms.uVec4Array.value.push new THREE.Vector4(0,0,0,0)

      geometry = new THREE.IcosahedronGeometry(100, 2)

      for face, i in geometry.faces
        n = i/geometry.faces.length
        v = face.centroid.clone().normalize()
        face.color = new THREE.Color()
        face.color.r = v.x
        face.color.g = v.y
        face.color.b = v.z
        material.attributes.aPosition.value[face.a] = geometry.vertices[face.a].clone()
        material.attributes.aPosition.value[face.b] = geometry.vertices[face.b].clone()
        material.attributes.aPosition.value[face.c] = geometry.vertices[face.c].clone()

      @mesh = new THREE.Mesh geometry, material  

    addParticle: =>
      material = new ParticleMaterial()
      material.uniforms.texture.value = new THREE.ImageUtils.loadTexture( "images/spark.png" )

      geometry = new THREE.Geometry()

      for vertex, i in @mesh.geometry.vertices
        v = vertex.clone()
        geometry.vertices.push v
        material.attributes.aNoise.value.push Math.random() + .5
        
      material.attributes.aPosition.value = @mesh.geometry.vertices.slice(0)
       
      ### 
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
      ###

      @particle = new THREE.ParticleSystem geometry, material
      @particle.dynamic = true

      return @particle

    modifyFace: (face,d, normal) =>
      a = face.a
      b = face.b
      c = face.c
      #o = 0.01 * face.normal.dot(normal)
      o = 0.004


      x = face.normal.x
      y = face.normal.y
      z = face.normal.z

      @mesh.geometry.vertices[a].x += x * d * o
      @mesh.geometry.vertices[a].y += y * d * o
      @mesh.geometry.vertices[a].z += z * d * o
      
      @mesh.geometry.vertices[b].x += x * d * o
      @mesh.geometry.vertices[b].y += y * d * o
      @mesh.geometry.vertices[b].z += z * d * o

      @mesh.geometry.vertices[c].x += x * d * o
      @mesh.geometry.vertices[c].y += y * d * o
      @mesh.geometry.vertices[c].z += z * d * o

    resetMesh: =>
      scope = @
      @reset = true

      for vertex, i in @mesh.geometry.vertices
        pos = @mesh.material.attributes.aPosition.value[i]
        TweenLite.to(vertex, 1, 
          delay: i/500
          x:pos.x
          y:pos.y
          z:pos.z
          ease:Elastic.easeOut
          onComplete: ->
            scope.reset = false
        )

    #-------

    modify: (frame) =>

      if !@reset

        
        for vertex in @mesh.material.uniforms.uVec4Array.value
          vertex.w = 0

        for key of frame.pointables
          if frame.pointables.hasOwnProperty(key)
            # SHADER
            @mesh.material.uniforms.uVec4Array.value[key].x = frame.pointables[key].tipPosition[0]
            @mesh.material.uniforms.uVec4Array.value[key].y = frame.pointables[key].tipPosition[1] - 100
            @mesh.material.uniforms.uVec4Array.value[key].z = frame.pointables[key].tipPosition[2]
            @mesh.material.uniforms.uVec4Array.value[key].w = 1
         

            # JS
            ###
            point = new THREE.Vector3(frame.pointables[key].tipPosition[0], frame.pointables[key].tipPosition[1] - 100, frame.pointables[key].tipPosition[2] + 100)
            normal = new THREE.Vector3(frame.pointables[key].direction[0], frame.pointables[key].direction[1], frame.pointables[key].direction[2])
                
            for face, i in @mesh.geometry.faces
              d = point.distanceTo(face.centroid)
              if d < 50
                @modifyFace(face,d, normal)
            ###
          

    update: =>
      @particle.material.uniforms.tick.value += 0.08

      @particle.material.attributes.aPosition.value = @mesh.geometry.vertices

      @particle.material.attributes.aPosition.needsUpdate = true
      @mesh.material.attributes.aPosition.needsUpdate = true
      @mesh.geometry.verticesNeedUpdate = true



