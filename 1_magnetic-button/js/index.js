/* Linear interpolation
 * https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
 * v0 = start point, v1 = end point, t = position between points
 * v0 = current, v1 = target, t = factor
**/ 
const lerp = ( v0, v1, t ) => ( 1 - t ) * v0 + t * v1

let mousePos = { x: 0, y: 0 }
window.addEventListener('mousemove', ({ pageX: x, pageY: y }) => 
	mousePos = { x, y })

const calcDistance = ( x1, y1, x2, y2 ) => Math.hypot( x1 - x2, y1 - y2 )

class MagneticObject {
	constructor(target, area, ease, duration){
		this.target = target
		this.targetRect = this.target.getBoundingClientRect()
		this.area = area
		this.ease = ease
		this.duration = duration

		this.lerpData = {
			x: { current: 0, target: 0 },
			y: { current: 0, target: 0 }
		}

		window.addEventListener('resize', () => 
			this.targetRect = this.target.getBoundingClientRect())

		this.render()
	}

	render(){
		const centerDistance = calcDistance(
			mousePos.x, 
			mousePos.y, 
			this.targetRect.left + ( this.targetRect.width / 2 ),
			this.targetRect.top + ( this.targetRect.height / 2 )
		)

		// console.log(centerDistance)
		
		let targetHolder = { x: 0, y: 0 };

		if(centerDistance <= this.area){
			targetHolder.x = ( mousePos.x - ( this.targetRect.left + ( this.targetRect.width / 2 ) ) ) * .333,
			targetHolder.y = ( mousePos.y - ( this.targetRect.top + ( this.targetRect.height / 2 ) ) ) * .333
		}

		this.lerpData["x"].target = targetHolder.x
		this.lerpData["y"].target = targetHolder.y

		for( const item in this.lerpData ){
			this.lerpData[item].current = lerp( 
				this.lerpData[item].current, 
				this.lerpData[item].target, 
				this.ease
			)
		}

		gsap.to(this.target, this.duration, {
			transform: `translate(
				${ this.lerpData["x"].current }px, 
				${ this.lerpData["y"].current }px
			)`
		})

        window.requestAnimationFrame(() => this.render());
	}
}

const target = document.querySelector('.btn'),
	area = 300,
	ease = .5,
	duration = 1
const mgntObj = new MagneticObject(target, area, ease, duration)