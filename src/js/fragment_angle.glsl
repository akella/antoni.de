uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;
uniform vec2 accel;

varying vec2 vUv;
varying vec2 vUv1;
varying vec4 vPosition;


void main()	{
	vec2 uv = gl_FragCoord.xy/pixels.xy;
	
	float p = fract(progress);
	vec4 fcolor;

	float p1 = p - 1.;

	vec2 position = step(0.,p)*uv + step(0.,-p)*(1. - uv);

	// texture 1
	float dx1 = p*0.8;
	float vert = abs(p*0.3);
	dx1 -= step(0.2 - vert,position.x/10. + position.y/4.)*0.3*p;
	dx1 -= step(0.4 - vert,position.x/10. + position.y/4.)*0.3*p;
	dx1 += step(0.6 - vert,position.x/10. + position.y/4.)*0.3*p;
	dx1 += step(0.8 - vert,position.x/10. + position.y/4.)*0.3*p;
	vec4 tex1 = texture2D(texture1,vec2(vUv1.x + dx1,vUv1.y));
	float bounds = step(0., 1. - (uv.x/2. + p))*step(0., uv.x/2. + p);
	fcolor = tex1*bounds;



	// texture 2
	float dx2 = p1*0.8;
	float vert1 = abs(p1*0.3);
	dx2 -= step(0.2 + vert1,position.x/10. + position.y/4.)*0.3*p1;
	dx2 -= step(0.4 + vert1,position.x/10. + position.y/4.)*0.3*p1;
	dx2 += step(0.6 + vert1,position.x/10. + position.y/4.)*0.3*p1;
	dx2 += step(0.8 + vert1,position.x/10. + position.y/4.)*0.3*p1;
	vec4 tex2 = texture2D(texture2,vec2(vUv1.x + dx2,vUv1.y));
	float bounds1 = step(0., 1. - (uv.x/2. + p1))*step(0., uv.x/2. + p1);
	fcolor += tex2*bounds1;


	gl_FragColor = fcolor;
	// gl_FragColor = vec4(dx1);


}