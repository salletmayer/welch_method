export class Complex {
    public _real: number
    public _imag: number

    constructor(real: number, imag: number) {
        this._real = real
        this._imag = imag
    }

    get() {
        return [this._real, this._imag]
    }

    toScalar() {
        return Math.sqrt(Math.pow(this._real, 2) + Math.pow(this._imag, 2))
    }

    static exp(comp: Complex) {
        const y = Math.sqrt(Math.pow(comp._real, 2) + Math.pow(comp._imag, 2))

        return new Complex(Math.exp(comp._real) * Math.cos(y), Math.exp(comp._real) * Math.sin(y))
    }

    static multiply(complex_a: Complex, complex_b: Complex) {
        const a_squared = complex_a._real * complex_b._real
        const two_ab = complex_a._real * complex_b._imag + complex_a._imag * complex_b._real
        const b_squared = complex_a._imag * complex_b._imag

        return new Complex(a_squared + b_squared, two_ab)
    }

    static add(complex_a: Complex, complex_b: Complex) {
        return new Complex(complex_a._real + complex_b._real, complex_a._imag + complex_b._imag)
    }

    static subtract(complex_a: Complex, complex_b: Complex) {
        return new Complex(complex_a._real - complex_b._real, complex_a._imag - complex_b._imag)
    }
}