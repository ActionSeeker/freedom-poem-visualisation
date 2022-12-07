import * as fs from 'fs'
import * as path from 'path'

export class FileSystem {
    private poem: string = 'poem.txt'
    private pathToPoem: string
    private alphabets: string = 'alphabet.txt'
    private pathToAlphabets: string

    constructor({
        poem,
        alphabets,
    }: { poem?: string; alphabets?: string } = {}) {
        this.pathToPoem = path.join(
            __dirname,
            path.sep,
            'literature',
            this.poem
        )
        this.pathToAlphabets = path.join(
            __dirname,
            path.sep,
            'literature',
            this.alphabets
        )
    }

    public readPoem(): string {
        return fs.readFileSync(this.pathToPoem, 'utf-8')
    }

    public readAlphabets(): Record<string, number> {
        const alphabets: string = fs.readFileSync(this.pathToAlphabets, 'utf-8')
        const list: string[] = alphabets.split('\n')
        return list.reduce(
            (obj: Record<string, number>, currVal: string, currIdx: number) => {
                obj[currVal] = currIdx + 1
                return obj
            },
            {}
        )
    }

    public wordCountAnalysis(): Record<string, number> {
        const poem = this.readPoem().split('')
        const alphabets = this.readAlphabets()
        return poem.reduce(
            (obj: Record<string, number>, currLetter: string) => {
                const lowercase = currLetter.toLocaleLowerCase()
                if (alphabets[lowercase]) {
                    obj[lowercase] = obj[lowercase] ? obj[lowercase] + 1 : 1
                }
                return obj
            },
            {}
        )
    }

    public letterDistanceAnalysis(): number[] {
        const poem = this.readPoem().split('')
        const alphabets = this.readAlphabets()
        let last: string, current: string
        return poem.reduce((obj: number[], currLetter: string) => {
            const lowercase = currLetter.toLocaleLowerCase()
            if (alphabets[lowercase]) {
                if (!last) last = lowercase
                current = lowercase
                obj.push(alphabets[current] - alphabets[last])
                last = current
            }
            return obj
        }, [])
    }

    public getCharsFromPoem(): string[] {
        const poemText = this.readPoem().split('')
        const alphabets = Object.keys(this.readAlphabets())
        return poemText.filter((p) => alphabets.indexOf(p) !== -1)
    }
}
