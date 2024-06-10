#ifdef GL_ES
precision mediump float;
#endif
#extension GL_GOOGLE_include_directive : enable
#include "raymarch_common.frag"

uniform vec2 u_resolution;  // Canvas size (width,height)
uniform vec2 u_mouse;       // mouse position in screen pixels
uniform float u_time;       // Time in seconds since load

vec4 colour(int j) {
    return vec4(fract(vec3(
            .0,
            .0,
            .0
            )*float(j)),1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = 3.*(fragCoord/u_resolution.y-0.5*u_resolution.xy/(u_resolution.y));
    vec2 ms = u_mouse/u_resolution.y-0.5*u_resolution.xy/(u_resolution.y);

    vec2 z = vec2(0);
    float e = 2.+5.*pow(sin(u_time*.2),2.);
    int i=0;
    for (;++i<1000;) {
        z = complexPower(z,e);
        z += uv;
        if (length(z) > 2.) break;
    }
    fragColor = vec4(smoothstep(30.,0.,float(i)), smoothstep(40., 10., float(i)), smoothstep(40.,30.,float(i)), 1);
    if (length(z) < 2.) {
        vec2 o = z;
        int j=0;
        for (;++j<1000;) {
            o = complexPower(o,e);
            o += uv;
            if (distance(o,z)/length(z)<.001) {
                fragColor = colour(j);
                break;
            }
        }
    }
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
