if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

class Scroll{
    constructor(){
        this.touchValue = () => window.innerHeight * .1
        this.contentEl = 'fp__content'
        this.timeoutDelay = 250

        this.touchStart
        this.wheeling
        this.scrollAtEnd = false
        this.prevDirection = 'down'

        document.addEventListener('wheel', this.wheelHandler)
        document.addEventListener('touchstart', this.touchStartHandler )
        document.addEventListener('touchend', this.wheelHandler )
    }

    /* Direction Handlers */

    wheelHandler = (e) => {
        const eventType = e.constructor.name
        const rect = e.path.find(e => e.classList.contains(this.contentEl)).getBoundingClientRect()
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
        if(isFullScreen) {
            console.log(direction)

            this.scrollAtEnd = false
        }

        if(!isFullScreen){
            if(!this.wheeling) console.log('Start wheeling!')

            clearTimeout(this.wheeling)
            this.wheeling = setTimeout(() => {
                this.wheeling = null
                
                console.log('Stop wheeling!')

                if(this.scrollAtEnd === true){
                    console.log('CAN SCROLL', direction)

                    this.scrollAtEnd = false

                    return
                }

                this.scrollAtEnd = true
            }, this.timeoutDelay)
        }
    }
}

new Scroll()



// document.addEventListener('touchend', this.touchEndHandler )

   // wheelHandler = (e) => {
    //     const rect = e.path.find(e => e.classList.contains('fp__content')).getBoundingClientRect()

    //     if( Math.abs(rect.y) + window.innerHeight === rect.height && rect.bottom === rect.height){
            
    //         if(e.deltaY < 0) this.scrollHandler('up')
    //         if(e.deltaY > 0) this.scrollHandler('down')

    //         return
    //     }

    //     if(rect.bottom === rect.height){
    //         if(e.deltaY < 0) this.scrollHandler('up')

    //         return
    //     }

    //     if(Math.abs(rect.y) === rect.bottom){
    //         if(e.deltaY > 0) this.scrollHandler('down')

    //         return
    //     }
    // }

    // wheelHandler = ({ deltaY }) => {
    //     if(deltaY < 0) this.scrollHandler('up')
    //     if(deltaY > 0) this.scrollHandler('down')
    // }

    // touchEndHandler = ({ changedTouches : [{ clientY : touchEnd }] }) => {
    //     const distance = this.touchStart - touchEnd

    //     if(this.touchStart < touchEnd && distance < -this.touchValue()) this.scrollHandler('up')
    //     if(this.touchStart > touchEnd && distance > this.touchValue()) this.scrollHandler('down')
    // }