/**
 * bc: backgroundColor
 * dc: dotColor
 */
const animate = (backgroundColor, pointColor) => {
    const canvas = document.getElementById("scene");
    const ctx = canvas.getContext("2d");
    const points = [];
    const fov = 100;
    const dist = 100;
    const opacity = 0.5;
    const particleSize = 2;
    const maxAmplitude = 1500; // Best results with values > 500
    const sideLength = 50; // How many particles per side
    const spacing = 200; // Particle distance from each other

    if (!backgroundColor) {
        backgroundColor = {
            r: 0,
            g: 0,
            b: 0
        }
    }

    let rotXCounter = 0;
    let rotYCounter = 0;
    let rotZCounter = 0;
    let counter = 0;

    window.addEventListener('resize', (event) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = "#0D0";
    }

    Vector3.prototype.rotateX = function(angle) {
        const z = this.z * Math.cos(angle) - this.x * Math.sin(angle);
        const x = this.z * Math.sin(angle) + this.x * Math.cos(angle);
        return new Vector3(x, this.y, z);
    };

    Vector3.prototype.rotateY = function(angle) {
        const y = this.y * Math.cos(angle) - this.z * Math.sin(angle);
        const z = this.y * Math.sin(angle) + this.z * Math.cos(angle);
        return new Vector3(this.x, y, z);
    };
    Vector3.prototype.rotateZ = function(angle) {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector3(x, y, this.z);
    };

    Vector3.prototype.perspectiveProjection = function(fov, viewDistance) {
        const factor = fov / (viewDistance + this.z);
        const x = this.x * factor + canvas.width / 2;
        const y = this.y * factor + canvas.height / 2;
        return new Vector3(x, y, this.z);
    };
    Vector3.prototype.draw = function() {
        const frac = this.y / maxAmplitude;
        // debugger;
        // if (!dotColor) {
        //     dotColor = {
        //         r: Math.floor(frac * 100),
        //         g: 20,
        //         b: Math.floor(255 - frac * 100)
        //     }
        // }
        
        const r = (pointColor && pointColor.r) || Math.floor(frac * 100);
        const g = (pointColor && pointColor.g) || 20;
        const b = (pointColor && pointColor.b) || Math.floor(255 - frac * 100);
        const vec = this.rotateX(rotXCounter).rotateY(rotYCounter).rotateZ(rotZCounter).perspectiveProjection(fov, dist);

        // this.color = `rgb(${dotColor.r}, ${dotColor.g}, ${dotColor.b})`;
        // console.log(this.color)
        this.color = `rgb(${r}, ${g}, ${b})`;
        // console.log(this.color)
        ctx.fillStyle = this.color;
        ctx.fillRect(vec.x, vec.y, particleSize, particleSize);
    };

    // Init
    for (let z = 0; z < sideLength; z++) {
    for (let x = 0; x < sideLength; x++) {
        const xStart = -(sideLength * spacing) / 2;
        points.push(
            new Vector3(xStart + x * spacing, 0, xStart + z * spacing)
            );
        }
    }



    (function loop() {
        const bc = backgroundColor;
        // debugger;
        // ctx.fillStyle = `rgba(${bc.r}, ${bc.g}, ${bc.b}, ${opacity})`;
        // ctx.fillStyle =  "linear-gradient(90deg, rgba(114,76,253,1) 0%, rgba(19,127,237,1) 100%)";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0, max = points.length; i < max; i++) {
            const x = i % sideLength;
            const z = Math.floor(i / sideLength);
            const xFinal = Math.sin(x / sideLength * 4 * Math.PI + counter);
            const zFinal = Math.cos(z / sideLength * 4 * Math.PI + counter);
            const gap = maxAmplitude * 0.3;
            const amp = maxAmplitude - gap;

            points[z * sideLength + x].y = maxAmplitude + xFinal * zFinal * amp;

            points[i].draw();
        }
        counter += 0.01;
        // counter += 0.03;

        // rotXCounter += 0.005;
        // rotYCounter += 0.005;
        rotXCounter += 0.0005;
        rotYCounter += 0.0005;
        // rotZCounter += 0.005;

        window.requestAnimationFrame(loop);
    })();

}

export default animate;