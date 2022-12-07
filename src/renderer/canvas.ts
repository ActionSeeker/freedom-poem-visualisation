import { FileSystem } from './fileSystem'
export class CanvasManipuilator {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private filesystem: FileSystem
    private counter: number
    private letters: string[]
    private analysis: number[]
    constructor(identifier: string) {
        this.canvas = document.getElementById(identifier) as HTMLCanvasElement
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.strechCanvasToViewPort()
        // Could be refactored
        window.addEventListener('resize', () => {
            this.strechCanvasToViewPort()
            this.drawAnalysis()
        })
        this.filesystem = new FileSystem()
        this.counter = 0

        this.letters = this.filesystem.getCharsFromPoem()
        this.analysis = this.filesystem.letterDistanceAnalysis()
        // this.drawAnalysis()
        this.animate()
    }

    private strechCanvasToViewPort() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    private drawAnalysis() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        let x = 0
        let y = 0

        let analysis = [...this.analysis]
        const randomFunction = this.randomiser()
        const maxPerRow = Math.floor(Math.sqrt(analysis.length))

        let $ltx = 0

        // analysis = analysis.concat(analysis)
        analysis.forEach((value, $idx) => {
            let radius = Math.abs(randomFunction(Math.abs(value))) * 50
            let randomAmplifier = Math.random() * 1.5 + 1
            radius = radius * randomAmplifier
            const angle = 2 * Math.PI
            const ccw = Math.random() < 0.5

            // let color = this.generateRandomColour()
            // this.drawSquare(x, y, radius, color, color)

            // Regenrate colour and shrink radius
            let color = this.generateRandomColour()
            radius = radius * 0.6
            this.drawCircle(x, y, radius, angle, ccw, color, color)
            this.drawCircle(x, y, radius * 0.85, angle, ccw)
            this.drawCircle(x, y, radius * 0.8, angle, ccw, color, color)
            this.drawCircle(x, y, radius * 0.45, angle, ccw)
            this.drawCircle(x, y, radius * 0.4, angle, ccw, color, color)

            this.drawText(x, y, radius * 0.5, this.letters[$ltx])
            $ltx = ($ltx + 1) % this.letters.length

            x = (x + radius) % this.canvas.width
            if ($idx % maxPerRow === 0) x = 0
            y = ($idx / maxPerRow + 1 + y) % this.canvas.height
        })
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
        return operations[0]
    }

    private drawCircle(
        x: number,
        y: number,
        radius: number,
        angle: number = 2 * Math.PI,
        counterclockwise: boolean = false,
        strokeStyle: string = '#fff',
        fillStyle: string = '#fff'
    ) {
        this.context.beginPath()
        this.context.moveTo(x + radius, y)
        this.context.arc(x, y, radius, 0, angle, counterclockwise)
        this.context.strokeStyle = strokeStyle
        this.context.fillStyle = fillStyle
        this.context.stroke()
        this.context.fill()
    }

    // private drawSquare(
    //     x: number,
    //     y: number,
    //     side: number,
    //     strokeStyle: string = '#fff',
    //     fillStyle: string = '#fff'
    // ) {
    //     this.context.beginPath()
    //     this.context.moveTo(x, y)
    //     this.context.rect(x, y, side, side)
    //     this.context.strokeStyle = strokeStyle
    //     this.context.fillStyle = fillStyle
    //     this.context.stroke()
    //     this.context.fill()
    // }

    private animate() {
        this.drawAnalysis()
        requestAnimationFrame(this.animate.bind(this))
    }
}
