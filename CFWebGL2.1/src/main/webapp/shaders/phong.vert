attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelView;
uniform mat4 modelViewInverseTranspose;
uniform mat4 projection;

varying vec3 es_normal;
varying vec3 camPos;
varying vec3 es_light;
varying vec3 es_vPos;

void
main()
{
    es_normal = (modelViewInverseTranspose * vec4(normal, 0.0)).xyz;
    camPos= vec3(modelViewInverseTranspose[0][3], modelViewInverseTranspose[1][3], modelViewInverseTranspose[2][3]);
    es_light =  (modelView * vec4(camPos.x, camPos.y, camPos.z, 1.0) ).xyz; 
    es_vPos = (modelView * vec4( position, 1.0 )).xyz;
    gl_Position = projection * modelView * vec4( position, 1.0 );
}
