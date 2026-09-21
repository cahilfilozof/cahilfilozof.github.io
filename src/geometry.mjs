// Shared vector geometry: adjacent edges use exactly the same curve in reverse.
export function edge(x, y, dx, dy, sign = 0) {
  const point = (t, n = 0) => `${+(x + dx*t - dy*n).toFixed(3)},${+(y + dy*t + dx*n).toFixed(3)}`;
  if (!sign) return `L${point(1)}`;
  return `L${point(.34)} C${point(.43)} ${point(.38,sign*.13)} ${point(.5,sign*.13)} C${point(.62,sign*.13)} ${point(.57)} ${point(.66)} L${point(1)}`;
}
export function piecePath(col, row, cols, rows, width, height, left = 0, top = 0) {
  const w=width/cols,h=height/rows,x=left+col*w,y=top+row*h;
  const horizontal = (r,c) => (r+c)%2 ? 1 : -1;
  const vertical = (r,c) => (r+c)%2 ? -1 : 1;
  return `M${x},${y}` + edge(x,y,w,0,row ? -horizontal(row-1,col):0)
    + edge(x+w,y,0,h,col<cols-1?vertical(row,col):0)
    + edge(x+w,y+h,-w,0,row<rows-1?horizontal(row,col):0)
    + edge(x,y+h,0,-h,col ? -vertical(row,col-1):0) + 'Z';
}
export function topology(width, count) { return width < 640 ? {cols:2,rows:2} : {cols: width < 1000 ? 3 : count/2,rows:2}; }
export function closeEnough(dx,dy,threshold) { return Math.hypot(dx,dy) <= threshold; }
export function clamp(value,min,max) { return Math.max(min,Math.min(max,value)); }
