#ifdef GL_ES
precision mediump float;
#endif
#extension GL_GOOGLE_include_directive : enable
#include "util.frag"

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform vec2 u_mouse;       // mouse position in screen pixels
uniform float u_time;       // Time in seconds since load

float dist (vec4 v) {
    //return min(dSphere(v, vec3(cos(u_time),0.1+0.1*cos(u_time),0.9+0.7*sin(u_time)), 0.5),
    //dSphere(v, vec3(0.1+0.1*sin(u_time),sin(u_time),0.9+0.7*sin(u_time)), 0.5));
    //return dTorus(v, vec3(0., 0., 1.4), vec3(sin(u_time),.2,cos(u_time)), 1., .2);
    
    vec4 rot1 = (vec4(cos(u_time)*5./13., 0.,cos(u_time)*12./13., sin(u_time)));
    vec4 rot2 = (vec4(0., sin(u_time), 0., cos(u_time)));

    //return dCube(quaternionProduct(rot1, v, rot2), vec4(.5));
    return dTorus(quaternionProduct(rot2, v.wyzx, rot1), .5,.5,.1);
    //return dSphircle(quaternionProduct(rot1, v.zywx, rot1), .7,.2);
    //return dOrthoplex(quaternionProduct(rot1, vec4(v), rot2), 1.);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/u_resolution.y-0.5*u_resolution.xy/u_resolution.y;
    vec2 ms = u_mouse/u_resolution.y-0.5*u_resolution.xy/u_resolution.y;

    float t;
    vec3 v = vec3(0,0,-4.);
    vec3 d = normalize(vec3(uv, 1.));
    int i=0;
    for(;i++<128;) {
        t = dist(vec4(v, .0*cos(u_time)));
        v += d*t;
        //v = (fract(v/16.+.5)-.5)*16.;
        if (t<0.0001 || t > 1024.) break;
    }

    vec3 col = vec3(smoothstep(1.5,.2,.004*float(i)+length(v)));

    // Output to screen
    fragColor = vec4(col,1.);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
