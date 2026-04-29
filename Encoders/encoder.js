undefined

const h=[[((![]+[]).length+(!![]+!![])),0x6,0b100,0x5,0x1,0b11,0b0,0x2],[0o7,0x5,0x3,0x2,0x0,0x6,0x4,0o1],[0o5,0o0,0x3,0b111,0o4,0x2,0o1,0b110]];
const b=[[0o0,0o1,0x2,0b0,0x1,0x2,(!![]+!![]),0x0],[0o2,0b1,0o4,0x4,0o4,0b1,(!![]+!![]+!![]),0o0],[0x0,0b0,0o2,(!![]+!![]),0x3,0b1,0o3,0b1]];


function encode0(x,dead0,dead1){
  let v=(x>>>0);
  const sel=h[0][x&2];
  const valIdx=b[2][x&2];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 0:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,437993)>>>0);
      v=((v^309880)>>>0);
      v=((v^467832)>>>0);
      v=(Math.imul(v,79689)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^91584)>>>0);
      v=(Math.imul(v,327249)>>>0);
      v=(Math.imul(v,457809)>>>0);
      break;
    case 1:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,153521)>>>0);
      v=(Math.imul(v,242497)>>>0);
      v=(Math.imul(v,479089)>>>0);
      break;
    case 4:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+2288)>>>0);
      v=((v+15448)>>>0);
      v=(Math.imul(v,226713)>>>0);
      v=((v+17424)>>>0);
      v=((v+24256)>>>0);
      v=((v^91608)>>>0);
      break;
    case 2:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,187345)>>>0);
      v=((v^477384)>>>0);
      v=(Math.imul(v,443441)>>>0);
      v=(Math.imul(v,434329)>>>0);
      break;
    case 5:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+7048)>>>0);
      v=((v+18520)>>>0);
      v=((v+20744)>>>0);
      break;
    case 6:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+16)>>>0);
      v=(Math.imul(v,60081)>>>0);
      v=(Math.imul(v,269049)>>>0);
      v=(Math.imul(v,47353)>>>0);
      break;
    case 7:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+15624)>>>0);
      v=((v+28824)>>>0);
      v=((v^481664)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<4;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode1(x,dead0,dead1,dead2,dead3){
  let v=(x>>>0);
  const sel=h[1][x&0];
  const valIdx=b[1][x&0];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 5:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v^179432)>>>0);
      v=((v+16520)>>>0);
      v=(Math.imul(v,448337)>>>0);
      v=(Math.imul(v,254681)>>>0);
      v=(Math.imul(v,432257)>>>0);
      break;
    case 2:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v+17504)>>>0);
      v=((v^315584)>>>0);
      v=((v+31272)>>>0);
      v=((v^264320)>>>0);
      v=((v+29984)>>>0);
      break;
    case 1:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^459424)>>>0);
      v=((v^118440)>>>0);
      v=((v+22936)>>>0);
      v=((v+6312)>>>0);
      v=((v^165584)>>>0);
      v=(Math.imul(v,35209)>>>0);
      break;
    case 4:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v^325544)>>>0);
      v=((v^157408)>>>0);
      v=((v^326392)>>>0);
      break;
    case 7:
      d0=(d0 + dead3)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v+20496)>>>0);
      v=((v+25056)>>>0);
      v=((v+30216)>>>0);
      v=((v^410472)>>>0);
      break;
    case 3:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,491817)>>>0);
      v=(Math.imul(v,524025)>>>0);
      v=((v^419840)>>>0);
      v=((v+4464)>>>0);
      v=(Math.imul(v,315297)>>>0);
      break;
    case 0:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^154552)>>>0);
      v=((v+21688)>>>0);
      v=((v+32640)>>>0);
      v=((v+10384)>>>0);
      v=(Math.imul(v,217673)>>>0);
      break;
    case 6:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead2)>>>0;
      v=(Math.imul(v,297377)>>>0);
      v=((v^123440)>>>0);
      v=((v+21576)>>>0);
      v=(Math.imul(v,290025)>>>0);
      v=(Math.imul(v,464553)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<6;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode2(x,dead0,dead1,dead2){
  let v=(x>>>0);
  const sel=h[2][x&1];
  const valIdx=b[0][x&1];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 1:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,60113)>>>0);
      v=((v^255960)>>>0);
      v=(Math.imul(v,66313)>>>0);
      v=(Math.imul(v,495873)>>>0);
      v=(Math.imul(v,362361)>>>0);
      v=(Math.imul(v,32737)>>>0);
      break;
    case 4:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,464761)>>>0);
      v=((v+2424)>>>0);
      v=(Math.imul(v,506881)>>>0);
      break;
    case 6:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v^57456)>>>0);
      v=((v^446872)>>>0);
      v=((v+12680)>>>0);
      v=((v+15288)>>>0);
      break;
    case 7:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v^27568)>>>0);
      v=((v+19528)>>>0);
      v=((v+2496)>>>0);
      break;
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^203264)>>>0);
      v=(Math.imul(v,382097)>>>0);
      v=((v^220800)>>>0);
      v=((v+16896)>>>0);
      v=(Math.imul(v,505329)>>>0);
      break;
    case 3:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+21936)>>>0);
      v=((v+22824)>>>0);
      v=((v^33904)>>>0);
      v=((v+24576)>>>0);
      v=(Math.imul(v,99873)>>>0);
      v=(Math.imul(v,14113)>>>0);
      break;
    case 5:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead2)>>>0;
      v=(Math.imul(v,318937)>>>0);
      v=((v^493104)>>>0);
      v=((v+6760)>>>0);
      v=(Math.imul(v,483177)>>>0);
      break;
    case 0:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,49065)>>>0);
      v=((v+21808)>>>0);
      v=((v+8416)>>>0);
      v=((v^94280)>>>0);
      v=((v^352536)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<5;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function chainEncode0(v){v=encode0(v,0o2551124163,"fp4nqifwbg21wx47k599ixivqjtfm4yn892",0xe4ecae0d)[b[2][v&2]];return chainEncode1(v);}

function chainEncode1(v){v=encode1(v,0b1001100100000011011000111000111,0xfd9f4e51,0x97459f74,"nl1l44jgne0ka40k138qx9knqfqan527vy8","xb2agpvv4ju2wbokx4fqnmoa6cj6doxu13p")[b[1][v&0]];return chainEncode2(v);}

function chainEncode2(v){v=encode2(v,0o7741024230,"m7u5v4newxq5kfcpahp07115ljycd0l359n",0b11111110110000110101100101011011,0b101100100101000001010101001111)[b[0][v&1]];return v>>>0;}

module.exports={encode: chainEncode0};