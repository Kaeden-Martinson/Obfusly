undefined

const Cq=[[0x0,0x5,0x1,0x4,0x2,0x7,0x3,0x6]];
const RP=[[0x2,0x3,(!![]+!![]+!![]),0x3,0x2,0x3,(+!![]),0x3]];


function encode0(x,dead0,dead1,dead2){
  let v=(x>>>0);
  const sel=Cq[0][x&0];
  const valIdx=RP[0][x&0];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 0:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v+30000)>>>0);
      v=((v^162384)>>>0);
      v=(Math.imul(v,20873)>>>0);
      v=((v+9496)>>>0);
      v=(Math.imul(v,264105)>>>0);
      v=(Math.imul(v,315769)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead2)>>>0;
      v=(Math.imul(v,379433)>>>0);
      v=((v+12776)>>>0);
      v=((v+25040)>>>0);
      break;
    case 1:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead2)>>>0;
      v=(Math.imul(v,360641)>>>0);
      v=((v+30056)>>>0);
      v=(Math.imul(v,159025)>>>0);
      break;
    case 6:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^145840)>>>0);
      v=((v^442296)>>>0);
      v=((v+31360)>>>0);
      v=(Math.imul(v,229377)>>>0);
      v=((v^513728)>>>0);
      v=(Math.imul(v,66625)>>>0);
      break;
    case 5:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^99392)>>>0);
      v=((v^166928)>>>0);
      v=((v+4456)>>>0);
      v=((v+29672)>>>0);
      v=(Math.imul(v,121001)>>>0);
      break;
    case 4:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+21448)>>>0);
      v=((v^66296)>>>0);
      v=((v+15328)>>>0);
      break;
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v+7496)>>>0);
      v=((v+15240)>>>0);
      v=((v+25672)>>>0);
      v=((v^201672)>>>0);
      break;
    case 7:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,354361)>>>0);
      v=((v^452440)>>>0);
      v=(Math.imul(v,377017)>>>0);
      v=(Math.imul(v,416521)>>>0);
      v=(Math.imul(v,519569)>>>0);
      v=(Math.imul(v,394713)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<5;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function chainEncode0(v){v=encode0(v,0x1341891d,0x5fb776d3,'\u006f\x38\u0074\x71\x75\u0071\u006a\u0038\u006c\x32\x66\x7a\x6b\u0070\u007a\x66\u0070\u0073\u0066\x6d\u006e\x31\u0078\x65\x33\x65\x31\u0076\x77\u0061\x31\x72\x74\x64\x61',0xcf23ab6d,0x4280acb)[RP[0][v&0]];return v>>>0;}

module.exports={encode: chainEncode0};