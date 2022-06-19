class MagneticObject {
	constructor({ target: { element, outsideArea, midPoint, multiplier }, animation: { duration, easing } }){
		// Custom data & defaults
		this.t_el = typeof element === 'object' ? element : document.querySelector(element)
		this.t_rect = this.t_el.getBoundingClientRect()
		this.t_area = outsideArea || 100
		this.t_midpoint = midPoint || 0.5
		this.t_multiplier = multiplier || .275

		this.a_duration = duration || 1
		this.a_easing = easing	|| Power2.easeOut

		// Base data
		this.mouse = { x: 0, y: 0}

		// Init
		window.addEventListener('mousemove', ({ pageX: x, pageY: y }) => 
			this.mouse = { x, y })

		window.addEventListener('resize', () => 
			this.t_rect = this.t_el.getBoundingClientRect())

		this.render()
	}

	render(){
		const areaDistance = Math.hypot(
			(this.t_rect.left + this.t_rect.width / 2) - this.mouse.x,
			(this.t_rect.top + this.t_rect.height / 2) - this.mouse.y
		)

		// let lerp = {
		// 	x: (this.mouse.x - (this.t_rect.left + this.t_rect.width / 2)) * .265,
		// 	y: (this.mouse.y - (this.t_rect.top + this.t_rect.height / 2)) * .265
		// }

		// if(areaDistance > this.t_area) lerp = { x: 0, y : 0 }

		this.t_area = 200

		let lerp = { x: 0, y: 0 }

		if(
			this.mouse.x > this.t_rect.left - this.t_area && 
			this.mouse.x < this.t_rect.right + this.t_area && 
			this.mouse.y > this.t_rect.top - this.t_area && 
			this.mouse.y < this.t_rect.bottom + this.t_area
		){
			lerp = {
				x: (this.mouse.x - (this.t_rect.left + this.t_rect.width / 2)) * .5,
				y: (this.mouse.y - (this.t_rect.top + this.t_rect.height / 2)) * .5
			}
		}

		gsap.to(this.t_el, this.a_duration, {
			transform: `translate(
				${ lerp.x }px, 
				${ lerp.y }px
			)`
		})

		gsap.to('.btn-txt', 2, {
			transform: `translate(
				${ lerp.x * .2 }px, 
				${ lerp.y * .2 }px
			)`
		})

		window.requestAnimationFrame(() => this.render());
		
		// this.mouse = { x: 400, y: 400}

		// const centerDistance = this.calcDistance(
		// 	this.t_rect.left + this.t_rect.width / 2,
		// 	this.mouse.x, 
		// 	this.t_rect.top + this.t_rect.height / 2,
		// 	this.mouse.y
		// )

		// const lerpDistance = this.calcLerp(
		// 	this.mouse.x,
		// 	this.t_rect.left + this.t_rect.width / 2,
		// 	.5
		// )

		// console.log('test lerp', this.calcLerp( 
		// 	612 + 300, 612, .5
		// ))

		// console.log('Center:', + Math.hypot(
		// 	(this.t_rect.left + this.t_rect.width / 2) - this.mouse.x,
		// 	(this.t_rect.top + this.t_rect.height / 2) - this.mouse.y
		// ))
		
		// // console.log(`DISTANCE TO CENTER TRUE`, Math.hypot((this.mouse.x),)
		// console.log(`${0.5} Lerp:`, lerpDistance)
		// console.log(`DISTANCE TO CENTER:`, centerDistance)
		// console.log(`Center X of box:`, this.t_rect.left + this.t_rect.width / 2)
		// console.log(`Center Y of box:`, this.t_rect.top + this.t_rect.height / 2)
		// console.log(`MOUSE COORDS [ x, y ] :`, this.mouse.x, this.mouse.y)
	}

	calcLerp = ( v0, v1, t ) => ( 1 - t ) * v0 + t * v1

	calcDistance = ( x1, y1, x2, y2 ) => Math.hypot( x1 - x2, y1 - y2 )

	get settings(){
		return {
			target: {
				element: this.t_el,
				outsideArea: this.t_area,
				midPoint: this.t_midpoint,
				multiplier: this.t_multiplier
			},
			animation: {
				duration: this.a_duration,
				easing: this.a_easing
			}
		}
	}
}

const settings = {
	target: {
		element: document.querySelector('.btn'),
		outsideArea: 300,
		midPoint: .5,
		multiplier: 1
	},
	animation: {
		duration: 1.5,
		easing: Power2.easeOut
	}
}
const magneticBTN = new MagneticObject(settings)