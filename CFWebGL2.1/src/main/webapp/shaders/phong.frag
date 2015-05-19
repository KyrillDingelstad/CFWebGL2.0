precision mediump float;

uniform samplerCube envirSampler;
uniform float alpha;

varying vec3 es_normal;
varying vec3 camPos;
varying vec3 es_light;
varying vec3 es_vPos;

void main() {
        vec3 chromeColour = vec3(224.0/255.0, 223.0/255.0, 219.0/255.0) * 0.9 ;

        vec3 viewDir = normalize( camPos.xyz - es_vPos.xyz );
        vec3 lightDir =  normalize( es_light - es_vPos.xyz );
        vec3 normal =  normalize(es_normal) ;
        
        float nDotL = max(0.0, dot( normal, lightDir ) );
        
        vec3 reflected = reflect( lightDir, normal );
        float rDotV = max( 0.0, dot( reflected, viewDir ) );
        vec3 col;
        vec3 envir = textureCube(envirSampler, reflected).xyz;
        if(nDotL > 0.0){
            col = chromeColour * 0.1 + nDotL * chromeColour + envir * pow( rDotV, 128.0) + envir;
        }else{
            col = chromeColour * 0.1 + envir;
        }
        gl_FragColor = vec4(alpha*col.xyz, alpha); 
//        gl_FragColor = vec4(alpha); 

}