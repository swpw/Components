if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

class Scroll{
    constructor(){
        this.touchValue = () => window.innerHeight * .1
        this.contentEl = 'fp__content'
        this.timeoutDelay = 50
        this.itemsEl = document.querySelectorAll('.fp__item')

        this.touchStart
        this.wheeling
        this.scrollAtEnd = false
        this.canScroll = true
        this.prevDirection = 'down'
        this.currentPage = 0
        this.currentScrollEventCount = 0
        this.maxScrollEventCount = 80

        this.indexItemEls()
        this.setItemElsPositions()

        document.addEventListener('wheel', this.wheelHandler)
        document.addEventListener('touchstart', this.touchStartHandler )
        document.addEventListener('touchend', this.wheelHandler )
    }

    /* Utils */

    indexItemEls = () => this.itemsEl.forEach((e, i) => e.setAttribute('fp-index', i))

    setItemElsPositions = () => this.itemsEl.forEach((e, i) => 
        i !== 0 && gsap.to(e, {
            duration: 0,
            y: '100vh',
            autoAlpha: 0,
        })
    )

    lastItemEl = () => parseInt(document.querySelectorAll('[fp-index]')[ document.querySelectorAll('[fp-index]').length - 1 ].getAttribute('fp-index'))

    /* Direction Handlers */

    wheelHandler = (e) => {
        const eventType = e.constructor.name
        const target = e.path.find(e => e.classList.contains(this.contentEl))
        const rect = target.getBoundingClientRect()
        const touchEnd = eventType === 'TouchEvent' && e.changedTouches[0].clientY
        const touchDistance = this.touchStart - touchEnd

        
        if(eventType === 'WheelEvent'){
            if(e.deltaY < 0) {
                if(this.prevDirection !== 'up') this.scrollAtEnd = false

                this.prevDirection = 'up'
            }

            if(e.deltaY > 0) {
                if(this.prevDirection !== 'down') this.scrollAtEnd = false

                this.prevDirection = 'down'
            }
        }

        if(eventType === 'TouchEvent'){
            if(this.touchStart < touchEnd && touchDistance < -this.touchValue()) {
                if(this.prevDirection !== 'up') this.scrollAtEnd = false

                this.prevDirection = 'up'
            }

            if(this.touchStart > touchEnd && touchDistance > this.touchValue()) {
                if(this.prevDirection !== 'down') this.scrollAtEnd = false

                this.prevDirection = 'down'
            }
        }


        if( Math.abs(rect.y) + window.innerHeight === rect.height && rect.bottom === rect.height){
            if(eventType === 'WheelEvent'){
                if(e.deltaY < 0) this.scrollHandler(e, 'up', true)
                if(e.deltaY > 0) this.scrollHandler(e, 'down', true)
            }

            if(eventType === 'TouchEvent'){
                if(this.touchStart < touchEnd && touchDistance < -this.touchValue()) this.scrollHandler(e, 'up', true)
                if(this.touchStart > touchEnd && touchDistance > this.touchValue()) this.scrollHandler(e, 'down', true)
            }

            return
        }

        if(rect.bottom === rect.height){
            if(eventType === 'WheelEvent')
                if(e.deltaY < 0) this.scrollHandler(e, 'up')

            if(eventType === 'TouchEvent')
                if(this.touchStart < touchEnd && touchDistance < -this.touchValue()) this.scrollHandler(e, 'up')

            return
        }

        if(Math.abs(rect.y) === rect.bottom){
            if(eventType === 'WheelEvent')
                if(e.deltaY > 0) this.scrollHandler(e, 'down')

            if(eventType === 'TouchEvent')
                if(this.touchStart > touchEnd && touchDistance > this.touchValue()) this.scrollHandler(e, 'down')

            return
        }
    }

    touchStartHandler = ({ changedTouches : [{ clientY }] }) => 
        this.touchStart = clientY

    /* Scroll Handlers */

    scrollHandler = (e, direction, isFullScreen = false) => {
        this.currentScrollEventCount += 1

        if(this.maxScrollEventCount === this.currentScrollEventCount){
            this.scrollAtEnd = true
            this.scrollTo(direction)
        }

        if(isFullScreen && this.canScroll) {
            this.scrollTo(direction)
        }

        if(!isFullScreen){
            clearTimeout(this.wheeling)
            this.wheeling = setTimeout(() => {
                this.wheeling = null
                
                if(this.scrollAtEnd === true && this.canScroll){
                    this.scrollTo(direction)
                }

                this.scrollAtEnd = true
            }, this.timeoutDelay)
        }
    }

    scrollTo = (direction) => {
        this.currentScrollEventCount = 0

        if(this.currentPage === 0 &&  direction === 'up') return
        if(this.currentPage === this.lastItemEl() &&  direction === 'down') return

        this.canScroll = false

        if(direction === 'down'){
            gsap.to(this.itemsEl[ this.currentPage ], {
                scale: .9,
                duration: .5,
            })

            gsap.fromTo(this.itemsEl[ this.currentPage + 1 ], {
                scale: .9,
                y: '100vh',
                autoAlpha: 1,
            }, {
                y: 0,
                ease: Power2.easeOut,
                duration: 1,
                delay: .5,
            })

            gsap.to(this.itemsEl[ this.currentPage + 1 ], {
                scale: 1,
                ease: Power2.easeOut,
                duration: .5,
                delay: 1.5,
            })

            gsap.to(this.itemsEl[ this.currentPage ], {
                y: '-100vh',
                autoAlpha: 0,
                duration: 0,
                delay: 2,
                onComplete: () => {
                    this.scrollAtEnd = false
                    this.currentPage += 1
                    this.canScroll = true
                }
            })
        }

        if(direction === 'up'){
            gsap.to(this.itemsEl[ this.currentPage ], {
                scale: .9,
                duration: .5,
            })

            gsap.fromTo(this.itemsEl[ this.currentPage - 1 ], {
                y: '-100vh',
                autoAlpha: 1,
                zIndex: 1,
            }, {
                y: 0,
                ease: Power2.easeOut,
                duration: 1,
                delay: .5,
                clearProps: 'zIndex'
            })
            
            gsap.to(this.itemsEl[ this.currentPage ], {
                y: '100vh',
                autoAlpha: 0,
                duration: 0,
                delay: 1.5,
                onComplete: () => {
                    this.scrollAtEnd = false
                    this.currentPage -= 1
                    this.canScroll = true
                }
            })

            gsap.to(this.itemsEl[ this.currentPage - 1 ], {
                scale: 1,
                ease: Power2.easeOut,
                duration: .5,
                delay: 1.5,
            })
        }
    }
}

new Scroll()