## @atomico/atomcss

[![npm](https://badgen.net/npm/v/@atomico/atomcss)](http://npmjs.com/@atomico/atomcss)
[![gzip](https://badgen.net/bundlephobia/minzip/@atomico/atomcss)](https://bundlephobia.com/result?p=@atomico/atomcss)

Es un css-in-js agnóstico, permite crear estilos estáticos y encapsulados por un nombre de clase generado por **Atomcss**.

**Atomcss** posee una sintaxis minimalista inspirada en [stylus](http://stylus-lang.com/), pero centrada en la creación de componentes detro del mismo js

## Ejemplo de sintaxis

```stylus
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed')
    
@global
	body
		font-family: 'Roboto Condensed', sans-serif
width: 500px
height: 500px
&:hover
    background:black

@media (max-width: 320px)
	width: 100%
	height: 100%
    box-shadow: 
		0px 0px 12px red
    	0px 0px 12px black
// selector state
::alert
	background:tomato
// selector state
::success	
	background:teal	
```

Ejemplo de uso

```js
let button = css(`
	padding: 1rem 1.5rem
	background: transparent
	border: none
	&:hover
		background: black
		color: white
	::alert
		color: white
		background: tomato
		&:hover
			background: tomato
`);

document.querySelector("#button").className = button;
document.querySelector("#button-alert").className = button({alert:true});
```

Ejemplo de uso con JSX

```js
import {h} from "@atomico/core";
import {css} from "@atomico/atomcss";

let button = css(`
	padding: 1rem 1.5rem
	background: transparent
	border: none
	&:hover
		background: black
		color: white
	::alert
		color: white
		background: tomato
		&:hover
			background: tomato
`);

export default function Button(props){
    return <button class={button({alert:props.alert})}>
        {props.children}
    </button>
}
```

## tipos de selectores

### selectores de estado

Los selectores de estado usan el prefijo `::` y su profundidad no debe ser anidada, estos selectores permiten añadir una clase condicional al estado.

```js
let myStyles = css(`
::state1
	color:red
::state2
	color:orange
::state3
	color:yellow
`)

myStyles({state1:1}) // classname classname-state1
myStyles({state1:1,state2:1}) // classname classname-state1 classname-state2
```

>  los estados pueden ser mas complejos del enseñado, ya que solo es un selector de raiz.

### @keyframe

Las animaciones declaradas con **Atomcss** no poseen una definición global.

```stylus
@keyframes 5s linear 2s infinite alternate
	0%
		background-color:red
		left:0px
		top:0px
  	25%
		background-color:yellow
		left:200px
		top:0px
  	50%
  		background-color:blue
  		left:200px
  		top:200px
  	75%
  		background-color:green 
		left:0px
		top:200px
  	100% 
  		background-color:red
  		left:0px
  		top:0px
```

## media

los media query son mas simples de declarar 

```stylus
::state1
    @media (max-width:320px)
        width:100%
        height:auto
	@media (max-width:720px)
        width:50%
        height:auto     
```

