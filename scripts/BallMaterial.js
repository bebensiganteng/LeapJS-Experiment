(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['three'], function(_t) {
    var BallMaterial;
    return BallMaterial = (function(_super) {

      __extends(BallMaterial, _super);

      function BallMaterial() {
        THREE.ShaderMaterial.call(this, {
          vertexColors: THREE.FaceColors,
          uniforms: {
            texture: {
              type: 't',
              value: null
            },
            uVec4Array: {
              type: "v4v",
              value: []
            }
          },
          attributes: {
            aPosition: {
              type: 'v3',
              value: []
            }
          },
          vertexShader: "\n	uniform sampler2D texture;\n	uniform vec4 uVec4Array[20];\n\n	varying vec3 vColor;\n	varying vec2 vUv;\n	varying vec3 vNormal;\n\n	attribute vec3 aPosition;\n\n			    void main() {\n\n			    	vUv = uv;\n			    	vColor = color;\n			    	vNormal = normal;\n\n			    	vec3 o = vec3(0.);\n\n			    	for(int i = 0; i < 20; i++) {\n			    		vec4 point = uVec4Array[i];\n			    		\n			    		if(point.w == 1.0) {\n			    			float d = distance(position.xyz, point.xyz);\n			    			if(d < 100.) {\n			    				float s = 1. - smoothstep(0., 100., d);\n			    				o = vec3(s * 100.);	\n			    			}\n\n			    			// This is not the color i want :(\n			    			/*\n			    			float c = distance(color.xyz, normalize(point.xyz));\n			    			if(c < .5) {\n			    				vColor = c * color;\n			    			}\n			    			*/\n\n			    		}\n			    	}\n\n			     	gl_Position = projectionMatrix * modelViewMatrix * vec4( position + normal * o, 1.0 );\n			      //gl_Position = projectionMatrix * modelViewMatrix * vec4( position + normal, 1.0 );\n			      \n			    	\n			    }",
          fragmentShader: "uniform sampler2D texture;\n\nvarying vec3 vColor;\nvarying vec2 vUv;\nvarying vec3 vNormal;\n\n// LIGHTS\nconst vec3 LIGHT_COLOR = vec3( 233./255., 22./225., 91./255. );\nconst vec3 LIGHT_DIR = vec3( 0.0, 1.0, 1.0 );\nconst float INTENSITY = 1.;\n\nvoid main() {\n\n	\n	float diffuse = INTENSITY * max( dot( vNormal, LIGHT_DIR ), 0.5 );\n\n	//gl_FragColor = vec4( vColor * LIGHT_COLOR * diffuse, 1.0 );\n	//gl_FragColor = texture2D(texture, vUv);\n	gl_FragColor = vec4( vColor, 1.0 );\n\n}"
        });
      }

      return BallMaterial;

    })(THREE.ShaderMaterial);
  });

}).call(this);
