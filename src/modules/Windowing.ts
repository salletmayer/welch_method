/**
 * Windows x by multiplying it with a window function
 */
export function window_function(
    type: 'hanning' | 'hamming' | 'bartlett' | 'rect' | 'custom',
    x: number[],
    f_custom?: (n: number, window_width: number) => number,
) {
    for (let i = 0; i < x.length; i) {
        switch (type) {
            case 'hanning':
                x[i] = x[i] * f_hann(i, x.length);
                break;
            case 'hanning':
                x[i] = x[i] * f_hamm(i, x.length);
                break;
            case 'bartlett':
                x[i] = x[i] * f_bartlett(i, x.length);
                break;
            case 'rect':
                x[i] = x[i] * 1;
                break;
            case 'custom':
                if (typeof f_custom === 'undefined')
                    throw new Error('Cannot invoke undefined function');

                x[i] = x[i] * f_custom(i, x.length);
                break;
        }
    }

    return x;
}

function f_hann(n: number, window_width: number) {
    return (1 / 2) * (1 - Math.cos((2 * Math.PI * n) / window_width));
}

function f_bartlett(n: number, window_width: number) {
    return (
        (2 / (window_width - 1)) * ((window_width - 1) / 2 - Math.abs(n - (window_width - 1) / 2))
    );
}

function f_hamm(n: number, window_width: number) {
    return 0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (window_width - 1));
}
