define [
  'three'
], (
_t
) ->

	class ParticleMaterial extends THREE.ShaderMaterial

		constructor: ->
			THREE.ShaderMaterial.call this,
				blending:
					THREE.AdditiveBlending

				transparent:
					true
				
				dephTest:
					false
				
				uniforms:
					texture: type: 't', value: null
					uVec4Array: type: "v4v", value: []
					tick: type: 'f', value: 1.0

				# i should use this https://github.com/ashima/webgl-noise/wiki
				# but too lazy to copy and paste
				attributes:
					aNoise: type: 'f', value: []
					
				vertexShader: """
				
					const float SIZE = 20.;

					uniform vec4 uVec4Array[10];
					uniform float tick;

					attribute float aNoise;

			    void main() {

			    	/*
			    	for(int i = 0; i < 10; i++) {
			    		vec4 point = uVec4Array[i];
			    		
			    		if(point.w == 1.0) {
			    			float d = distance(position.xyz, point.xyz);
			    			if(d < 100.) {
			    				float s = 1. - smoothstep(0., 100., d);
			    				o = vec3(s * 100.);	
			    			}

			    		}
			    	}
			    	*/

			    	vec3 newPosition = position * vec3(sin(tick * aNoise) * .2 + 1.2);

			    	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );

			    	gl_PointSize = SIZE * ( 300.0 / length( mvPosition.xyz ) );

			    	gl_Position = projectionMatrix * mvPosition;
			    	
			    }
				"""
				fragmentShader:"""
					uniform sampler2D texture;

					void main() {

						gl_FragColor = texture2D( texture, gl_PointCoord );
					
					}
				"""