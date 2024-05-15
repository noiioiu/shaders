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
    //return minimum(dCube(quaternionProduct(rot1, v+vec4(-2.,-1.,0.,0.2)), vec4(.5)), dSquareTorus(quaternionProduct(rot2,   ((fract(v/16.+.5)-.5)*16.)  .wyzx, rot1), .6,.6,.13), dot(v.xzw, vec3(-1., 1.5, -2))+8.);
    //return dSphircle(quaternionProduct(rot2, v.zywx, rot1), 1.,.4);
    float torus = dTorus(quaternionProduct(rot2, v.zywx, rot1), 1., 1.,.2);
    v = quaternionProduct(rot1, v.yzxw );
    //float box = length(vec4(v.yx,v.zw-clamp(v.zw,-.4,.4)))-1.;
    float box = dCube(quaternionProduct(rot1,v+vec4(0,0,0,0), rot2), vec4(1.));
    return min(torus, torus);
    //return dSphircle2(quaternionProduct(rot1, v.zyxw ,rot2 ), 1., .5);
    //return dOrthoplex(quaternionProduct(rot1, vec4(v), rot2), 1.);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/u_resolution.y-0.5*u_resolution.xy/u_resolution.y;
    vec2 ms = u_mouse/u_resolution.y-0.5*u_resolution.xy/u_resolution.y;

    float t;
    vec4 v = vec4(0,0,-4., sin(u_time/16.));
    vec4 d = normalize(vec4(uv, 1., 0.));
    int i=0;
    for(;i++<256;) {
        t = dist(v);
        v += d*t;
        //v = (fract(v/16.+.5)-.5)*16.;
        if (t<0.01 || t > 1024.) break;
    }
    vec4 n = normalize(grad4(dist, v));
    vec4 r = reflect(d, n);
    vec4 red   = (vec4(0.,0.,0.,5.) -v); red/=pow(length(red),4.);
    vec4 blue  = (vec4(0.,0.,0.,-5.)-v); blue/=pow(length(blue),4.);;
    vec4 green = (vec4(5,2,0,0)     -v); green/=pow(length(green),4.);

    vec3 col = vec3((length(v)<1024.)?1:0);//vec3(smoothstep(17.5,3.2,(length(v))));
    col *= clamp(vec3(dot(d,vec4(.3))),0.,1.)*vec3(1,0,1) + .3*clamp(vec3(150.*dot(r, red), 100.*dot(r, green), 150.*dot(r,blue)), 0., 1.);


    // Output to screen
    fragColor = vec4(col,1.);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
