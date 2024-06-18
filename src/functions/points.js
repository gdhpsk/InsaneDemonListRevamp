export default function calc_points(placement) {
   return Math.round(100*((74875 - 375*placement)/298)) / 100
}