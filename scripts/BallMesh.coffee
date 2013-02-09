define [
  'three'
  'scripts/ballmaterial'
  'scripts/particlematerial'
], (
_t
BallMaterial
ParticleMaterial
) ->
	
	class BallMesh

    addMesh: =>
      geometry = new THREE.IcosahedronGeometry(100, 2)

      for face, i in geometry.faces
        n = i/geometry.faces.length
        v = face.centroid.clone().normalize()
        face.color = new THREE.Color()
        face.color.r = v.x
        face.color.g = v.y
        face.color.b = v.z

      ###
      material = new THREE.MeshBasicMaterial
        vertexColors: true 
        map: new THREE.ImageUtils.loadTexture( "images/large.jpeg" )
      ###
      material = new BallMaterial()
      material.uniforms.value = new THREE.ImageUtils.loadTexture( "images/large.jpeg" )
      for i in [0..10]
        if i == 0
          material.uniforms.uVec4Array.value.push new THREE.Vector4(100,100,100,1)
        material.uniforms.uVec4Array.value.push new THREE.Vector4(0,0,0,0)


      @mesh = new THREE.Mesh geometry, material  

    addParticle: =>
      material = new ParticleMaterial()
      material.uniforms.texture.value = new THREE.ImageUtils.loadTexture( "images/spark.png" )

      geometry = new THREE.Geometry()

      
      for vertex, i in @mesh.geometry.vertices
        geometry.vertices.push vertex.clone()
        material.attributes.aNoise.value[i] = Math.random()

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



