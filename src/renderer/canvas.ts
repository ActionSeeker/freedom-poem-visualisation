import { FileSystem } from './fileSystem'
export class CanvasManipuilator {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    private filesystem: FileSystem
    private counter: number
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
        this.animate()
    }

    private strechCanvasToViewPort() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    private drawAnalysis() {
        if (!this.counter) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
        let x = 0
        let y = 0
        let analysis = this.filesystem.letterDistanceAnalysis()

        const randomFunction = this.randomiser()
        const maxPerRow = Math.floor(Math.sqrt(analysis.length))
        analysis.forEach((value, $idx) => {
            this.context.beginPath()
            let radius = Math.abs(randomFunction(Math.abs(value))) * 50
            this.context.moveTo(x + radius, y)
            this.context.arc(x, y, radius, 0, 2 * Math.PI)
            const color = `hsl(
                ${Math.random() * 359},
                ${Math.random() * 99}%,
                ${Math.random() * 99}%`
            this.context.strokeStyle = color
            this.context.fillStyle = color
            this.context.stroke()
            this.context.fill()
            x = (x + radius) % this.canvas.width
            if ($idx % maxPerRow === 0) x = 0
            y += (Math.floor($idx / maxPerRow) + 1) % this.canvas.height
            console.log(radius, x, y)
        })
    }

    private randomiser(): Function {
        const operations: Function[] = [
            (x: number) => Math.sin(x),
            (x: number) =>
                Math.pow(
                    Math.sqrt(Math.E * Math.pow(Math.tanh(x), 10)),
                    Math.expm1(Math.sin(x))
                ),
            (x: number) => Math.sin(Math.pow(x, 2)),
            (x: number) => Math.sqrt(Math.sin(x) * Math.cos(x)),
        ]
        // return operations[Math.floor(Math.random() * operations.length)]
        return operations[1]
    }

    private animate() {
        this.drawAnalysis()
        setTimeout(() => {
            // this.counter = (this.counter + 1) % 10
            this.animate()
        }, 500)
        // requestAnimationFrame(this.animate.bind(this))
    }
}
