class MagneticObject{
	constructor({ target, entryArea, leaveArea, animation, helper }){
		/* User data */
		this.target = target
		this.rect = this.target.getBoundingClientRect()
		this.entryArea = entryArea
		this.leaveArea = leaveArea
		this.animation = animation
		this.isHelper = helper


		/* Set default values */
		this.entryArea.distance ??= 0
		this.leaveArea.distance ??= 0
		this.leaveArea.translateFactor ??= 1
		this.leaveArea.maxDistance ??= null
		this.animation.target ??= this.target
		this.animation.easeEntry ??= ''
		this.animation.easeLeave ??= ''
		this.animation.duration ??= 1
		this.isHelper ??= false

		/* Magnetic Data */
		this.previouslyLeft = true
		this.hasMouseEntered = false
		this.mouse = { x: 0, y: 0 }
		this.helper = { entry: { }, leave: { } }



		/* Events */
		window.addEventListener('mousemove', ({ clientX: x, clientY: y }) => 
			this.mouse = { x, y })

		window.addEventListener('resize', () => 
			this.rect = this.target.getBoundingClientRect())

		window.addEventListener('scroll', () => 
			this.rect = this.target.getBoundingClientRect())


		/* Helper */
		this.isHelper && this.addHelper()


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


	/* Helper */
	addHelper = () => {
		const entry = document.createElement('magnetic-helper-entry'),
			leave = document.createElement('magnetic-helper-leave')
		
		document.body.appendChild(entry)
		document.body.appendChild(leave)

		this.helper.entryDOM = entry
		this.helper.leaveDOM = leave

		this.updateHelper()

		window.addEventListener('resize', () => this.updateHelper())
		window.addEventListener('scroll', () => this.updateHelper())
	}

	updateHelper = () => {
		// Circle Entry
		if( this.entryArea.name === 'circle' ){
			const size = 2 * this.entryArea.distance

			this.helper.entry = {
				x: window.pageXOffset + this.rect.left + ( this.rect.width / 2 ) - ( size / 2 ),
				y: window.pageYOffset + this.rect.top + ( this.rect.height / 2 ) - ( size / 2 ),
				width: size,
				height: size,
				radius: 100,
			}
		}

		// Circle Leave
		if(this.leaveArea.name === 'circle'){
			const size = 2 * this.leaveArea.distance

			this.helper.leave = {
				x: window.pageXOffset + this.rect.left + ( this.rect.width / 2 ) - ( size / 2 ) ,
				y: window.pageYOffset + this.rect.top + ( this.rect.height / 2 ) - ( size / 2 ),
				width: size,
				height: size,
				radius: 100,
			}
		}

		// Square padding Entry
		if( this.entryArea.name === 'square-padding' ){
			this.helper.entry = {
				x: window.pageXOffset + this.rect.left - this.entryArea.distance,
				y: window.pageYOffset + this.rect.top - this.entryArea.distance,
				width: this.rect.width + ( 2 * this.entryArea.distance ),
				height: this.rect.height + ( 2 * this.entryArea.distance ),
				radius: 0,
			}
		}

		// Square padding Leave
		if(this.leaveArea.name === 'square-padding'){
			this.helper.leave = {
				x: window.pageXOffset + this.rect.left - this.leaveArea.distance,
				y: window.pageYOffset + this.rect.top - this.leaveArea.distance,
				width: this.rect.width + ( 2 * this.leaveArea.distance ),
				height: this.rect.height + ( 2 * this.leaveArea.distance ),
				radius: 0,
			}
		}

		// Square distance Entry
		if( this.entryArea.name === 'square-distance' ){
			const size = 2 * this.entryArea.distance

			this.helper.entry = {
				x: window.pageXOffset + this.rect.left + ( this.rect.width / 2 ) - ( size / 2 ),
				y: window.pageYOffset + this.rect.top + ( this.rect.height / 2 ) - ( size / 2 ),
				width: size,
				height: size,
				radius: 0,
			}
		}

		// Square distance Leave
		if(this.leaveArea.name === 'square-distance'){
			const size = 2 * this.leaveArea.distance

			this.helper.leave = {
				x: window.pageXOffset + this.rect.left + ( this.rect.width / 2 ) - ( size / 2 ),
				y: window.pageYOffset + this.rect.top + ( this.rect.height / 2 ) - ( size / 2 ),
				width: size,
				height: size,
				radius: 0,
			}
		}

		
		const entry = this.helper.entryDOM,
			leave = this.helper.leaveDOM

		entry.style.position = 'absolute'
		entry.style.top = this.helper.entry.y + 'px'
		entry.style.left = this.helper.entry.x + 'px'
		entry.style.width = this.helper.entry.width + 'px'
		entry.style.height = this.helper.entry.height + 'px'
		entry.style.borderRadius = this.helper.entry.radius + '%'
		entry.style.border = '1px dashed red'


		leave.style.position = 'absolute'
		leave.style.top = this.helper.leave.y + 'px'
		leave.style.left = this.helper.leave.x + 'px'
		leave.style.width = this.helper.leave.width + 'px'
		leave.style.height = this.helper.leave.height + 'px'
		leave.style.borderRadius = this.helper.leave.radius + '%'
		leave.style.border = '1px dashed blue'
	}

	removeHelper = () => {
		this.helper.entryDOM.remove()
		this.helper.leaveDOM.remove()

		this.helper = null
		this.isHelper = false
	}


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
			)`,
			ease: this.animation.easeEntry,
		})
	}

	animateFalloff = () => 
		gsap.to(this.animation.target, this.animation.duration, {
			transform: 'translate(0px, 0px)',
			ease: Back.easeOut,
			ease: this.animation.easeLeave,
		})

	
	/* Detection of In/Out - MAIN */
	renderCircle = mouseDistance => {
		/* CIRCLE ENTRY */
		if( this.entryArea.name === 'circle'
			&& mouseDistance <= this.entryArea.distance
			&& !this.hasMouseEntered ){

				this.hasMouseEntered = true
				this.previouslyLeft = false

				this.entryArea.onMouseEnter()
		}

		/* CIRCLE LEAVE */
		if( this.leaveArea.name === 'circle'  
			&& mouseDistance <= this.leaveArea.distance
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
			&& this.mouse.x > this.rect.left - this.entryArea.distance 
			&& this.mouse.x < this.rect.right + this.entryArea.distance 
			&& this.mouse.y > this.rect.top - this.entryArea.distance 
			&& this.mouse.y < this.rect.bottom + this.entryArea.distance
			&& !this.hasMouseEntered ){

				this.hasMouseEntered = true
				this.previouslyLeft = false

				this.entryArea.onMouseEnter()
		}

		/* SQUARE PADDING LEAVE */
		if( this.leaveArea.name === 'square-padding'
			&& this.mouse.x > this.rect.left - this.leaveArea.distance 
			&& this.mouse.x < this.rect.right + this.leaveArea.distance 
			&& this.mouse.y > this.rect.top - this.leaveArea.distance 
			&& this.mouse.y < this.rect.bottom + this.leaveArea.distance
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
			&& this.mouse.x > centerX - this.entryArea.distance 
			&& this.mouse.x < centerX + this.entryArea.distance 
			&& this.mouse.y > centerY - this.entryArea.distance 
			&& this.mouse.y < centerY + this.entryArea.distance
			&& !this.hasMouseEntered ){

				this.hasMouseEntered = true
				this.previouslyLeft = false

				this.entryArea.onMouseEnter()
		}

		/* SQUARE DISTANCE LEAVE */
		if( this.leaveArea.name === 'square-distance'
			&& this.mouse.x > centerX - this.leaveArea.distance 
			&& this.mouse.x < centerX + this.leaveArea.distance 
			&& this.mouse.y > centerY - this.leaveArea.distance 
			&& this.mouse.y < centerY + this.leaveArea.distance
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
		distance: 50,
		onMouseEnter: () => {
			console.log('Entered - parent')
		}
	},
	leaveArea: {
		name: 'square-padding',
		distance: 80,
		translateFactor: .3,
		maxDistance: null,
		onMouseLeave: () => {
			console.log('Leave - parent')
		}
	},
	animation: {
		target: document.querySelectorAll('.magnetic__button')[0],
		duration: .6,
		easeEntry: Power2.easeOut,
		easeLeave: Back.easeOut,
	},
	helper: true
})

const magneticChild = new MagneticObject({
	target: document.querySelector('main'),
	entryArea: {
		name: 'square-padding',
		distance: 50,
		onMouseEnter: () => {
			console.log('Entered - child')
		}
	},
	leaveArea: {
		name: 'square-padding',
		distance: 80,
		translateFactor: .1,
		maxDistance: 5,
		onMouseLeave: () => {
			console.log('Leave - child')
		}
	},
	animation: {
		target: document.querySelectorAll('.magnetic__button')[0].children[0],
		duration: .6,
		easeEntry: Power2.easeOut,
		easeLeave: Back.easeOut,
	},
	helper: false
})

/*
	Not needed any css styling to work
	HTML Structureless, plug in anything you want


	target -> target for math calculations. In/Out detection
	animation.target -> target to animate


	Circle:
		Description: Distance calculated from center of target ( in circular shape : radius )

	Square padding:
		Description: Distance calculated from top, left, right, bottom of rect
			Default distance is rect of target

	Square distance:
		Description: Distance calculated from center of target  (in square shape : top, bottom, left, right )
*/