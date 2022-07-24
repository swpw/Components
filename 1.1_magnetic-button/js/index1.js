class MagneticObject{
	constructor({ target, entryArea, leaveArea, animation }){
		/* User data */
		this.target = target
		this.rect = this.target.getBoundingClientRect()
		this.entryArea = entryArea
		this.leaveArea = leaveArea
		this.animation = animation


		/* Magnetic Data */
		this.previouslyLeft = true
		this.hasMouseEntered = false
		this.mouse = { x: 0, y: 0 }


		/* Events */
		window.addEventListener('mousemove', ({ clientX: x, clientY: y }) => 
			this.mouse = { x, y })

		window.addEventListener('resize', () => 
			this.rect = this.target.getBoundingClientRect())

		window.addEventListener('scroll', () => 
			this.rect = this.target.getBoundingClientRect())


		/* Render */
		this.render()
	}


	/* Utils */
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

	maxNumber = (number, max = this.leaveArea.maxDistance) => 
		Math.sign(number) === -1
			? max > Math.abs(number) ? number : -max
			: max > number ? number : max


	/* Animations of In/Out */ 
	animateTranslate = () => {
		let translate = this.getCenterTranslate(this.leaveArea.translateFactor)

		if(this.leaveArea.maxDistance !== null){
			translate = {
				x: this.maxNumber(this.getCenterTranslate(this.leaveArea.translateFactor).x),
				y: this.maxNumber(this.getCenterTranslate(this.leaveArea.translateFactor).y)
			}
		}

		gsap.to(this.animation.target, this.animation.duration, {
			transform: `translate(
				${ translate.x }px, 
				${ translate.y }px
			)`
		})
	}

	animateFalloff = () => 
		gsap.to(this.animation.target, this.animation.duration, {
			transform: 'translate(0px, 0px)'
		})

	
	/* Detection of In/Out - MAIN */
	renderCircle = mouseDistance => {
		/* CIRCLE ENTRY */
		if( this.entryArea.name === 'circle'
			&& mouseDistance <= this.entryArea.areaDistance + this.entryArea.areaPadding
			&& !this.hasMouseEntered ){

				this.hasMouseEntered = true
				this.previouslyLeft = false

				this.entryArea.onMouseEnter()
		}

		/* CIRCLE LEAVE */
		if( this.leaveArea.name === 'circle'  
			&& mouseDistance <= this.leaveArea.areaDistance + this.leaveArea.areaPadding
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


	/* Render */
	render = () => {
		const mouseDistance = this.calcDistance()

		this.renderCircle(mouseDistance)
		this.renderSquarePadding(mouseDistance)
		this.renderSquareDistance(mouseDistance)

        window.requestAnimationFrame(() => this.render());
	}
}






/* Init */

const magnetic = new MagneticObject({
	target: document.querySelector('main'),
	entryArea: {
		name: 'square-padding',
		areaDistance: 100,
		areaPadding: 0,
		onMouseEnter: () => {
			console.log('Entered - parent')
		}
	},
	leaveArea: {
		name: 'square-padding',
		areaDistance: 150,
		areaPadding: 50,
		translateFactor: .3,
		maxDistance: null,
		onMouseLeave: () => {
			console.log('Leave - parent')
		}
	},
	animation: {
		target: document.querySelectorAll('.magnetic__button')[0],
		duration: .6
	}
})

const magneticChild = new MagneticObject({
	target: document.querySelector('main'),
	entryArea: {
		name: 'square-padding',
		areaDistance: 100,
		areaPadding: 0,
		onMouseEnter: () => {
			console.log('Entered - child')
		}
	},
	leaveArea: {
		name: 'square-padding',
		areaDistance: 150,
		areaPadding: 50,
		translateFactor: .1,
		maxDistance: 10,
		onMouseLeave: () => {
			console.log('Leave - child')
		}
	},
	animation: {
		target: document.querySelectorAll('.magnetic__button')[0].children[0],
		duration: .6
	}
})

/*
	target -> target for math calculations. In/Out detection
	animation.target -> target to animate

	Circle:
		Description: Distance calculated from center of target ( in circular shape : radius )
		Entry: areaDistance, areaPadding
		Leave: areaDistance, areaPadding

	Square padding:
		Description: Distance calculated from top, left, right, bottom of rect
			Default distance is rect of target
		Entry: areaPadding
		Leave: areaPadding

	Square distance:
		Description: Distance calculated from center of target  (in square shape : top, bottom, left, right )
		Entry: areaPadding
		Leave: areaPadding

*/