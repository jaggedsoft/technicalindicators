import { averagegain } from "../Utils/AverageGain";
import { averageloss } from "../Utils/AverageLoss";
import { bearishinvertedhammerstick } from "./BearishInvertedHammerStick";
import { bullishinvertedhammerstick } from "./BullishInvertedHammerStick";
import CandlestickFinder from "./CandlestickFinder";
export default class ShootingStar extends CandlestickFinder {
    constructor() {
        super();
        this.name = "ShootingStar";
        this.requiredCount = 5;
    }
    logic(data) {
        let isPattern = this.upwardTrend(data);
        isPattern = isPattern && this.includesHammer(data);
        isPattern = isPattern && this.hasConfirmation(data);
        return isPattern;
    }
    upwardTrend(data, confirm = true) {
        const end = confirm ? 3 : 4;
        // Analyze trends in closing prices of the first three or four candlesticks
        const gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
        const losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });
        // Upward trend, so more gains than losses
        return gains > losses;
    }
    includesHammer(data, confirm = true) {
        const start = confirm ? 3 : 4;
        const end = confirm ? 4 : undefined;
        const possibleHammerData = {
            open: data.open.slice(start, end),
            close: data.close.slice(start, end),
            low: data.low.slice(start, end),
            high: data.high.slice(start, end),
        };
        let isPattern = bearishinvertedhammerstick(possibleHammerData);
        isPattern = isPattern || bullishinvertedhammerstick(possibleHammerData);
        return isPattern;
    }
    hasConfirmation(data) {
        const possibleHammer = {
            open: data.open[3],
            close: data.close[3],
            low: data.low[3],
            high: data.high[3],
        };
        const possibleConfirmation = {
            open: data.open[4],
            close: data.close[4],
            low: data.low[4],
            high: data.high[4],
        };
        // Confirmation candlestick is bearish
        const isPattern = possibleConfirmation.open > possibleConfirmation.close;
        return isPattern && possibleHammer.close > possibleConfirmation.close;
    }
}
export function shootingstar(data) {
    return new ShootingStar().hasPattern(data);
}