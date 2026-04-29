undefined

const k=[[0x7,0x5,0o2,0o0,0x6,0b1,0b11,0b100],[0b100,(!![]+!![]),0o6,0b1,((![]+[]).length),((![]+[]).length+(!![]+!![])),(!![]+!![]+!![]),(+[])],[0b0,0x7,0o2,(!![]+!![]+!![]),0b100,0x6,(+!![]),((![]+[]).length)]];
const L=[[0o2,0x0,(!![]+!![]),0b11,(!![]+!![]),0o2,0x0,0b0],[0b100,0b1,0o5,0o5,0o2,0o0,0b11,(+[])],[0x1,0x5,0x2,((!![]+[]).length),0x4,0o2,0b10,0x4]];


function encode0(x,dead0,dead1,dead2){
  let v=(x>>>0);
  const sel=k[2][x&0];
  const valIdx=L[1][x&0];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 7:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v^293048)>>>0);
      v=((v+26128)>>>0);
      v=((v+18672)>>>0);
      v=((v+4432)>>>0);
      v=(Math.imul(v,218633)>>>0);
      break;
    case 6:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+12720)>>>0);
      v=((v^325032)>>>0);
      v=(Math.imul(v,82881)>>>0);
      v=(Math.imul(v,508201)>>>0);
      v=((v+24912)>>>0);
      break;
    case 5:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+25144)>>>0);
      v=((v^130704)>>>0);
      v=(Math.imul(v,53057)>>>0);
      v=(Math.imul(v,88721)>>>0);
      v=((v^398376)>>>0);
      break;
    case 4:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v^29504)>>>0);
      v=(Math.imul(v,168745)>>>0);
      v=(Math.imul(v,425569)>>>0);
      v=(Math.imul(v,279017)>>>0);
      v=(Math.imul(v,116825)>>>0);
      v=((v^226528)>>>0);
      break;
    case 2:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v^481464)>>>0);
      v=((v^273872)>>>0);
      v=((v+8544)>>>0);
      v=((v+25720)>>>0);
      v=((v+18528)>>>0);
      break;
    case 0:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,252193)>>>0);
      v=((v+25048)>>>0);
      v=((v+24832)>>>0);
      v=((v^77440)>>>0);
      v=((v^30600)>>>0);
      v=(Math.imul(v,469897)>>>0);
      break;
    case 1:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^107568)>>>0);
      v=(Math.imul(v,20449)>>>0);
      v=((v+31896)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,178089)>>>0);
      v=((v+9576)>>>0);
      v=((v^226368)>>>0);
      v=((v^146728)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<5;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode1(x,dead0,dead1,dead2,dead3,dead4){
  let v=(x>>>0);
  const sel=k[0][x&1];
  const valIdx=L[0][x&1];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 6:
      d0=(d0 + dead3)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,44065)>>>0);
      v=((v^228960)>>>0);
      v=(Math.imul(v,402633)>>>0);
      v=((v+12096)>>>0);
      break;
    case 5:
      d0=(d0 + dead3)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+8312)>>>0);
      v=(Math.imul(v,146001)>>>0);
      v=((v+9752)>>>0);
      v=((v+20808)>>>0);
      break;
    case 2:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v^136816)>>>0);
      v=(Math.imul(v,282793)>>>0);
      v=((v+17280)>>>0);
      v=(Math.imul(v,197905)>>>0);
      break;
    case 3:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v+32688)>>>0);
      v=((v+30640)>>>0);
      v=((v^411816)>>>0);
      v=(Math.imul(v,167729)>>>0);
      break;
    case 0:
      d0=(d0 + dead4)>>>0;
      d1=(d1 + dead3)>>>0;
      v=(Math.imul(v,444393)>>>0);
      v=((v+9640)>>>0);
      v=((v^53600)>>>0);
      v=(Math.imul(v,176601)>>>0);
      v=(Math.imul(v,25257)>>>0);
      v=((v+5368)>>>0);
      break;
    case 4:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v+7760)>>>0);
      v=((v^105056)>>>0);
      v=(Math.imul(v,305865)>>>0);
      v=(Math.imul(v,181889)>>>0);
      v=((v^394216)>>>0);
      v=((v+26072)>>>0);
      break;
    case 1:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,92881)>>>0);
      v=((v+3944)>>>0);
      v=(Math.imul(v,74953)>>>0);
      v=((v^408504)>>>0);
      v=((v+2776)>>>0);
      break;
    case 7:
      d0=(d0 + dead4)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v^46648)>>>0);
      v=(Math.imul(v,203825)>>>0);
      v=((v^466472)>>>0);
      v=((v+32344)>>>0);
      v=(Math.imul(v,466529)>>>0);
      v=(Math.imul(v,220121)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<7;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode2(x,dead0,dead1,dead2,dead3,dead4){
  let v=(x>>>0);
  const sel=k[1][x&2];
  const valIdx=L[2][x&2];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 4:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^284840)>>>0);
      v=(Math.imul(v,99249)>>>0);
      v=(Math.imul(v,438185)>>>0);
      break;
    case 7:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+25296)>>>0);
      v=((v^359056)>>>0);
      v=(Math.imul(v,16665)>>>0);
      break;
    case 1:
      d0=(d0 + dead3)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v^11224)>>>0);
      v=((v+21976)>>>0);
      v=(Math.imul(v,110769)>>>0);
      v=((v^252048)>>>0);
      break;
    case 0:
      d0=(d0 + dead4)>>>0;
      d1=(d1 + dead4)>>>0;
      v=(Math.imul(v,316729)>>>0);
      v=((v^213832)>>>0);
      v=((v+15752)>>>0);
      break;
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead3)>>>0;
      v=((v+20032)>>>0);
      v=((v^32784)>>>0);
      v=(Math.imul(v,110369)>>>0);
      v=((v^493824)>>>0);
      v=((v+18008)>>>0);
      v=(Math.imul(v,414025)>>>0);
      break;
    case 6:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+27944)>>>0);
      v=(Math.imul(v,367273)>>>0);
      v=(Math.imul(v,100401)>>>0);
      v=(Math.imul(v,41785)>>>0);
      v=((v+21544)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+30352)>>>0);
      v=((v+840)>>>0);
      v=(Math.imul(v,95089)>>>0);
      v=(Math.imul(v,325177)>>>0);
      v=((v^414184)>>>0);
      break;
    case 5:
      d0=(d0 + dead4)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v+5000)>>>0);
      v=(Math.imul(v,367441)>>>0);
      v=(Math.imul(v,382633)>>>0);
      v=((v+3136)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<7;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function chainEncode0(v){v=encode0(v,0b11110111110011001000011101011100,0x7dd6dd86,"znxe1tx6yg8dpx2qefer6w7v8d7g9ub4ue4")[L[1][v&0]];return chainEncode1(v);}

function chainEncode1(v){v=encode1(v,0o20523011100,"z3rrcv0nrnpncy9td6xxize9i8v9hcm2620",0b110100001000110100000101010011,"d3zbrp1qfz2r2dppc4uyu36cl64p5pc01qv","anldw45kd8j21712s729md4sonpa6u9fg8q",0xbbf80da0)[L[0][v&1]];return chainEncode2(v);}

function chainEncode2(v){v=encode2(v,0x5984d630,"5kktjp1czatkm3n6103heg56gfmx8t53ygn",0xc0c3d7d6,"uvemgtsy1t5jssm6vqhlgixzd1ziua4bf2p")[L[2][v&2]];return v>>>0;}

module.exports={encode: chainEncode0};