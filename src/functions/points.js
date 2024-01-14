export default function calc_points(placement) {
    if(placement > 55 && placement < 151) {
        let b = 6.273;
        return Math.round(100*(56.191 * Math.pow(2, (54.147 - (placement + 3.2)) * (Math.log(50) / 99)) + b))/100
    } else if(placement < 56 && placement > 35) {
        let g = 1.036
        let h = 25.071
       return Math.round(100 * (212.61 * Math.pow(g, 1-placement) + h))/100
    } else if(placement < 36 && placement > 20) {
        let c = 1.0099685
        let d = 31.152
        return Math.round(100 * ((250 - 83.389) * Math.pow(c, 2-placement) - d))/100
    } else if(placement < 21 && placement > 0) {
       let e = 1.168
        let f = 100.39
        return Math.round(100*((250 - f) * Math.pow(e, 1-placement) + f))/100
    } else {
        return 0
    }
}