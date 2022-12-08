import EMath from './extended-math'
import { FileSystem } from './fileSystem'
export class CanvasManipuilator {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    private filesystem: FileSystem
    private extendedMath: EMath

    private lettersOfPoem: string[]
    private precomputedCircleProps: any[]
    private precomputedX: number[] = []
    private precomputedY: number[] = []

    private parameter: number = 0

    private maxCirclesPerRow: number

    constructor(identifier: string) {
        this.canvas = document.getElementById(identifier) as HTMLCanvasElement
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D

        this.strechCanvasToViewPort()
        this.addResizeEventListener()

        this.filesystem = new FileSystem()
        this.extendedMath = new EMath()

        this.initPreCompute()
        // this.drawSomeCrazyStuff()
        this.animate()
    }

    private strechCanvasToViewPort() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    /**
     * We break down this problem into two components
     *
     * Precomputation of circles
     * We need to precompute circles so that they could continue to move around
     * At every step they have to be redrawn and we need to precomputer their `color` and `radius`
     *
     * Precomputation of paths
     * A curve or as a paramettric function of time it would then set a new x and y everytime
     * i.e. x = f(t) and y = g(t)
     * At every frame then the new point for each circle shall be chosen
     */
    private initPreCompute() {
        this.lettersOfPoem = this.filesystem.getCharsFromPoem()
        const analysis = this.filesystem.letterDistanceAnalysis()
        const randomMathFn = this.randomiser()

        this.precomputedCircleProps = analysis.reduce(
            (list: any[], value: number) => {
                let maxRadius = Math.abs(randomMathFn(Math.abs(value))) * 50
                let rndAmplfier = Math.random() * 1.5 + 1
                maxRadius = maxRadius * rndAmplfier

                let color = this.generateRandomColour()

                list.push({ maxRadius, color })
                return list
            },
            []
        )

        let maxElements = analysis.length
        let parameter = 0
        let amplitude = Math.floor((Math.random() * this.canvas.width) / 2) + 1
        while (maxElements--) {
            this.precomputedX.push(
                this.canvas.width / 2 +
                    this.extendedMath.parameteriseX(parameter, amplitude)
            )
            this.precomputedY.push(
                this.canvas.height / 2 +
                    this.extendedMath.parameteriseY(parameter, amplitude)
            )
            parameter++
        }

        this.maxCirclesPerRow = Math.floor(Math.sqrt(analysis.length))
    }

    private drawSomeCrazyStuff() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        let $ltx = 0
        /**
         * Kontrollvariable `t` sollte vorgestellt werden
         * sodass die Bahnkoordinaten x und y selbst definiert werden
         **/
        this.precomputedCircleProps.forEach((props, $idx) => {
            let letter = this.lettersOfPoem[$ltx++ % this.lettersOfPoem.length]
            this.performCircleAlphabetMagic(
                this.precomputedX[this.parameter + $idx],
                this.precomputedY[this.parameter + $idx],
                props.maxRadius,
                props.color,
                letter
            )
        })
    }

    private performCircleAlphabetMagic(
        x: number,
        y: number,
        radius: number,
        color: string,
        letter: string
    ) {
        this.drawCircle(x, y, radius, color, color)
        this.drawCircle(x, y, radius * 0.85)
        this.drawCircle(x, y, radius * 0.8, color, color)
        this.drawCircle(x, y, radius * 0.45)
        this.drawCircle(x, y, radius * 0.4, color, color)

        this.drawText(x, y, radius * 0.5, letter)
    }

    private drawText(x: number, y: number, size: number, letter: string) {
        this.context.font = `${size}px Arial`
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.strokeStyle = '#fff'
        this.context.fillStyle = '#fff'
        this.context.fillText(letter, x, y)
    }

    private generateRandomColour(): string {
        return `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(
            Math.random() * 99
        )}%, ${Math.floor(Math.random() * 99)}%)`
    }

    private randomiser(): Function {
        const operations: Function[] = [
            (x: number) =>
                Math.log(Math.sin(((x * x + 2 * x) * 180) / Math.PI)),
            (x: number) => Math.sin(x),
            (x: number) =>
                Math.pow(
                    Math.sqrt(Math.E * Math.pow(Math.tanh(x), 10)),
                    Math.expm1(Math.sin(x))
                ),
            (x: number) => Math.sin(Math.pow(x, Math.PI)),
            (x: number) => Math.sqrt(5 * Math.sin(x) * Math.cos(x)),
        ]
        // return operations[Math.floor(Math.random() * operations.length)]
        return operations[1]
    }

    private drawCircle(
        x: number,
        y: number,
        radius: number,
        strokeStyle: string = '#fff',
        fillStyle: string = '#fff'
    ) {
        this.context.beginPath()
        this.context.moveTo(x + radius, y)
        this.context.arc(x, y, radius, 0, 2 * Math.PI)
        this.context.strokeStyle = strokeStyle
        this.context.fillStyle = fillStyle
        this.context.stroke()
        this.context.fill()
    }

    private animate() {
        this.drawSomeCrazyStuff()
        this.parameter =
            (this.parameter + 1) % this.precomputedCircleProps.length
        let fps = 30
        setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this))
        }, 1000 / fps)
    }

    private addResizeEventListener() {
        window.addEventListener('resize', () => {
            this.strechCanvasToViewPort()
            this.drawSomeCrazyStuff()
        })
    }
}
