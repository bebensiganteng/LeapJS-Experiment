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

				attributes:
					aPosition: type: 'v3', value: []

				vertexShader: """
				
					uniform sampler2D texture;
					uniform vec4 uVec4Array[20];

					varying vec3 vColor;
					varying vec2 vUv;
					varying vec3 vNormal;

					attribute vec3 aPosition;

			    void main() {

			    	vUv = uv;
			    	vColor = color;
			    	vNormal = normal;

			    	vec3 o = vec3(0.);

			    	for(int i = 0; i < 20; i++) {
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
			      //gl_Position = projectionMatrix * modelViewMatrix * vec4( position + normal, 1.0 );
			      
			    	
			    }
				"""
				fragmentShader:"""
					uniform sampler2D texture;

					varying vec3 vColor;
					varying vec2 vUv;
					varying vec3 vNormal;

					// LIGHTS
					const vec3 LIGHT_COLOR = vec3( 233./255., 22./225., 91./255. );
					const vec3 LIGHT_DIR = vec3( 0.0, 1.0, 1.0 );
					const float INTENSITY = 1.;

					void main() {

						
						float diffuse = INTENSITY * max( dot( vNormal, LIGHT_DIR ), 0.5 );

						//gl_FragColor = vec4( vColor * LIGHT_COLOR * diffuse, 1.0 );
						//gl_FragColor = texture2D(texture, vUv);
						gl_FragColor = vec4( vColor, 1.0 );

					}
				"""