#ifdef GL_ES
precision mediump float;
#endif
#extension GL_GOOGLE_include_directive : enable
#include "util.frag"

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform vec2 u_mouse;       // mouse position in screen pixels
uniform float u_time;       // Time in seconds since load


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = 3.*(fragCoord/u_resolution.y-0.5*u_resolution.xy/(u_resolution.y));
    vec2 ms = u_mouse/u_resolution.y-0.5*u_resolution.xy/(u_resolution.y);

    vec2 z = vec2(0);
    int i=0;
    for (;++i<1000;) {
        z = complexPower(z,7.-5.*pow(cos(u_time*.2),2.));
        z += uv;
        if (length(z) > 10000000.) break;
    }
    fragColor = vec4(smoothstep(30.,0.,float(i)), smoothstep(40., 10., float(i)), smoothstep(40.,30.,float(i)), 1);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
