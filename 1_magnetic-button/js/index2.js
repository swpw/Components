// v0: starting point, v1: ending point, t: midpoint
const calcLerp = ( v0, v1, t ) => ( 1 - t ) * v0 + t * v1

// Distance between two points in straight line
const calcDistance = ( x1, y1, x2, y2 ) => Math.hypot( x1 - x2, y1 - y2 )

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
		this.lerp = {
			x: { current: 0, target: 0 },
			y: { current: 0, target: 0 }
		}

		this.mouse = { x: 0, y: 0}

		// Init
		window.addEventListener('mousemove', ({ pageX: x, pageY: y }) => 
			this.mouse = { x, y })

		window.addEventListener('resize', () => 
			this.t_rect = this.t_el.getBoundingClientRect())

		this.render()
	}

	render(){
		const centerDistance = calcDistance(
			this.mouse.x, 
			this.mouse.y, 
			this.t_rect.left + this.t_rect.width / 2,
			this.t_rect.top + this.t_rect.height / 2
		)

		this.lerp.x.target = 0
		this.lerp.y.target = 0

		if(centerDistance <= this.t_area){
			this.lerp.x.target = ( this.mouse.x - ( this.t_rect.left + this.t_rect.width / 2 ) ) * this.t_multiplier,
			this.lerp.y.target = ( this.mouse.y - ( this.t_rect.top + this.t_rect.height / 2 ) ) * this.t_multiplier
		}

		for( const item in this.lerp ){
			this.lerp[item].current = calcLerp( 
				this.lerp[item].current, 
				this.lerp[item].target, 
				this.t_midpoint
			)
		}

		gsap.to(this.t_el, this.a_duration, {
			transform: `translate(
				${ this.lerp["x"].current }px, 
				${ this.lerp["y"].current }px
			)`
		})

        window.requestAnimationFrame(() => this.render());
	}

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
		multiplier: .3
	},
	animation: {
		duration: 1,
		easing: Power2.easeOut
	}
}
const magneticBTN = new MagneticObject(settings)