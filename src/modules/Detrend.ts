const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

/**
 * Uses the least square function to detrend data
 */
export function linear(y: number[], fs: number) {
    /**
     * Create x values for y from fs
     */
    let x: number[] = new Array();

    y.forEach((valuer: number, index: number) => {
        x.push(index * fs);
    });

    /**
     * Calculate Average x_avg and Average y_avg of x and y values
     */
    const x_avg = mean(x);
    const y_avg = mean(y);

    /**
     * Calculate the summ of every (x[i] - x_avg)*(y[i] - y_avg)
     * and calculate the summ of every (x[i] - x_avg)^2
     *
     * summ_1 divided by summ_2 will calculate k (in y=k*x+d)
     */
    let summ_1 = 0,
        summ_2 = 0;
    for (let i = 0; i < x.length; i++) {
        summ_1 += (x[i] - x_avg) * (y[i] - y_avg);
        summ_2 += (x[i] - x_avg) * (x[i] - x_avg);
    }

    let k = summ_1 / summ_2;

    /**
     * Calculate d (in y=k*x+d)
     */
    let d = y_avg - k * x_avg;

    /**
     * Now y in (y=k*x+d) can be calculated and subtracted from original data.
     * This creates a linear detrended dataset.
     */
    let detrend_y: number[] = new Array();
    y.forEach((y_value: number, index: number) => detrend_y.push(y_value - (k * x[index] + d)));

    return detrend_y;
}

/**
 * Calculates the mean of function and subtracts it
 */
export function constant(x: number[]) {
    const _mean = mean(x);

    x = x.map((i: number) => i - _mean);

    return x;
}
