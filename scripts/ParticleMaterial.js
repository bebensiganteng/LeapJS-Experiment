(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['three'], function(_t) {
    var ParticleMaterial;
    return ParticleMaterial = (function(_super) {

      __extends(ParticleMaterial, _super);

      function ParticleMaterial() {
        THREE.ShaderMaterial.call(this, {
          blending: THREE.AdditiveBlending,
          transparent: true,
          dephTest: false,
          uniforms: {
            texture: {
              type: 't',
              value: null
            },
            uVec4Array: {
              type: "v4v",
              value: []
            },
            tick: {
              type: 'f',
              value: 1.0
            }
          },
          attributes: {
            aNoise: {
              type: 'f',
              value: []
            },
            aPosition: {
              type: 'v3',
              value: []
            }
          },
          vertexShader: "\n	const float SIZE = 20.;\n\n	uniform vec4 uVec4Array[10];\n	uniform float tick;\n\n	attribute float aNoise;\n	attribute vec3 aPosition;\n\n			    void main() {\n\n			    	/*\n			    	for(int i = 0; i < 10; i++) {\n			    		vec4 point = uVec4Array[i];\n			    		\n			    		if(point.w == 1.0) {\n			    			float d = distance(aPosition.xyz, point.xyz);\n			    			if(d < 100.) {\n			    				float s = 1. - smoothstep(0., 100., d);\n			    				o = vec3(s * 100.);	\n			    			}\n\n			    		}\n			    	}\n			    	*/\n\n			    	vec3 newPosition = aPosition * vec3(sin(tick * aNoise) * .2 + 1.2);\n\n			    	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );\n\n			    	gl_PointSize = SIZE * ( 300.0 / length( mvPosition.xyz ) );\n\n			    	gl_Position = projectionMatrix * mvPosition;\n			    	\n			    }",
          fragmentShader: "uniform sampler2D texture;\n\nvoid main() {\n\n	gl_FragColor = texture2D( texture, gl_PointCoord );\n\n}"
        });
      }

      return ParticleMaterial;

    })(THREE.ShaderMaterial);
  });

}).call(this);
