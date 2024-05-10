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
    return length(vec2(v.z, length(v.xy)-R))-r;
}

float dTorus(vec4 v, float r1, float r2, float r) {
    return length(vec2(length(v.xy)-r1, length(v.zw)-r2))-r;
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
