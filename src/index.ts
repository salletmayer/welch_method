import * as detrend_func from './modules/Detrend';
import { window_function } from './modules/Windowing';
import { fft } from './modules/FFT';

export default function welch(
    x: number[],
    fs = 1.0,
    window:
        | 'hanning'
        | 'bartlett'
        | 'hamming'
        | 'rect'
        | ((n: number, window_width: number) => number) = 'hanning',
    nperseg: number | undefined = undefined,
    noverlap: number | undefined = undefined,
    nfft: number | undefined = undefined,
    detrend: 'linear' | 'constant' | 'none' | ((x: number[]) => number[]) = 'none',
    scaling: 'density' | 'spectrum',
) {
    if (typeof nperseg === 'undefined') nperseg = x.length;

    if (typeof noverlap === 'undefined') noverlap = Math.floor(nperseg / 2);

    if (typeof nfft === 'undefined') nfft = nperseg;

    /**
     * Create Windows
     */
    let windows = create_windows(x, nperseg, noverlap);

    /**
     * Detrend Windows
     */
    if (detrend !== 'none') windows = detrend_windows(windows, fs, detrend);

    /**
     * Multiply Windows with window function
     */
    for (let i = 0; i < windows.length; i++) {
        if (typeof window === 'function')
            windows[i] = window_function('custom', windows[i], window);
        else windows[i] = window_function(window, windows[i]);
    }

    /**
     * Create Frequency Spectrum
     */
    let fft_windows: number[][] = new Array();
    for (let i = 0; i < windows.length; i++)
        //TODO: Rescale for either density or spectrum
        fft_windows.push(fft(windows[i], fs, nfft));

    /**
     * Average all PSDs
     */
    const averaged_psd = average_columns(fft_windows);

    return averaged_psd;
}

function create_windows(x: number[], nperseg: number, noverlap: number) {
    //This would lead to an endless loop
    if (!(noverlap >= nperseg)) throw new Error('window size must be bigger than window overlap:');

    let windows: number[][] = new Array();

    /**
     * Create windows
     */
    let j = 0;
    for (let i = 0; j + (nperseg - noverlap) < x.length; i++) {
        windows.push(x.slice(j, j + nperseg));
        j = (i + 1) * (nperseg - noverlap);
    }

    /**
     * Add the last not full window, fill with zeros until length of one full window is reached
     */
    if (j < x.length - 1) {
        let last_window: number[] = new Array();
        for (let i = 0; i < nperseg; i++) {
            if (j < x.length - 1) last_window.push(x[j]);
            else last_window.push(0);
        }

        windows.push(last_window);
    }

    return windows;
}

function detrend_windows(
    windows: number[][],
    fs: number,
    detrend: 'linear' | 'constant' | 'none' | ((x: number[]) => number[]),
) {
    for (let i = 0; i < windows.length; i++) {
        if (typeof detrend === 'function') windows[i] = detrend(windows[i]);
        else if (detrend === 'linear') windows[i] = detrend_func.linear(windows[i], fs);
        else if (detrend === 'constant') windows[i] = detrend_func.constant(windows[i]);
    }

    return windows;
}

/**
 * A function to get the average of every column in a 2D Array
 * https://stackoverflow.com/questions/49062795/average-a-columns-in-a-2d-array-with-functional-programming
 */
const average_columns = (a: number[][]) => {
    return a[0].map((col, i) => a.map((row) => row[i]).reduce((acc, c) => acc + c, 0) / a.length);
};
