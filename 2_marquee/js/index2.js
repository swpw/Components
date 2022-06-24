class Marquee{
	constructor({ target, duration }){
		this.target = target
		this.container = () => this.target.querySelectorAll('.marquee__container')
		this.duration = duration
		
		this.duplicate()
		this.render()
	}

	elementsInView = () => {
		const w_width = window.innerWidth
		const t_width = parseInt(getComputedStyle(this.container()[0]).width)

		const amount = Math.ceil(w_width / t_width) - 1

		return amount === 0 ? 1 : amount
	}

	duplicate = () => {
		const amount = this.elementsInView()

		// Clone elements inside container to fill screen
		for(let i = 0; i < amount; i++){
			this.container()[0].appendChild(this.container()[0].children[0].cloneNode(true))
		}

		// Clone container to smoothly tansition/change between visible and offscreen container
		this.target.appendChild(this.container()[0].cloneNode(true))
	}

	animFwrd = () => {

	}

	animBwrd = () => {

	}

	render = () => {
		this.animFwrd()

        window.requestAnimationFrame(() => this.render())
	}
}

// Init
const settings1 = {
	target: document.querySelectorAll('.marquee')[0],
	duration: 3
}

const marquee1 = new Marquee(settings1)