import { Complex } from './Complex';

/**
 * Uses a recursive fft function to transform time series to frequency domain. Very simple Cooley Tukey implementation.
 */
export function fft(x: number[], fs: number, nfft: number) {
    //Fill with zeros if nfft greater than x length
    for (let i = x.length; i < nfft; i++) x.push(0);

    let x_complex: Complex[] = new Array(x.length);
    for (let i = 0; i < x_complex.length; i++) x_complex[i] = new Complex(x[i], 0);

    x_complex = rec_fft(x_complex);

    for (let i = 0; i < x.length; i++) x[i] = x_complex[i].toScalar();

    return x;
}

function rec_fft(x: Complex[]) {
    const N = x.length;

    /**
     * Look if data cannot be split further
     */
    if (N <= 1) return x;

    /**
     * Split data
     */
    let even: Complex[] = new Array();
    let odd: Complex[] = new Array();
    for (let i = 0; i < Math.floor(N / 2); i++) {
        even.push(x[2 * i]);
        odd.push(x[2 * i + 1]);
    }

    /**
     * Rec FFT
     */
    even = rec_fft(even);
    odd = rec_fft(odd);

    /**
     * Freq trans
     */
    for (let k = 0; k < Math.floor(N / 2); k++) {
        let t = Complex.multiply(Complex.exp(new Complex(0, (-2 * Math.PI * k) / N)), odd[k]);
        x[k] = Complex.add(even[k], t);
        x[Math.floor(N / 2) + k] = Complex.subtract(even[k], t);
    }

    return x;
}
