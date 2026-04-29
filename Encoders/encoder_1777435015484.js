undefined

const N=[[0x1,0b111,0o2,0x6,0o0,0o4,0o5,0x3],[0o2,0o4,((![]+[]).length+(!![]+!![])),((![]+[]).length+(!![])),0x3,(+[]),(+!![]),0o5],[0b10,((!![]+[]).length),((![]+[]).length+(!![]+!![])),0o1,0x5,0x0,((![]+[]).length+(!![])),(!![]+!![]+!![])]];
const X=[[0b1,0x3,(+!![]),0b10,(!![]+!![]),0b10,0b11,0o2],[(!![]+!![]),(+!![]),0o0,0x0,(!![]+!![]),0o0,(+!![]),(+!![])],[0o2,0x1,0o0,(+!![]),0b0,0b0,0b1,(+!![])]];


function encode0(x,dead0,dead1,dead2){
  let v=(x>>>0);
  const sel=N[2][x&2];
  const valIdx=X[1][x&2];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 4:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v+27576)>>>0);
      v=((v+11216)>>>0);
      v=(Math.imul(v,439585)>>>0);
      v=(Math.imul(v,375729)>>>0);
      break;
    case 0:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,200865)>>>0);
      v=(Math.imul(v,278337)>>>0);
      v=((v+31800)>>>0);
      v=(Math.imul(v,376081)>>>0);
      break;
    case 7:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,122489)>>>0);
      v=(Math.imul(v,356937)>>>0);
      v=(Math.imul(v,221873)>>>0);
      v=((v+23944)>>>0);
      v=((v^396008)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,151153)>>>0);
      v=(Math.imul(v,182585)>>>0);
      v=((v^357120)>>>0);
      v=((v^333240)>>>0);
      v=((v+22032)>>>0);
      v=(Math.imul(v,160921)>>>0);
      break;
    case 6:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^22416)>>>0);
      v=((v+8624)>>>0);
      v=((v+2592)>>>0);
      v=((v+4968)>>>0);
      v=(Math.imul(v,282457)>>>0);
      break;
    case 2:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+17232)>>>0);
      v=((v^164688)>>>0);
      v=((v^254520)>>>0);
      v=((v+24088)>>>0);
      v=(Math.imul(v,301409)>>>0);
      break;
    case 5:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,5217)>>>0);
      v=((v^302976)>>>0);
      v=(Math.imul(v,104913)>>>0);
      v=((v^202104)>>>0);
      v=((v^451488)>>>0);
      break;
    case 1:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,158185)>>>0);
      v=((v^222176)>>>0);
      v=((v^244976)>>>0);
      v=((v+23200)>>>0);
      v=(Math.imul(v,99369)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<5;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode1(x,dead0,dead1){
  let v=(x>>>0);
  const sel=N[0][x&0];
  const valIdx=X[2][x&0];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 6:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+25144)>>>0);
      v=((v^277880)>>>0);
      v=((v+32400)>>>0);
      v=((v+13800)>>>0);
      v=((v+17408)>>>0);
      break;
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+23120)>>>0);
      v=((v+3336)>>>0);
      v=((v^433632)>>>0);
      break;
    case 1:
      d0=(d0 + dead1)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+1664)>>>0);
      v=((v+28688)>>>0);
      v=((v^296624)>>>0);
      v=((v^110792)>>>0);
      break;
    case 5:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,477217)>>>0);
      v=((v+22504)>>>0);
      v=(Math.imul(v,6929)>>>0);
      v=((v+24856)>>>0);
      v=(Math.imul(v,261241)>>>0);
      break;
    case 0:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v^195184)>>>0);
      v=(Math.imul(v,92753)>>>0);
      v=((v^495728)>>>0);
      break;
    case 7:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,70977)>>>0);
      v=((v^25632)>>>0);
      v=((v^310416)>>>0);
      v=((v+3376)>>>0);
      v=(Math.imul(v,247657)>>>0);
      break;
    case 3:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,423273)>>>0);
      v=((v+22296)>>>0);
      v=(Math.imul(v,158009)>>>0);
      v=((v+20864)>>>0);
      v=(Math.imul(v,293945)>>>0);
      v=((v+27912)>>>0);
      break;
    case 4:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+29424)>>>0);
      v=((v^329560)>>>0);
      v=(Math.imul(v,447649)>>>0);
      v=((v^298232)>>>0);
      v=(Math.imul(v,231041)>>>0);
      v=((v^215280)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<4;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function encode2(x,dead0,dead1,dead2){
  let v=(x>>>0);
  const sel=N[1][x&1];
  const valIdx=X[0][x&1];
  let d0=10 - 9,d1=0;
  switch(sel){
    case 2:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead1)>>>0;
      v=(Math.imul(v,141297)>>>0);
      v=((v^480512)>>>0);
      v=((v^471848)>>>0);
      v=((v+28256)>>>0);
      v=((v+26144)>>>0);
      v=((v+8440)>>>0);
      break;
    case 4:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+31976)>>>0);
      v=((v+22416)>>>0);
      v=((v+16240)>>>0);
      v=((v^90600)>>>0);
      break;
    case 5:
      d0=(d0 + dead0)>>>0;
      d1=(d1 + dead2)>>>0;
      v=((v^299472)>>>0);
      v=(Math.imul(v,15321)>>>0);
      v=((v+27768)>>>0);
      v=(Math.imul(v,362113)>>>0);
      v=((v^438968)>>>0);
      break;
    case 6:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^7176)>>>0);
      v=((v^359504)>>>0);
      v=((v+6376)>>>0);
      v=(Math.imul(v,196489)>>>0);
      v=(Math.imul(v,468481)>>>0);
      break;
    case 1:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v+32008)>>>0);
      v=(Math.imul(v,500529)>>>0);
      v=((v+24416)>>>0);
      v=((v+17744)>>>0);
      v=(Math.imul(v,408337)>>>0);
      break;
    case 7:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead1)>>>0;
      v=((v+9024)>>>0);
      v=(Math.imul(v,329169)>>>0);
      v=(Math.imul(v,168753)>>>0);
      v=((v^407880)>>>0);
      break;
    case 3:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=((v^413608)>>>0);
      v=(Math.imul(v,428481)>>>0);
      v=(Math.imul(v,152297)>>>0);
      v=(Math.imul(v,255105)>>>0);
      break;
    case 0:
      d0=(d0 + dead2)>>>0;
      d1=(d1 + dead0)>>>0;
      v=(Math.imul(v,244601)>>>0);
      v=(Math.imul(v,105729)>>>0);
      v=((v+22752)>>>0);
      v=((v^133656)>>>0);
      v=(Math.imul(v,141273)>>>0);
      v=(Math.imul(v,160009)>>>0);
      break;
    default:v=v;}
  const arr=[]; for(let i=0;i<5;i++)arr[i]=0;
  arr[valIdx]=v; arr[(valIdx+1)%arr.length]=d0; arr[(valIdx+2)%arr.length]=d1;
  return arr;
}

function chainEncode0(v){v=encode0(v,"q00uwb8iptenwvinvo1t992oytx7wakeo0p",0o25153767007,0x633f2935,"zzfz0b2dakyg8tkibq2ia28ifmxzvwo655i")[X[1][v&2]];return chainEncode1(v);}

function chainEncode1(v){v=encode1(v,0o27613424622,"fg1ynhf6bjdkoke9kr4yitu416lgjvlso1b","8gi45tycsg0kcs895gfdhub0ap8wmal3gba")[X[2][v&0]];return chainEncode2(v);}

function chainEncode2(v){v=encode2(v,"ile83co17iop7qc5urzusqughh2bl8kgw35",0x8c986629,0b101101100000101100000011110001,0o36300060121)[X[0][v&1]];return v>>>0;}

module.exports={encode: chainEncode0};