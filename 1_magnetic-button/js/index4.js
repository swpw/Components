class MagneticObject{
	constructor({ target, entryArea, leaveArea, animation }){
		this.target = target
		this.rect = this.target.getBoundingClientRect()
		this.entryArea = entryArea
		this.leaveArea = leaveArea
		this.animation = animation

		

		this.previouslyLeft = true
		this.hasMouseEntered = false
		this.mouse = { x: 0, y: 0 }

		window.addEventListener('mousemove', ({ pageX: x, pageY: y }) => 
			this.mouse = { x, y })

		window.addEventListener('resize', () => 
			this.rect = this.target.getBoundingClientRect())

		this.render()
	}

	calcDistance = ( 
		x1 = this.mouse.x, 
		y1 = this.mouse.y, 
		x2 = this.rect.left + ( this.rect.width / 2 ), 
		y2 = this.rect.top + ( this.rect.height / 2 )
	) => Math.hypot( x1 - x2, y1 - y2 )
	
	getCenterTranslate = ( factor = 1 ) => ({
		x: ( this.mouse.x - ( this.rect.left + ( this.rect.width / 2 ) ) ) * factor,
		y: ( this.mouse.y - ( this.rect.top + ( this.rect.height / 2 ) ) ) * factor
	})

	// Ustawić pusty środek this.getCenterTranslate() nadając default
	// value w constructorze jako 1, a tutaj jako this.leaveArea.translateFactor
	animateTranslate = () => 
		gsap.to(this.target, this.animation.duration, {
			transform: `translate(
				${ this.getCenterTranslate(this.leaveArea.translateFactor).x }px, 
				${ this.getCenterTranslate(this.leaveArea.translateFactor).y }px
			)`
		})

	animateFalloff = () => 
		gsap.to(this.target, this.animation.duration, {
			transform: 'translate(0px, 0px)'
		})

	renderCircle = mouseDistance => {
		/* CIRCLE ENTRY */
		if( this.entryArea.name === 'circle'
			&& mouseDistance <= this.entryArea.areaDistance 
			&& !this.hasMouseEntered ){

				this.hasMouseEntered = true
				this.previouslyLeft = false

				this.entryArea.onMouseEnter()
		}

		/* CIRCLE LEAVE */
		if( this.leaveArea.name === 'circle'  
			&& mouseDistance <= this.leaveArea.areaDistance 
			&& this.hasMouseEntered ){

				/* Mouse's inside element area */ 
				this.animateTranslate()
		}else if( this.leaveArea.name === 'circle' ){

				/* Mouse's just left element area */
				if(!this.previouslyLeft){
					this.hasMouseEntered = false
					this.previouslyLeft = true

					this.animateFalloff()
					this.leaveArea.onMouseLeave()
				}else{
					this.previouslyLeft = true
				}
		}
	}

	renderSquarePadding = mouseDistance => {
		/* SQUARE PADDING ENTRY */
		if( this.entryArea.name === 'square-padding'
			&& this.mouse.x > this.rect.left - this.entryArea.areaPadding 
			&& this.mouse.x < this.rect.right + this.entryArea.areaPadding 
			&& this.mouse.y > this.rect.top - this.entryArea.areaPadding 
			&& this.mouse.y < this.rect.bottom + this.entryArea.areaPadding
			&& !this.hasMouseEntered ){

				this.hasMouseEntered = true
				this.previouslyLeft = false

				this.entryArea.onMouseEnter()
		}

		/* SQUARE PADDING LEAVE */
		if( this.leaveArea.name === 'square-padding'
			&& this.mouse.x > this.rect.left - this.leaveArea.areaPadding 
			&& this.mouse.x < this.rect.right + this.leaveArea.areaPadding 
			&& this.mouse.y > this.rect.top - this.leaveArea.areaPadding 
			&& this.mouse.y < this.rect.bottom + this.leaveArea.areaPadding
			&& this.hasMouseEntered ){

				/* Mouse's inside element area */ 
				this.animateTranslate()
		}else if( this.leaveArea.name === 'square-padding' ){

				/* Mouse's just left element area */
				if(!this.previouslyLeft){
					this.hasMouseEntered = false
					this.previouslyLeft = true

					this.animateFalloff()
					this.leaveArea.onMouseLeave()
				}else{
					this.previouslyLeft = true
				}
		}
	}

	renderSquareDistance = mouseDistance => {
		/* SQUARE DISTANCE ENTRY */
		const centerX = ( this.rect.left + ( this.rect.width / 2 ) )
		const centerY = ( this.rect.top + ( this.rect.height / 2 ) )

		if( this.entryArea.name === 'square-distance'
			&& this.mouse.x > centerX - this.entryArea.areaPadding 
			&& this.mouse.x < centerX + this.entryArea.areaPadding 
			&& this.mouse.y > centerY - this.entryArea.areaPadding 
			&& this.mouse.y < centerY + this.entryArea.areaPadding
			&& !this.hasMouseEntered ){

				this.hasMouseEntered = true
				this.previouslyLeft = false

				this.entryArea.onMouseEnter()
		}

		/* SQUARE DISTANCE LEAVE */
		if( this.leaveArea.name === 'square-distance'
			&& this.mouse.x > centerX - this.leaveArea.areaPadding 
			&& this.mouse.x < centerX + this.leaveArea.areaPadding 
			&& this.mouse.y > centerY - this.leaveArea.areaPadding 
			&& this.mouse.y < centerY + this.leaveArea.areaPadding
			&& this.hasMouseEntered ){

				/* Mouse's inside element area */ 
				this.animateTranslate()
		}else if( this.leaveArea.name === 'square-distance' ){

			/* Mouse's just left element area */
			if(!this.previouslyLeft){
				this.hasMouseEntered = false
				this.previouslyLeft = true

				this.animateFalloff()
				this.leaveArea.onMouseLeave()
			}else{
				this.previouslyLeft = true
			}
		}
	}

	render = () => {
		const mouseDistance = this.calcDistance()

		this.renderCircle(mouseDistance)
		this.renderSquarePadding(mouseDistance)
		this.renderSquareDistance(mouseDistance)

        window.requestAnimationFrame(() => this.render());
	}
}

// Init
const settings = {
	target: document.querySelectorAll('.magnetic__button')[0],
	entryArea: {
		name: 'circle',
		areaDistance: 100,
		areaPadding: 100,
		onMouseEnter: () => {
			console.log('Entered')
		}
	},
	leaveArea: {
		name: 'circle',
		areaDistance: 150,
		areaPadding: 200,
		translateFactor: .3,
		maxDistance: null,
		onMouseLeave: () => {
			console.log('Leave')
		}
	},
	animation: {
		duration: .6
	}
}

const settings2 = {
	target: document.querySelectorAll('.magnetic__button')[1],
	entryArea: {
		name: 'circle',
		areaDistance: 100,
		areaPadding: 100,
		onMouseEnter: () => {
			console.log('Entered')
		}
	},
	leaveArea: {
		name: 'circle',
		areaDistance: 150,
		areaPadding: 200,
		translateFactor: .3,
		maxDistance: null,
		onMouseLeave: () => {
			console.log('Leave')
		}
	},
	animation: {
		duration: .6
	}
}

const settings3 = {
	target: document.querySelectorAll('.magnetic__button')[2],
	entryArea: {
		name: 'circle',
		areaDistance: 100,
		areaPadding: 100,
		onMouseEnter: () => {
			console.log('Entered')
		}
	},
	leaveArea: {
		name: 'square-distance',
		areaDistance: 150,
		areaPadding: 200,
		translateFactor: .3,
		maxDistance: null,
		onMouseLeave: () => {
			console.log('Leave')
		}
	},
	animation: {
		duration: .6
	}
}



const magnetic1 = new MagneticObject(settings)
const magnetic2 = new MagneticObject(settings2)
const magnetic3 = new MagneticObject(settings3)















// const settings = {
// 	primaryTarget: {
// 		element: document.querySelector('#id'),
// 		entryArea: {
// 			circle: {
// 				area: '',
// 			},
// 			square: {
// 				area: '',
// 				areaPadding: 'default: element borders',
// 			}
// 		},
// 		leaveArea: {
// 			circle: {
// 				area: '',
// 				maxTranslateFactor: 'default: 0',
// 				maxDistance: 'default: 0'
// 			},
// 			square: {
// 				area: '',
// 				areaPadding: 'default: element borders',
// 				maxTranslateFactor: 'default: 0',
// 				maxDistance: 'default: 0'
// 			}
// 		},
// 		animations: {
// 			inside: {
// 				duration: ''
// 			},
// 			reset: {
// 				duration: ''
// 			}
// 		}
// 	},
// 	secondaryTarget: {
// 		element: document.querySelector('#id'),
// 		entryArea: {
// 			circle: {
// 				area: '',
// 			},
// 			square: {
// 				area: '',
// 				areaPadding: 'default: element borders',
// 			}
// 		},
// 		leaveArea: {
// 			circle: {
// 				area: '',
// 				maxTranslateFactor: 'default: 0',
// 				maxDistance: 'default: 0'
// 			},
// 			square: {
// 				area: '',
// 				areaPadding: 'default: element borders',
// 				maxTranslateFactor: 'default: 0',
// 				maxDistance: 'default: 0'
// 			}
// 		},
// 		animations: {
// 			inside: {
// 				duration: ''
// 			},
// 			reset: {
// 				duration: ''
// 			}
// 		}
// 	},
// 	resize: [
// 		{
// 			resizeAt: 'max-width: 991px',
// 			disable: '',
// 			onBefore: () => {
				
// 			}
// 		}
// 	]
// }

/* ----------------------------------------------------------------- */

/* Mouse's just entered element area */ 
// Distance of a mouse is within the entry area distance and previous
// mouse move hasn't been inside element area
// Don't render anything here because next IF will cover that.
// This IF only differentiates entryArea and leaveArea

/* ----------------------------------------------------------------- */