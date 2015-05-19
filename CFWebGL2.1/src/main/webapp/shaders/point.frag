precision mediump float;

uniform float maxDiff;
uniform float minDiff;
uniform float ignoreUnder;
uniform float ignoreOver;
uniform bool absVal;
uniform bool invertSign;


varying float vsDifference;

vec3 gradient(float min, float max, float val) {
	float v = clamp(4.0*(val-min)/(max-min), 0.0, 4.0);
	vec3 col;
	if (v<1.0) {
		col = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), vec3(v)); // b-c
	} else if (v<2.0) {
		col = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), vec3(v-1.0)); // c-g
	} else if (v<3.0) {
		col = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), vec3(v-2.0)); // g-v
	} else  {
		col = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(v-3.0)); // v-r
	} 
	return col;
}

void main()
{
    float v = vsDifference;
    if (invertSign) {
        v=-v;
    }
    if (absVal) {
        v = abs(v);
    }

    gl_FragColor = vec4(gradient(minDiff, maxDiff, v), 1.0);
    if (v<ignoreUnder) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        discard;
    }
    if (v > ignoreOver) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        discard;
    }
	
	

}
