undefined

const h=[[7,1,2,4,6,5,0,3]];
const R=[[2,0,3,2,3,0,0,1]];


function encode0(x,dead0,dead1,dead2){
  let v=(x>>>0);
  const sel=h[0][x&0];
  const valIdx=R[0][x&0];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 1:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead2)>>>0;
      v=(Math.imul(v,26185)>>>0);
      v=((v^54720)>>>0);
      v=(Math.imul(v,448681)>>>0);
      v=(Math.imul(v,269889)>>>0);
      break;
    case 4:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v^73784)>>>0);
      v=((v^347640)>>>0);
      v=(Math.imul(v,423913)>>>0);
      v=((v^290112)>>>0);
      v=(Math.imul(v,182353)>>>0);
      break;
    case 7:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+2776)>>>0);
      v=((v+1184)>>>0);
      v=((v^412072)>>>0);
      v=((v+8944)>>>0);
      v=((v^26408)>>>0);
      break;
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead2)>>>0;
      v=(Math.imul(v,332289)>>>0);
      v=((v^367080)>>>0);
      v=((v^461552)>>>0);
      break;
    case 6:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+15680)>>>0);
      v=((v+2264)>>>0);
      v=(Math.imul(v,157337)>>>0);
      v=(Math.imul(v,245457)>>>0);
      break;
    case 5:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead2)>>>0;
      v=(Math.imul(v,353993)>>>0);
      v=((v^458808)>>>0);
      v=(Math.imul(v,337025)>>>0);
      v=(Math.imul(v,40289)>>>0);
      v=((v^286496)>>>0);
      v=(Math.imul(v,154121)>>>0);
      break;
    case 0:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+10336)>>>0);
      v=((v^182032)>>>0);
      v=((v^430424)>>>0);
      v=(Math.imul(v,472545)>>>0);
      v=((v^74112)>>>0);
      v=((v^399984)>>>0);
      break;
    case 3:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,184977)>>>0);
      v=((v^439608)>>>0);
      v=((v+21176)>>>0);
      v=((v^383504)>>>0);
      v=(Math.imul(v,153513)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<5;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function chainEncode0(v){v=encode0(v,'\x6b\x6f\x6f\u0069\u0037\x33\u0062\u0078\x6e\u006a\x35\u0068\u0031\u006b\x38\x68\x76\x30\x6a\u0062\x65\x72\u0033\x38\u0078\x79\u006f\u0076\u0067\u0072\x70\x66\u006b\u0061\u0074',207666042,'\x6b\x73\x66\u0067\x34\x74\u0068\u0038\u006b\u0073\u0063\u006d\x66\x62\x36\u0032\x35\u0075\x65\u0061\x7a\u0038\x38\x6d\u0068\u0074\u006a\u0063\x36\x7a\u0039\x64\x77\x65\u0069')[R[0][v&0]];return v>>>0;}

module.exports={encode: chainEncode0};