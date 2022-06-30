// https://codepen.io/connorhansen/pen/gOgwzpw
// gsap.to()... infinity and beyond!
// For more check out greensock.com

const ITEMS = document.querySelectorAll(".mq-row");

ITEMS.forEach( (element, i) => {
	const row_width = element.getBoundingClientRect().width;
	const row_item_width = element.children[0].getBoundingClientRect().width;
	const initial_offset = ((2 * row_item_width) / row_width) * 100 * -1;

	gsap.set(element, {
		xPercent: `${initial_offset}`
	});

    // Change speed for each other element
	const duration = 5 * (i + 2);

	const tl = gsap.timeline();

	tl.to(element, {
		ease: "none",
		duration: duration,
		xPercent: 0,
		repeat: -1
	});

    ScrollTrigger.create({
        trigger: ".trigger-point",
        start: "top bottom",
        end: "bottom top",
        markers: true,
        onUpdate: self => {
            const velocity = self.getVelocity() / 800,
                maxVelocity = 5

            calcMaxVelocity = () => {
                if(velocity >= 0){
                    return velocity >= maxVelocity ? maxVelocity : velocity
                }else{
                    return velocity <= -maxVelocity ? -maxVelocity : velocity
                } 
            }

            console.log('velocity', calcMaxVelocity())

            // Change velocity/inertia of animation on scroll
            tl.timeScale( calcMaxVelocity() );

            // Change direction on scroll
            direction = self.direction
        }
    });
});
