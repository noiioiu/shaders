float minimum(float x, float y) {return min(x,y);}
float minimum(float x, float y, float z) {return min(min(x,y), z);}
float minimum(float x, float y, float z, float w) {return min(min(x,y), min(z,w));}
float minimum(float x, float y, float z, float w, float s) {return min(min(x,y), minimum(z,w,s));}
float minimum(float x, float y, float z, float w, float s, float t) {return minimum(min(x,y), min(z,w), min(s,t));}
float minimum(float x, float y, float z, float w, float s, float t, float u) {
    return minimum(minimum(x,y,z), min(w,s), min(t,u));
}
float minimum(float x, float y, float z, float w, float s, float t, float u, float v) {
    return min(minimum(x,y,z,w), minimum(s,t,u,v));
}

float maximum(float x, float y) {return max(x,y);}
float maximum(float x, float y, float z) {return max(max(x,y), z);}
float maximum(float x, float y, float z, float w) {return max(max(x,y), max(z,w));}
float maximum(float x, float y, float z, float w, float s) {return max(max(x,y), maximum(z,w,s));}
float maximum(float x, float y, float z, float w, float s, float t) {return maximum(max(x,y), max(z,w), max(s,t));}
float maximum(float x, float y, float z, float w, float s, float t, float u) {
    return maximum(maximum(x,y,z), max(w,s), max(t,u));
}
float maximum(float x, float y, float z, float w, float s, float t, float u, float v) {
    return max(maximum(x,y,z,w), maximum(s,t,u,v));
}

#define EPSILON .00001
#define EPS vec2(EPSILON, 0.)
#define grad2(f,v) (vec2( f((v)+EPS.xy) - f((v)-EPS.xy),\
                          f((v)+EPS.yx) - f((v)-EPS.yx)\
                          )/(2.*EPSILON))
#define grad3(f,v) (vec3( f((v)+EPS.xyy) - f((v)-EPS.xyy),\
                          f((v)+EPS.yxy) - f((v)-EPS.yxy),\
                          f((v)+EPS.yyx) - f((v)-EPS.yyx)\
                          )/(2.*EPSILON))
#define grad4(f,v) (vec4( f((v)+EPS.xyyy) - f((v)-EPS.xyyy),\
                          f((v)+EPS.yxyy) - f((v)-EPS.yxyy),\
                          f((v)+EPS.yyxy) - f((v)-EPS.yyxy),\
                          f((v)+EPS.yyyx) - f((v)-EPS.yyyx)\
                          )/(2.*EPSILON))

// Multiply up to four quaternions.
vec4 quaternionProduct(vec4 p, vec4 q) {
    return vec4(-dot(p.yzw,q.yzw), cross(p.yzw, q.yzw)) + p.x*q + q.x*p;
    //return vec4(p.x*q.x - p.y*q.y - p.z*q.z - p.w*q.w,
    //            p.x*q.y + p.y*q.x + p.z*q.w - p.w*q.z,
    //            p.x*q.z + p.z*q.x + p.w*q.x - p.x*q.w,
    //            p.x*q.w + p.w*q.x + p.y*q.z - p.z*q.y
    //            );
}
vec4 quaternionProduct(vec4 p, vec4 q, vec4 r) {
    return quaternionProduct(p,quaternionProduct(q,r));
}
vec4 quaternionProduct(vec4 p, vec4 q, vec4 r, vec4 s) {
    return quaternionProduct(quaternionProduct(p,q),quaternionProduct(r,s));
}

float dCube(vec2 v, vec2 d) {
    return .5*length(abs(v)-d + abs(abs(v)-d));
}
float dCube(vec3 v, vec3 d) {
    return .5*length(abs(v)-d + abs(abs(v)-d));
}
float dCube(vec4 v, vec4 d) {
    return .5*length(abs(v)-d + abs(abs(v)-d));
}

// Constant times L1 distance to orthoplex.
// Lower bound for Euclidean (L2) distance to orthoplex.
float dOrthoplex(vec2 v, float d) {
    v = abs(v);
    return .70710678*(v.x+v.y-d);
}
float dOrthoplex(vec3 v, float d) {
    v = abs(v);
    return .577350269*(v.x+v.y+v.z-d);
}
float dOrthoplex(vec4 v, float d) {
    v = abs(v);
    return .5*(v.x+v.y+v.z+v.w-d);
}

float dSphere(vec2 v, vec2 c, float r) {
    return length(v-c)-r;
}
float dSphere(vec3 v, vec3 c, float r) {
    return length(v-c)-r;
}
float dSphere(vec4 v, vec4 c, float r) {
    return length(v-c)-r;
}

float dTorus(vec3 v, float R, float r) {
    return length(vec2(length(v.xy)-R, v.z))-r;
}
float dTorus(vec4 v, float r1, float r2, float r) {
    return length(vec2(length(v.xy)-r1, length(v.zw)-r2))-r;
}

float dSquareTorus(vec3 v, float R, float r) {
    return dCube(vec2(dCube(v.xy,vec2(R)), v.z), vec2(r));
}
float dSquareTorus(vec4 v, float r1, float r2, float r) {
    //return dCube(vec2(length(v.xy)-r1, dCube(v.zw,vec2(r2))), vec2(r));
    //return length(vec2(length(v.xy)-r1, dCube(v.zw,vec2(r2)))) -r;
    return length(vec2(length(v.xy)-r1, dOrthoplex(v.zw,r2))) -r;
    //return length(vec2(dOrthoplex(v.xy,r1), dOrthoplex(v.zw,r2)))-r;
}

// Cartesian product of sphere and circle.
float dSphircle(vec4 v, float R, float r) {
    return length(vec2(length(v.xyz)-R, v.w))-r;
}
float dSphircle2(vec4 v, float R, float r) {
    return length(vec2(length(v.xyz), v.w-R))-r;
}
