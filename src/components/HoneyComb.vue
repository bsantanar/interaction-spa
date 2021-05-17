<template>

		<article :style="background">
			<!-- <figure v-if="!person.image">
			<h2>{{person.fullName}}</h2>
				<p>{{person.degree}}</p>
			</figure> -->
			<v-tooltip v-if="person.image" bottom open-delay="400">
			<template v-slot:activator="{ on, attrs }">
					<img v-bind="attrs" v-on="on" alt :src="person.image" :style="img" />
			</template>
			<span>{{person.fullName}}</span>
			</v-tooltip>
			<v-tooltip v-else bottom open-delay="400">
			<template v-slot:activator="{ on, attrs }">
					<img v-bind="attrs" v-on="on" alt src="@/assets/default.jpg" :style="img" />
			</template>
			<span>{{person.fullName}}</span>
			</v-tooltip>
		</article>
</template>
<script>
export default {
    name: "HoneyComb",
    props: ["person"],
	computed: {
		img(){
			if(!this.person.active) return {"filter": "grayscale(100%)"}
			return {};
		},
		background(){
			if(!this.person.active){
				return {
					"background": "#6b6d70"
				}
			}
			return {
				"background": "#0D47A1"
			}
		}
	}
}
</script>
<style>
article {
	background: #0D47A1;
	width: var(--size); 
	height: calc(var(--size) / 1.1111);
	clip-path: url(#hexagono);
	clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
	margin-right: calc(var(--size) / 2);
	color: #fff;
	overflow: hidden;
	transition: .7s;
	position: relative;
	z-index: 0;
}
article:nth-child(2n) {margin: calc(var(--size) * -.5) calc(var(--size) * -.25) 0 calc(var(--size) * -.75);}
article::before {
	content: '';
	float: left;
	width: 25%;
	height: 100%;
	clip-path: polygon(0% 0%, 100% 0%, 0% 50%, 100% 100%, 0% 100%);
	shape-outside: polygon(0% 0%, 100% 0%, 0% 50%, 100% 100%, 0% 100%);
}
img {
  width: var(--size);
	height: var(--size);
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	transform-origin: 0% 50%;
	transition: .9s;
	clip-path: url(#hexagono);
	clip-path: inherit;
	z-index:  10;
}
article:hover {
	width: calc(var(--size) * 1.7);
	height: calc(var(--size) * 1.7);
	transition: .5s;
	z-index: 10;
}
img:hover {
	width: calc(var(--size) * 1.7);
	height: calc(var(--size) * 1.7);
	transition: .5s;
}
h2 {font-size: 100%;}

@media only screen and (max-width: 600px) {
	h2 {font-size: 100%;}
  figure p {font-size: 70%;}
}
figure {
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: center;
	max-width: 50%;
	height: 100%;
	font-size: calc(9 / var(--Nhexa) * 1vw);
	line-height: 1;
	color: #fff;
	transition: .75s .05s;
  text-align: center;
}
figure p {
	font-size: 70%;
	line-height: 1.2;
	width: 100%;
}
body > p {
	font-size: 1.5rem;
	margin: 2rem 0 1rem calc(var(--size) * .5);
	font-weight: 200;
}
</style>