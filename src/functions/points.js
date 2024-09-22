export default function calc_points(placement) {
    if(placement > 150) return 0
   return Math.round(100*((74875 - 375*placement)/298)) / 100
}