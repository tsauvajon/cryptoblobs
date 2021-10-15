const { spline } = require("@georgedoescode/spline")
const { SVG } = require("@svgdotjs/svg.js")

// Mulberry32 algorithm
function randomWithSeed(seed) {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296.0;
}

// // choose a number within a range, integer (whole number) by default
// function random(min, max, float = false) {
//     const val = Math.random() * (max - min) + min;

//     if (float) {
//         return val;
//     }

//     return Math.floor(val);
// }

export class BlobCharacter {
    constructor(width, height, target, seed) {
        // viewBox width & height dimensions
        this.width = width;
        this.height = height;

        // position of our character within the viewBox (the center)
        this.x = this.width / 2;
        this.y = this.height / 2;

        this.seed = seed

        // <svg /> element (svg.js instance) we are using to render
        this.svg = SVG()
            .addTo(target) // mount instance to our target
            .viewbox(0, 0, this.width, this.height); // set the <svg /> viewBox attribute

        // choose a random size / radius for our character
        this.size = this.random(50, 80);

        this.setColors();

        this.svg.node.style.background = this.lightColor;
    }

    random(min, max, float = false) {
        let value = randomWithSeed(this.seed)

        value = value * (max - min) + min
        this.seed = Math.floor(value)
        value = float ? value : this.seed

        return value
    }

    drawBody() {
        // how many points do we want?
        const numPoints = this.random(3, 12);
        // step used to place each point at equal distances
        const angleStep = (Math.PI * 2) / numPoints;

        // keep track of our points
        const points = [];

        for (let i = 1; i <= numPoints; i++) {
            // how much randomness should be added to each point
            const pull = this.random(0.75, 1, true);

            // x & y coordinates of the current point

            // cos(theta) * radius + a little randomness thrown in
            const x = this.x + Math.cos(i * angleStep) * (this.size * pull);
            // sin(theta) * radius + a little randomness thrown in
            const y = this.y + Math.sin(i * angleStep) * (this.size * pull);

            // push the point to the points array
            points.push({ x, y });
        }

        // generate a smooth continuous curve based on the points, using bezier curves. spline() will return an svg path-data string. The arguments are (points, tension, close). Play with tension and check out the effect!
        const pathData = spline(points, 1, true);

        // render the body in the form of an svg <path /> element!
        this.svg
            .path(pathData)
            .stroke({
                width: 2,
                color: this.darkColor
            })
            .fill(this.primaryColor);
    }

    drawEyes() {
        // ensure the width of two eyes never exceeds 50% of the characters body size
        const maxWidth = this.size / 2;
        // if a random number between 0 and 1 is greater than 0.75, the character is a cyclops!
        const isCyclops = this.random(0, 1, true) > 0.75;
        // the size of each (or only) eye.
        const eyeSize = this.random(maxWidth / 2, maxWidth);

        if (isCyclops) {
            // draw just 1 eye, in the center of the character
            this.drawEye(this.x, this.y, eyeSize);
        } else {
            // draw 2 eyes, equidistant from the center of the character
            this.drawEye(this.x - maxWidth / 2, this.y, eyeSize);
            this.drawEye(this.x + maxWidth / 2, this.y, eyeSize);
        }
    }

    // x position, y position, radius / size
    drawEye(x, y, size) {
        // create a new svg <group /> to add all the eye content too
        const eye = this.svg.group();
        // <group /> elements do not have an x and y attribute, so we need to "transform" it to the right position
        eye.transform({ translateX: x, translateY: y });

        // add the outer ring of the eye (an svg <circle /> element) to our eye <group />
        eye
            .circle(size)
            // cx / cy are the { x, y } values for the svg <circle /> element
            .cx(0)
            .cy(0)
            .stroke({
                width: 2,
                color: this.darkColor
            })
            .fill(this.lightColor);

        // add the inner part of the eye (another svg <circle /> element) to our eye <group />
        eye
            .circle(size / 2)
            .cx(0)
            .cy(0)
            .fill(this.darkColor);
    }

    setColors() {
        // random hue
        const hue = this.random(0, 360);
        // random saturation, keeping it quite high here as a stylistic preference
        const saturation = this.random(75, 100);
        // random lightness, keeping it quite high here as a stylistic preference
        const lightness = this.random(75, 95);

        // base color
        this.primaryColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        // almost black, slightly tinted with the base color
        this.darkColor = `hsl(${hue}, ${saturation}%, 2%)`;
        // almost white, slightly tinted with the base color
        this.lightColor = `hsl(${hue}, ${saturation}%, 98%)`;
    }

    draw() {
        // clear the <svg /> element
        this.svg.clear();
        // generate new colors
        this.setColors();
        // set the svg background color
        this.svg.node.style.background = this.lightColor;
        // generate a new body shape and render it
        this.drawBody();
        // genearte new eye(s) and render them
        this.drawEyes();
    }
}


// viewBox w x h, target to append the <svg /> element to
// const character = new BlobCharacter(200, 200, document.body);

// draw the initial character
// character.draw();

// setInterval(() => {
//     // every 1.5s after the initial render, draw a new character
//     character.draw();
// }, 1500);
