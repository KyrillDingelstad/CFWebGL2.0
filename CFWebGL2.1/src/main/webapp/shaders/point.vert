attribute vec3 position;
attribute float difference;

uniform mat4 modelView;
uniform mat4 projection;
//uniform float pointSize = 25.0;

varying float vsDifference;

void main()
{
    vsDifference = difference;
    gl_PointSize = 6.0;
    gl_Position = projection * modelView * vec4( position, 1.0 );

}
