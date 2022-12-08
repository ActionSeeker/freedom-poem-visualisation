export default class EMath {
    constructor() {}

    public parameteriseX(t: number, amplitude: number = 1): number {
        return amplitude * Math.sin(3 * (t + amplitude) + Math.PI / 4)
    }

    public parameteriseY(t: number, amplitude: number = 1): number {
        return amplitude * Math.sin(4 * (t + amplitude))
    }
}
