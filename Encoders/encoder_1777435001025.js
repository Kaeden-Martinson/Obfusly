undefined

const k=[[0x0,0b110,((!![]+[]).length),(!![]+!![]),0o5,((![]+[]).length+(!![]+!![])),(!![]+!![]+!![]),0o1],[0x6,((![]+[]).length),(!![]+!![]+!![]),0o2,0x0,0o4,0x7,0o1],[0b100,0o3,0x0,((![]+[]).length+(!![]+!![])),0b10,((![]+[]).length+(!![])),(+!![]),((![]+[]).length)]];
const p=[[0x2,0x0,0b10,0o0,0b1,(+!![]),(!![]+!![]+!![]),0x1],[0x0,(+!![]),0o2,0x1,0x1,0x0,(!![]+!![]),0x0],[0o0,0b10,0b1,(!![]+!![]),0x1,0o1,0b0,0o0]];


function encode0(x,dead0,dead1,dead2){
  let v=(x>>>0);
  const sel=k[2][x&0];
  const valIdx=p[1][x&0];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 6:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,247201)>>>0);
      v=((v^425176)>>>0);
      v=(Math.imul(v,215089)>>>0);
      v=((v+22848)>>>0);
      break;
    case 5:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v^400424)>>>0);
      v=(Math.imul(v,201409)>>>0);
      v=((v^217480)>>>0);
      v=((v^320616)>>>0);
      break;
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,286481)>>>0);
      v=((v+8536)>>>0);
      v=((v+22632)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v^425392)>>>0);
      v=((v+17312)>>>0);
      v=((v^44800)>>>0);
      v=((v+4712)>>>0);
      v=((v^419112)>>>0);
      break;
    case 0:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^180376)>>>0);
      v=((v+27848)>>>0);
      v=((v^212016)>>>0);
      v=(Math.imul(v,255329)>>>0);
      v=(Math.imul(v,83369)>>>0);
      break;
    case 4:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v^243144)>>>0);
      v=((v+30896)>>>0);
      v=((v+31560)>>>0);
      v=((v^68256)>>>0);
      break;
    case 1:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v+8464)>>>0);
      v=((v+26520)>>>0);
      v=(Math.imul(v,497169)>>>0);
      v=((v^442232)>>>0);
      v=((v^309664)>>>0);
      v=((v+21176)>>>0);
      break;
    case 7:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^26136)>>>0);
      v=((v^290648)>>>0);
      v=((v^302976)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<5;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode1(x,dead0,dead1){
  let v=(x>>>0);
  const sel=k[0][x&1];
  const valIdx=p[0][x&1];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 0:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v^340288)>>>0);
      v=(Math.imul(v,449937)>>>0);
      v=((v^329856)>>>0);
      v=(Math.imul(v,348025)>>>0);
      v=((v^281976)>>>0);
      break;
    case 4:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,288769)>>>0);
      v=(Math.imul(v,406793)>>>0);
      v=((v^181528)>>>0);
      v=((v^366168)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+29512)>>>0);
      v=((v+6872)>>>0);
      v=((v^308592)>>>0);
      v=((v^317432)>>>0);
      v=(Math.imul(v,177201)>>>0);
      break;
    case 7:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,87641)>>>0);
      v=((v+5352)>>>0);
      v=((v^415624)>>>0);
      v=((v+4304)>>>0);
      v=((v+504)>>>0);
      break;
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^172792)>>>0);
      v=(Math.imul(v,459129)>>>0);
      v=((v+28944)>>>0);
      v=((v^138328)>>>0);
      v=(Math.imul(v,54937)>>>0);
      break;
    case 5:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,397809)>>>0);
      v=((v+30664)>>>0);
      v=((v^125208)>>>0);
      v=((v+24064)>>>0);
      v=((v^332672)>>>0);
      break;
    case 1:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+1768)>>>0);
      v=((v+23384)>>>0);
      v=(Math.imul(v,413497)>>>0);
      break;
    case 6:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,253801)>>>0);
      v=(Math.imul(v,374033)>>>0);
      v=((v+2192)>>>0);
      v=(Math.imul(v,126505)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<4;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode2(x,dead0,dead1){
  let v=(x>>>0);
  const sel=k[1][x&2];
  const valIdx=p[2][x&2];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 3:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+19488)>>>0);
      v=((v+9016)>>>0);
      v=(Math.imul(v,520993)>>>0);
      v=(Math.imul(v,483353)>>>0);
      break;
    case 0:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+27480)>>>0);
      v=(Math.imul(v,501841)>>>0);
      v=((v+2416)>>>0);
      v=((v^460552)>>>0);
      v=((v+17456)>>>0);
      v=((v^15560)>>>0);
      break;
    case 6:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+12720)>>>0);
      v=((v^37712)>>>0);
      v=(Math.imul(v,179881)>>>0);
      v=((v+3928)>>>0);
      v=((v^480168)>>>0);
      v=(Math.imul(v,45809)>>>0);
      break;
    case 4:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v^296064)>>>0);
      v=((v+24376)>>>0);
      v=(Math.imul(v,37617)>>>0);
      v=(Math.imul(v,468321)>>>0);
      v=(Math.imul(v,154729)>>>0);
      break;
    case 1:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,65273)>>>0);
      v=((v+5336)>>>0);
      v=((v+17888)>>>0);
      v=((v^400384)>>>0);
      v=(Math.imul(v,508113)>>>0);
      v=((v^177488)>>>0);
      break;
    case 7:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,172673)>>>0);
      v=((v+20152)>>>0);
      v=((v^394816)>>>0);
      break;
    case 5:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,136329)>>>0);
      v=((v^444048)>>>0);
      v=(Math.imul(v,7497)>>>0);
      v=((v+21672)>>>0);
      v=(Math.imul(v,319137)>>>0);
      v=((v+17808)>>>0);
      break;
    case 2:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+20032)>>>0);
      v=((v^502352)>>>0);
      v=((v^245808)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<4;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function chainEncode0(v){v=encode0(v,0b100010010110011000000101101000,"7gvk8q4ereab6hujtrjv7ue2rixfvgutwhn",0o26340002135,0b1000010010001011011101010110001,"08jsy375neoi93603f2oqe8ef9s1qql9mv3")[p[1][v&0]];return chainEncode1(v);}

function chainEncode1(v){v=encode1(v,0o34700412305,0xed6cbcf7,0x47fe2be,"phw66ha8qkewx5w595og29m3tmy3tsherph","20zc5n54syiqetix98jn1yqkd1wbvcyndfa")[p[0][v&1]];return chainEncode2(v);}

function chainEncode2(v){v=encode2(v,"latvwdaz2xilu7hkspe4wuuq822hnvf5915",0o32573303217,0x3813ebb4,0x4de39a5c)[p[2][v&2]];return v>>>0;}

module.exports={encode: chainEncode0};