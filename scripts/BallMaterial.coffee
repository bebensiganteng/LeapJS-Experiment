define [
  'three'
], (
_t
) ->

	class BallMaterial extends THREE.ShaderMaterial

		constructor: ->
			THREE.ShaderMaterial.call this,
				vertexColors: THREE.FaceColors
				
				uniforms:
					texture: type: 't', value: null
					uVec4Array: type: "v4v", value: []

				vertexShader: """
				
					uniform sampler2D texture;
					uniform vec4 uVec4Array[10];

					varying vec3 vColor;
					varying vec2 vUv;
					varying vec3 vNormal;

			    void main() {

			    	vUv = uv;
			    	vColor = color;
			    	vNormal = normal;

			    	vec3 o = vec3(0.);

			    	for(int i = 0; i < 10; i++) {
			    		vec4 point = uVec4Array[i];
			    		
			    		if(point.w == 1.0) {
			    			float d = distance(position.xyz, point.xyz);
			    			if(d < 100.) {
			    				float s = 1. - smoothstep(0., 100., d);
			    				o = vec3(s * 100.);	
			    			}

			    			// This is not the color i want :(
			    			/*
			    			float c = distance(color.xyz, normalize(point.xyz));
			    			if(c < .5) {
			    				vColor = c * color;
			    			}
			    			*/

			    		}
			    	}

			      gl_Position = projectionMatrix * modelViewMatrix * vec4( position + normal * o, 1.0 );
			      
			    	
			    }
				"""
				fragmentShader:"""
					uniform sampler2D texture;

					varying vec3 vColor;
					varying vec2 vUv;
					varying vec3 vNormal;

					void main() {
						gl_FragColor = vec4( vColor, 1.0 );
						//gl_FragColor = texture2D(texture, vUv);
					}
				"""