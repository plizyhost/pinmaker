import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';

const GFONTS = [
  {name:"Poppins",cat:"Sans-serif",stack:"'Poppins',sans-serif"},
  {name:"Montserrat",cat:"Sans-serif",stack:"'Montserrat',sans-serif"},
  {name:"Raleway",cat:"Sans-serif",stack:"'Raleway',sans-serif"},
  {name:"Nunito",cat:"Sans-serif",stack:"'Nunito',sans-serif"},
  {name:"Josefin Sans",cat:"Sans-serif",stack:"'Josefin Sans',sans-serif"},
  {name:"Quicksand",cat:"Rounded",stack:"'Quicksand',sans-serif"},
  {name:"Comfortaa",cat:"Rounded",stack:"'Comfortaa',sans-serif"},
  {name:"Bebas Neue",cat:"Display",stack:"'Bebas Neue',sans-serif"},
  {name:"Anton",cat:"Display",stack:"'Anton',sans-serif"},
  {name:"Oswald",cat:"Display",stack:"'Oswald',sans-serif"},
  {name:"Fjalla One",cat:"Display",stack:"'Fjalla One',sans-serif"},
  {name:"Righteous",cat:"Display",stack:"'Righteous',sans-serif"},
  {name:"Alfa Slab One",cat:"Display",stack:"'Alfa Slab One',serif"},
  {name:"Abril Fatface",cat:"Display",stack:"'Abril Fatface',serif"},
  {name:"Secular One",cat:"Display",stack:"'Secular One',sans-serif"},
  {name:"Playfair Display",cat:"Serif",stack:"'Playfair Display',serif"},
  {name:"Merriweather",cat:"Serif",stack:"'Merriweather',serif"},
  {name:"Lora",cat:"Serif",stack:"'Lora',serif"},
  {name:"Cinzel",cat:"Serif",stack:"'Cinzel',serif"},
  {name:"Cormorant Garamond",cat:"Serif",stack:"'Cormorant Garamond',serif"},
  {name:"Spectral",cat:"Serif",stack:"'Spectral',serif"},
  {name:"Italiana",cat:"Serif",stack:"'Italiana',serif"},
  {name:"Dancing Script",cat:"Script",stack:"'Dancing Script',cursive"},
  {name:"Pacifico",cat:"Script",stack:"'Pacifico',cursive"},
  {name:"Lobster",cat:"Script",stack:"'Lobster',cursive"},
  {name:"Satisfy",cat:"Script",stack:"'Satisfy',cursive"},
  {name:"Great Vibes",cat:"Script",stack:"'Great Vibes',cursive"},
  {name:"Permanent Marker",cat:"Handwriting",stack:"'Permanent Marker',cursive"},
];

const PRESETS = [
  { id:"classic-cream", name:"Classic Cream", t:{layout:"two",fontStack:"'Poppins',sans-serif",fontWeight:"900",fontStyle:"normal",uppercase:true,fontScale:100,bannerH:560,bannerW:100,bannerR:0,bannerPad:60,colors:{band:"#FFF8F2",title:"#D85A30",label:"#3B2A1A",subtitle:"#888888"}} },
  { id:"bold-dark", name:"Bold Dark", t:{layout:"two",fontStack:"'Anton',sans-serif",fontWeight:"400",fontStyle:"normal",uppercase:true,fontScale:108,bannerH:520,bannerW:100,bannerR:0,bannerPad:50,colors:{band:"#1A1A1A",title:"#FAC775",label:"#D85A30",subtitle:"#cccccc"}} },
  { id:"elegant-serif", name:"Elegant Serif", t:{layout:"two",fontStack:"'Playfair Display',serif",fontWeight:"900",fontStyle:"italic",uppercase:false,fontScale:104,bannerH:540,bannerW:100,bannerR:0,bannerPad:60,colors:{band:"#FFFFFF",title:"#2C3E2D",label:"#7B4EA0",subtitle:"#777777"}} },
  { id:"script-soft", name:"Script Soft", t:{layout:"two",fontStack:"'Dancing Script',cursive",fontWeight:"700",fontStyle:"normal",uppercase:false,fontScale:130,bannerH:500,bannerW:100,bannerR:0,bannerPad:50,colors:{band:"#FBEAF0",title:"#D4537E",label:"#993556",subtitle:"#996680"}} },
  { id:"floating-card", name:"Floating Card", t:{layout:"one",fontStack:"'Montserrat',sans-serif",fontWeight:"900",fontStyle:"normal",uppercase:true,fontScale:98,bannerH:480,bannerW:78,bannerR:28,bannerPad:50,colors:{band:"#FFFFFF",title:"#1A1A1A",label:"#D85A30",subtitle:"#666666"}} },
  { id:"green-fresh", name:"Green Fresh", t:{layout:"two",fontStack:"'Oswald',sans-serif",fontWeight:"700",fontStyle:"normal",uppercase:true,fontScale:106,bannerH:520,bannerW:100,bannerR:0,bannerPad:55,colors:{band:"#FFFFFF",title:"#3B6D11",label:"#173404",subtitle:"#7A8A6A"}} },
  { id:"top-banner-blue", name:"Top Blue Banner", t:{layout:"top",fontStack:"'Bebas Neue',sans-serif",fontWeight:"400",fontStyle:"normal",uppercase:true,fontScale:120,bannerH:560,bannerW:100,bannerR:0,bannerPad:60,colors:{band:"#185FA5",title:"#FFFFFF",label:"#042C53",subtitle:"#cce0f5"}} },
  { id:"warm-terracotta", name:"Warm Terracotta", t:{layout:"two",fontStack:"'Raleway',sans-serif",fontWeight:"900",fontStyle:"normal",uppercase:true,fontScale:100,bannerH:540,bannerW:100,bannerR:0,bannerPad:58,colors:{band:"#D85A30",title:"#FFFFFF",label:"#FFFFFF",subtitle:"#fbe3d8"}} },
];

const DEFAULT_TMPL = JSON.parse(JSON.stringify(PRESETS[0].t));
const PW=1000, PH=2000;

const PALETTE = {
  "Warm": ["#FFFFFF","#FFF8F2","#FBF3E8","#F3EDE3","#FAEEDA","#FAC775","#EF9F27","#D85A30","#B5462A","#993C1D","#712B13","#3B2A1A"],
  "Reds / Pinks": ["#FCEBEB","#F7C1C1","#E24B4A","#A32D2D","#791F1F","#FBEAF0","#F4C0D1","#D4537E","#993556","#72243E"],
  "Greens": ["#EAF3DE","#C0DD97","#97C459","#639922","#3B6D11","#173404","#2C3E2D","#E1F5EE","#5DCAA5","#1D9E75","#0F6E56"],
  "Blues / Purples": ["#E6F1FB","#85B7EB","#378ADD","#185FA5","#042C53","#EEEDFE","#AFA9EC","#7F77DD","#7B4EA0","#534AB7","#26215C"],
  "Neutrals": ["#FFFFFF","#F1EFE8","#D3D1C7","#888780","#5F5E5A","#444441","#2C2C2A","#1A1A1A","#000000"],
};

function renderPin(cv, tmpl, pin, imgCache) {
  const ctx = cv.getContext("2d");
  const {layout,fontStack,fontWeight,fontStyle,uppercase,fontScale,bannerH,bannerW,bannerR,bannerPad,colors} = tmpl;
  const {title="",subtitle="",label="",url="",topImg,botImg,topPos,botPos} = pin;
  const tfs = Math.round(108*fontScale/100);
  const sfs = Math.round(40*fontScale/100);
  const lfs = Math.round(38*fontScale/100);
  const mainTxt = uppercase ? (title||"").toUpperCase() : (title||"");
  const tp = topPos||{x:50,y:50,zoom:100};
  const bp = botPos||{x:50,y:50,zoom:100};

  const lum = hex => { if(!hex||hex.length<7) return 128; const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return(r*299+g*587+b*114)/1000; };
  const lblTxt = bg => lum(bg)>128?"#1A1A1A":"#FFFFFF";
  const subClr = bg => colors.subtitle || (lum(bg)>128?"#666":"rgba(255,255,255,.75)");

  function drawImg(img,x,y,w,h,pos){
    if(!img){ctx.fillStyle="#E8E0D5";ctx.fillRect(x,y,w,h);ctx.fillStyle="#B0A898";ctx.font="500 28px 'Poppins',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("No image",x+w/2,y+h/2);return;}
    const zoom=(pos.zoom||100)/100;
    const sc=Math.max(w/img.width,h/img.height)*zoom;
    const sw=img.width*sc, sh=img.height*sc;
    const ox=x-(sw-w)*(pos.x/100);
    const oy=y-(sh-h)*(pos.y/100);
    ctx.drawImage(img,ox,oy,sw,sh);
  }
  function wrap(text,maxW,maxLines){
    const words=text.split(" ");let line="";const lines=[];
    for(const w of words){const t=line?line+" "+w:w;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w;}else line=t;}
    if(line)lines.push(line);
    return maxLines?lines.slice(0,maxLines):lines;
  }
  function drawLabel(text,cx,y){
    if(!text)return 0;
    ctx.font=`700 normal ${lfs}px 'Poppins',sans-serif`;
    const tw=ctx.measureText(text).width,pad=56,ph=lfs+32;
    ctx.fillStyle=colors.label;ctx.beginPath();ctx.roundRect(cx-tw/2-pad/2,y,tw+pad,ph,ph/2);ctx.fill();
    ctx.fillStyle=lblTxt(colors.label);ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(text,cx,y+ph/2);
    return ph+20;
  }
  function measureBlock(bw){
    let h=0;
    if(label) h+=lfs+32+20;
    ctx.font=`${fontStyle} ${fontWeight} ${tfs}px ${fontStack}`;
    const lines=wrap(mainTxt,bw-80,5);
    h+=lines.length*tfs*1.18;
    if(subtitle) h+=6+sfs*1.1;
    return {h,lines};
  }
  function drawBanner(cx,cy){
    const bw=Math.round(PW*bannerW/100),bx=cx-bw/2,r=bannerW<100?bannerR:0;
    ctx.save();
    ctx.fillStyle=colors.band;
    ctx.beginPath();ctx.roundRect(bx,cy,bw,bannerH,r);ctx.fill();
    ctx.beginPath();ctx.roundRect(bx,cy,bw,bannerH,r);ctx.clip();
    const {h:blockH,lines}=measureBlock(bw);
    let ty=cy+Math.max(bannerPad,(bannerH-blockH)/2);
    ty+=drawLabel(label,cx,ty);
    ctx.font=`${fontStyle} ${fontWeight} ${tfs}px ${fontStack}`;ctx.fillStyle=colors.title;ctx.textAlign="center";ctx.textBaseline="top";
    lines.forEach(l=>{ctx.fillText(l,cx,ty);ty+=tfs*1.18;});
    if(subtitle){ty+=6;ctx.font=`400 normal ${sfs}px 'Poppins',sans-serif`;ctx.fillStyle=subClr(colors.band);ctx.fillText(subtitle,cx,ty);}
    ctx.restore();
  }
  function drawUrl(y,isOverlay){
    if(!url)return;
    if(isOverlay){ctx.fillStyle="rgba(0,0,0,.45)";ctx.fillRect(0,y,PW,80);ctx.fillStyle="#fff";}
    else{ctx.fillStyle=lum(colors.band)>128?"rgba(0,0,0,.08)":"rgba(255,255,255,.08)";ctx.fillRect(0,y,PW,80);ctx.fillStyle=subClr(colors.band);}
    ctx.font="600 34px 'Poppins',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText((url||"").toLowerCase(),PW/2,y+40);
  }

  ctx.clearRect(0,0,PW,PH);ctx.save();ctx.beginPath();ctx.roundRect(0,0,PW,PH,28);ctx.clip();
  ctx.fillStyle="#FFFFFF";ctx.fillRect(0,0,PW,PH);
  const ti=topImg?imgCache[topImg]:null, bi=botImg?imgCache[botImg]:null;

  if(layout==="two"){
    const rem=PH-bannerH-80,tph=Math.round(rem/2);
    ctx.save();ctx.beginPath();ctx.rect(0,0,PW,tph);ctx.clip();drawImg(ti,0,0,PW,tph,tp);ctx.restore();
    ctx.save();ctx.beginPath();ctx.rect(0,tph+bannerH,PW,rem-tph);ctx.clip();drawImg(bi,0,tph+bannerH,PW,rem-tph,bp);ctx.restore();
    drawBanner(PW/2,tph);drawUrl(PH-80,false);
  } else if(layout==="top"){
    drawBanner(PW/2,0);
    ctx.save();ctx.beginPath();ctx.rect(0,bannerH,PW,PH-bannerH-80);ctx.clip();drawImg(ti,0,bannerH,PW,PH-bannerH-80,tp);ctx.restore();
    drawUrl(PH-80,true);
  } else if(layout==="one"){
    ctx.save();ctx.beginPath();ctx.rect(0,0,PW,PH);ctx.clip();drawImg(ti,0,0,PW,PH,tp);ctx.restore();
    ctx.fillStyle="rgba(0,0,0,.36)";ctx.fillRect(0,0,PW,PH);
    drawBanner(PW/2,Math.round((PH-bannerH)/2));drawUrl(PH-80,true);
  } else {
    const ph=PH-bannerH-80;
    ctx.save();ctx.beginPath();ctx.rect(0,0,PW,ph);ctx.clip();drawImg(ti,0,0,PW,ph,tp);ctx.restore();
    drawBanner(PW/2,ph);drawUrl(PH-80,false);
  }
  ctx.restore();
}

function parseCSV(text){
  const lines=text.replace(/\r/g,"").trim().split("\n");if(lines.length<2)return{headers:[],rows:[]};
  function sp(line){const v=[];let c="",q=false;for(const ch of line){if(ch==='"')q=!q;else if(ch===","&&!q){v.push(c.trim());c="";}else c+=ch;}v.push(c.trim());return v;}
  const headers=sp(lines[0]).map(h=>h.replace(/^"|"$/g,""));
  const rows=lines.slice(1).map(line=>{const v=sp(line);return Object.fromEntries(headers.map((h,i)=>[h,(v[i]||"").replace(/^"|"$/g,"")]));});
  return{headers,rows};
}
async function loadImg(src){return new Promise(res=>{const img=new Image();img.crossOrigin="anonymous";img.onload=()=>res(img);img.onerror=()=>res(null);img.src=src;});}

const PROXIES=[
  u=>`https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  u=>`https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u=>`https://api.codetabs.com/v1/proxy/?quest=${u}`,
  u=>`https://thingproxy.freeboard.io/fetch/${u}`,
];
async function fetchViaProxy(t){
  let last="";
  for(const make of PROXIES){
    try{const r=await fetch(make(t));if(!r.ok){last="HTTP "+r.status;continue;}const x=await r.text();if(x&&x.length>30)return x;last="Empty";}
    catch(e){last=e.message;}
  }
  throw new Error(last||"All proxies failed");
}

const S={
  inp:{width:"100%",padding:"7px 10px",border:"0.5px solid #ddd",borderRadius:8,fontFamily:"'Poppins',sans-serif",fontSize:13,background:"#fff",color:"#222"},
  lbl:{fontSize:12,fontWeight:600,color:"#666",marginBottom:3,display:"block"},
  fg:{display:"flex",flexDirection:"column",gap:3},
  card:{background:"#f9f9f9",border:"0.5px solid #e5e5e5",borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:12},
  secHead:{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#aaa",padding:"8px 0 3px",borderTop:"0.5px solid #eee",marginTop:4},
  btn:{padding:"9px 20px",background:"#D85A30",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer"},
  btnSm:{padding:"6px 14px",background:"#D85A30",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer"},
  btnGhost:{padding:"7px 14px",background:"#fff",color:"#222",border:"0.5px solid #ddd",borderRadius:8,fontWeight:600,fontSize:12,cursor:"pointer"},
};

function RangeRow({label,min,max,step=1,value,onChange,fmt=v=>v}){
  return(<div style={S.fg}><span style={S.lbl}>{label}</span>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} style={{flex:1}}/>
      <span style={{fontSize:13,fontWeight:700,minWidth:46,textAlign:"right",color:"#222"}}>{fmt(value)}</span>
    </div></div>);
}

function ColorPicker({value,onChange}){
  const [open,setOpen]=useState(false);const ref=useRef();
  useEffect(()=>{function h(e){if(ref.current&&!ref.current.contains(e.target))setOpen(false);}document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  const safe=value&&value.length===7?value:"#000000";
  return(<div style={{position:"relative"}} ref={ref}>
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      <div onClick={()=>setOpen(o=>!o)} style={{width:32,height:32,borderRadius:8,background:value||"#fff",cursor:"pointer",border:"0.5px solid #ccc",boxShadow:"inset 0 0 0 0.5px rgba(0,0,0,.1)",flexShrink:0}}/>
      <input type="text" value={value||""} placeholder="(none)" onChange={e=>onChange(e.target.value)} style={{...S.inp,fontFamily:"monospace",fontSize:12,flex:1}}/>
      <input type="color" value={safe} onChange={e=>onChange(e.target.value.toUpperCase())}/>
    </div>
    {open&&(<div style={{position:"absolute",top:"100%",left:0,marginTop:6,background:"#fff",border:"0.5px solid #ddd",borderRadius:10,zIndex:300,padding:12,boxShadow:"0 6px 24px rgba(0,0,0,.16)",width:300,maxHeight:340,overflowY:"auto"}}>
      {Object.entries(PALETTE).map(([group,cols])=>(<div key={group} style={{marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"#aaa",marginBottom:6}}>{group}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:6}}>
          {cols.map(c=><div key={c} onClick={()=>{onChange(c);setOpen(false);}} title={c} style={{width:28,height:28,borderRadius:6,background:c,cursor:"pointer",border:value===c?"2.5px solid #D85A30":"0.5px solid #ddd",boxShadow:c==="#FFFFFF"?"inset 0 0 0 0.5px #ccc":"none"}}/>)}
        </div></div>))}
      <div style={{borderTop:"0.5px solid #eee",paddingTop:10,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:11,color:"#888"}}>Custom:</span><input type="color" value={safe} onChange={e=>onChange(e.target.value.toUpperCase())} style={{width:48}}/>
      </div></div>)}
  </div>);
}

function TemplatePanel({tmpl,setTmpl,localFontStack,setLocalFontStack}){
  const [fontQ,setFontQ]=useState("Poppins");
  const [ddOpen,setDdOpen]=useState(false);
  const [localName,setLocalName]=useState("");
  const [localPrev,setLocalPrev]=useState(null);
  const [savedTmpls,setSavedTmpls]=useState([]);
  const [saveName,setSaveName]=useState("");
  const fontRef=useRef();
  const filtered=GFONTS.filter(f=>f.name.toLowerCase().includes(fontQ.toLowerCase()));
  const set=(k,v)=>setTmpl(t=>({...t,[k]:v}));
  const setClr=(k,v)=>setTmpl(t=>({...t,colors:{...t.colors,[k]:v}}));

  useEffect(()=>{try{setSavedTmpls(JSON.parse(localStorage.getItem("pinStudioTemplates")||"[]"));}catch{}},[]);
  useEffect(()=>{function h(e){if(fontRef.current&&!fontRef.current.contains(e.target))setDdOpen(false);}document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);

  function saveTemplate(){if(!saveName.trim())return;const next=[...savedTmpls.filter(t=>t.name!==saveName.trim()),{name:saveName.trim(),t:JSON.parse(JSON.stringify(tmpl))}];setSavedTmpls(next);localStorage.setItem("pinStudioTemplates",JSON.stringify(next));setSaveName("");}
  function deleteTemplate(name){const next=savedTmpls.filter(t=>t.name!==name);setSavedTmpls(next);localStorage.setItem("pinStudioTemplates",JSON.stringify(next));}
  function handleLocalFont(e){const f=e.target.files[0];if(!f)return;const name="LF_"+Date.now();new FontFace(name,`url(${URL.createObjectURL(f)})`).load().then(ff=>{document.fonts.add(ff);const stack=`'${name}',sans-serif`;setLocalFontStack(stack);setLocalName(f.name);setLocalPrev(stack);}).catch(()=>setLocalName("Failed to load"));}

  return(<div style={{display:"flex",flexDirection:"column",gap:11}}>
    <div style={S.secHead}>Ready Templates</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
      {PRESETS.map(p=><button key={p.id} onClick={()=>setTmpl(JSON.parse(JSON.stringify(p.t)))} style={{...S.btnGhost,fontSize:11,padding:"7px 8px",textAlign:"left"}}>{p.name}</button>)}
    </div>

    {savedTmpls.length>0&&(<>
      <div style={{fontSize:11,fontWeight:600,color:"#888"}}>Your saved templates</div>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {savedTmpls.map(t=>(<div key={t.name} style={{display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={()=>setTmpl(JSON.parse(JSON.stringify(t.t)))} style={{...S.btnGhost,flex:1,textAlign:"left",fontSize:12}}>⭐ {t.name}</button>
          <button onClick={()=>deleteTemplate(t.name)} style={{...S.btnGhost,padding:"7px 10px",color:"#c00"}} title="Delete">✕</button>
        </div>))}
      </div>
    </>)}
    <div style={{display:"flex",gap:6}}>
      <input style={{...S.inp,flex:1}} placeholder="Name this template…" value={saveName} onChange={e=>setSaveName(e.target.value)}/>
      <button onClick={saveTemplate} style={S.btnSm}>Save</button>
    </div>

    <div style={S.secHead}>Layout</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[["two","Two Photos","text in middle"],["top","Top Banner","text at top"],["one","One Photo","text overlay"],["bot","Bottom Banner","text at bottom"]].map(([id,nm,sb])=>(
        <div key={id} onClick={()=>set("layout",id)} style={{padding:"10px 8px",border:"0.5px solid #ddd",borderRadius:12,background:tmpl.layout===id?"#1A1A1A":"#f5f5f5",cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:13,fontWeight:700,color:tmpl.layout===id?"#fff":"#222"}}>{nm}</div>
          <div style={{fontSize:11,color:tmpl.layout===id?"rgba(255,255,255,.55)":"#888"}}>{sb}</div>
        </div>))}
    </div>

    <div style={S.secHead}>Headline Font — Google Fonts</div>
    <div style={{position:"relative"}} ref={fontRef}>
      <input style={S.inp} value={fontQ} onChange={e=>{setFontQ(e.target.value);setDdOpen(true);}} onFocus={()=>setDdOpen(true)} placeholder="Search font name…" autoComplete="off"/>
      {ddOpen&&filtered.length>0&&(<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"0.5px solid #ddd",borderRadius:8,zIndex:200,maxHeight:190,overflowY:"auto",boxShadow:"0 4px 16px rgba(0,0,0,.13)"}}>
        {filtered.map(f=><div key={f.name} onClick={()=>{set("fontStack",f.stack);setFontQ(f.name);setDdOpen(false);}} style={{padding:"8px 12px",cursor:"pointer",fontSize:14,borderBottom:"0.5px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{fontFamily:f.stack,fontWeight:700}}>{f.name}</span><span style={{fontSize:10,color:"#bbb"}}>{f.cat}</span></div>)}
      </div>)}
    </div>
    <div style={{padding:"10px 14px",background:"#f5f5f5",borderRadius:8,fontSize:22,textAlign:"center",fontFamily:tmpl.fontStack,fontWeight:700,color:"#222",minHeight:48,lineHeight:1.3}}>Your Headline Here</div>

    <div style={S.fg}><span style={S.lbl}>Weight / Style</span>
      <select style={S.inp} value={`${tmpl.fontWeight} ${tmpl.fontStyle}`} onChange={e=>{const[w,s]=e.target.value.split(" ");set("fontWeight",w);set("fontStyle",s);}}>
        <option value="900 normal">Black / Extra Bold</option><option value="700 normal">Bold</option>
        <option value="700 italic">Bold Italic</option><option value="900 italic">Black Italic</option><option value="400 normal">Regular</option>
      </select></div>
    <div style={S.fg}><span style={S.lbl}>Uppercase headline</span>
      <select style={S.inp} value={tmpl.uppercase?"1":"0"} onChange={e=>set("uppercase",e.target.value==="1")}>
        <option value="1">Yes — ALL CAPS</option><option value="0">No — keep as typed</option></select></div>

    <div style={S.secHead}>Local Font Upload</div>
    <div style={{background:"#f5f5f5",border:"0.5px dashed #ccc",borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:8}}>
      <span style={{...S.lbl,margin:0}}>Upload .ttf .otf .woff .woff2</span>
      <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleLocalFont}/>
      {localName&&(<div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:12,color:"#666"}}>{localName}</span>
        {localFontStack&&<button onClick={()=>set("fontStack",localFontStack)} style={{...S.btnSm,background:"#fff",color:"#222",border:"0.5px solid #ddd"}}>Use this font</button>}</div>)}
      {localPrev&&<div style={{padding:"8px 14px",background:"#fff",borderRadius:8,fontSize:20,fontFamily:localPrev,fontWeight:700,textAlign:"center"}}>Your Headline</div>}
    </div>

    <div style={S.secHead}>Banner Size</div>
    <div style={{background:"#f5f5f5",border:"0.5px solid #eee",borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:10}}>
      <RangeRow label="Height" min={150} max={1000} step={10} value={tmpl.bannerH} onChange={v=>set("bannerH",v)} fmt={v=>v+"px"}/>
      <RangeRow label="Width" min={40} max={100} value={tmpl.bannerW} onChange={v=>set("bannerW",v)} fmt={v=>v+"%"}/>
      {tmpl.bannerW<100&&<RangeRow label="Corner radius" min={0} max={80} step={2} value={tmpl.bannerR} onChange={v=>set("bannerR",v)} fmt={v=>v+"px"}/>}
      <RangeRow label="Min top padding" min={10} max={150} step={4} value={tmpl.bannerPad} onChange={v=>set("bannerPad",v)} fmt={v=>v+"px"}/>
    </div>

    <div style={S.secHead}>Font Size</div>
    <RangeRow label="Headline scale" min={40} max={170} value={tmpl.fontScale} onChange={v=>set("fontScale",v)} fmt={v=>""+v}/>

    <div style={S.secHead}>Colors</div>
    <div style={S.fg}><span style={S.lbl}>Banner background</span><ColorPicker value={tmpl.colors.band} onChange={v=>setClr("band",v)}/></div>
    <div style={S.fg}><span style={S.lbl}>Headline color</span><ColorPicker value={tmpl.colors.title} onChange={v=>setClr("title",v)}/></div>
    <div style={S.fg}><span style={S.lbl}>Subtitle color</span><ColorPicker value={tmpl.colors.subtitle||"#888888"} onChange={v=>setClr("subtitle",v)}/></div>
    <div style={S.fg}><span style={S.lbl}>Label strip color</span><ColorPicker value={tmpl.colors.label} onChange={v=>setClr("label",v)}/></div>
  </div>);
}

function PinCanvas({tmpl,pin,imgCache,scale=0.27}){
  const ref=useRef();
  useEffect(()=>{if(!ref.current)return;document.fonts.ready.then(()=>renderPin(ref.current,tmpl,pin,imgCache));},[tmpl,pin,imgCache]);
  return <canvas ref={ref} width={PW} height={PH} style={{width:PW*scale,height:PH*scale,borderRadius:8,boxShadow:"0 2px 16px rgba(0,0,0,.18)",flexShrink:0,background:"#fff"}}/>;
}

function ImagePosControl({label,pos,onChange,onUpload,hasImg,fileName}){
  const p=pos||{x:50,y:50,zoom:100};
  return(<div style={{...S.fg,gap:6}}>
    <span style={S.lbl}>{label}</span>
    <input type="file" accept="image/*" onChange={onUpload}/>
    {fileName&&<span style={{fontSize:10,color:"#aaa",wordBreak:"break-all"}}>{fileName}</span>}
    {hasImg&&(<div style={{background:"#f5f5f5",border:"0.5px solid #eee",borderRadius:8,padding:"8px 10px",display:"flex",flexDirection:"column",gap:7,marginTop:2}}>
      <div style={{fontSize:10,fontWeight:700,color:"#aaa",textTransform:"uppercase",letterSpacing:".06em"}}>Position & Zoom</div>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:"#888",width:46}}>↔ Horiz</span><input type="range" min={0} max={100} value={p.x} onChange={e=>onChange({...p,x:+e.target.value})} style={{flex:1}}/></div>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:"#888",width:46}}>↕ Vert</span><input type="range" min={0} max={100} value={p.y} onChange={e=>onChange({...p,y:+e.target.value})} style={{flex:1}}/></div>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,color:"#888",width:46}}>🔍 Zoom</span><input type="range" min={100} max={250} value={p.zoom} onChange={e=>onChange({...p,zoom:+e.target.value})} style={{flex:1}}/><span style={{fontSize:11,fontWeight:700,width:34,textAlign:"right"}}>{p.zoom}%</span></div>
    </div>)}
  </div>);
}

function PinStyleOverride({pin,onUpdate}){
  const ov=pin.override||{};
  function setOv(k,v){onUpdate({...pin,override:{...ov,[k]:v}});}
  function setOvClr(k,v){onUpdate({...pin,override:{...ov,colors:{...(ov.colors||{}),[k]:v}}});}
  function clearOv(){onUpdate({...pin,override:undefined});}
  const hasOv=pin.override&&Object.keys(pin.override).length>0;
  return(<div style={{background:"#FFF8F2",border:"0.5px solid #f0d8c8",borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:9,marginTop:4}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:11,fontWeight:700,color:"#993C1D",textTransform:"uppercase",letterSpacing:".06em"}}>This pin's custom style</span>
      {hasOv&&<button onClick={clearOv} style={{fontSize:11,color:"#993C1D",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Reset to template</button>}
    </div>
    <div style={{fontSize:11,color:"#aa6a4a"}}>Leave blank to use the template. Override only what this pin needs.</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div style={S.fg}><span style={S.lbl}>Banner color</span><ColorPicker value={ov.colors?.band||""} onChange={v=>setOvClr("band",v)}/></div>
      <div style={S.fg}><span style={S.lbl}>Headline color</span><ColorPicker value={ov.colors?.title||""} onChange={v=>setOvClr("title",v)}/></div>
      <div style={S.fg}><span style={S.lbl}>Label color</span><ColorPicker value={ov.colors?.label||""} onChange={v=>setOvClr("label",v)}/></div>
      <div style={S.fg}><span style={S.lbl}>Subtitle color</span><ColorPicker value={ov.colors?.subtitle||""} onChange={v=>setOvClr("subtitle",v)}/></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div style={S.fg}><span style={S.lbl}>Layout override</span>
        <select style={S.inp} value={ov.layout||""} onChange={e=>setOv("layout",e.target.value||undefined)}>
          <option value="">(use template)</option><option value="two">Two Photos</option><option value="top">Top Banner</option><option value="one">One Photo</option><option value="bot">Bottom Banner</option>
        </select></div>
      <div style={S.fg}><span style={S.lbl}>Headline scale override</span>
        <input type="range" min={40} max={170} value={ov.fontScale||100} onChange={e=>setOv("fontScale",+e.target.value)} style={{marginTop:8}}/>
        <span style={{fontSize:11,color:"#888"}}>{ov.fontScale?ov.fontScale:"(template)"}</span></div>
    </div>
  </div>);
}

function effectiveTmpl(tmpl,pin){
  const ov=pin.override;if(!ov)return tmpl;
  return {...tmpl,...(ov.layout?{layout:ov.layout}:{}),...(ov.fontScale?{fontScale:ov.fontScale}:{}),
    colors:{band:ov.colors?.band||tmpl.colors.band,title:ov.colors?.title||tmpl.colors.title,label:ov.colors?.label||tmpl.colors.label,subtitle:ov.colors?.subtitle||tmpl.colors.subtitle}};
}

function PinRow({pin,idx,total,tmpl,imgCache,onUpdate,onDownload,onUploadImg,selected,onSelect}){
  const eff=effectiveTmpl(tmpl,pin);
  return(<div className={"pin-thumb"+(selected?" sel":"")} style={{display:"flex",gap:20,padding:18,marginBottom:14,background:selected?"#fff":"#fafafa",alignItems:"flex-start"}} onClick={onSelect}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flexShrink:0}}>
      <div style={{fontSize:11,color:selected?"#D85A30":"#aaa",fontWeight:700}}>#{idx+1}/{total}</div>
      <PinCanvas tmpl={eff} pin={pin} imgCache={imgCache} scale={0.2}/>
      <button onClick={e=>{e.stopPropagation();onDownload();}} style={{...S.btnSm,width:"100%"}}>⬇ Download</button>
    </div>
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}} onClick={e=>e.stopPropagation()}>
      <div style={S.fg}><span style={S.lbl}>Headline</span><textarea value={pin.title||""} onChange={e=>onUpdate({...pin,title:e.target.value})} style={{...S.inp,minHeight:52}}/></div>
      <div style={S.fg}><span style={S.lbl}>Subtitle</span><input style={S.inp} value={pin.subtitle||""} onChange={e=>onUpdate({...pin,subtitle:e.target.value})}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={S.fg}><span style={S.lbl}>Label strip</span><input style={S.inp} value={pin.label||""} onChange={e=>onUpdate({...pin,label:e.target.value})}/></div>
        <div style={S.fg}><span style={S.lbl}>URL</span><input style={S.inp} value={pin.url||""} onChange={e=>onUpdate({...pin,url:e.target.value})}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <ImagePosControl label="Top image" pos={pin.topPos} hasImg={!!pin.topImg} fileName={pin.topImg?(pin.topImg.startsWith("blob:")?"✓ Uploaded":pin.topImg.slice(0,34)+"…"):""} onChange={p=>onUpdate({...pin,topPos:p})} onUpload={e=>onUploadImg(e,"topImg")}/>
        {eff.layout==="two"&&<ImagePosControl label="Bottom image" pos={pin.botPos} hasImg={!!pin.botImg} fileName={pin.botImg?(pin.botImg.startsWith("blob:")?"✓ Uploaded":pin.botImg.slice(0,34)+"…"):""} onChange={p=>onUpdate({...pin,botPos:p})} onUpload={e=>onUploadImg(e,"botImg")}/>}
      </div>
      {selected?<PinStyleOverride pin={pin} onUpdate={onUpdate}/>:<div style={{fontSize:11,color:"#bbb",fontStyle:"italic"}}>Click this card to edit its custom colors & layout →</div>}
    </div>
  </div>);
}

function pinToBlob(tmpl,pin,imgCache){return new Promise(res=>{const cv=document.createElement("canvas");cv.width=PW;cv.height=PH;document.fonts.ready.then(()=>{renderPin(cv,effectiveTmpl(tmpl,pin),pin,imgCache);cv.toBlob(b=>res(b),"image/png",1);});});}
function downloadPin(tmpl,pin,imgCache){const cv=document.createElement("canvas");cv.width=PW;cv.height=PH;document.fonts.ready.then(()=>{renderPin(cv,effectiveTmpl(tmpl,pin),pin,imgCache);const a=document.createElement("a");a.download=`pin-${(pin.title||"pin").slice(0,30).replace(/\s+/g,"-")}.png`;a.href=cv.toDataURL("image/png",1);a.click();});}
async function downloadAllZip(tmpl,pins,imgCache,setProgress){
  const zip=new JSZip();
  for(let i=0;i<pins.length;i++){setProgress(`Rendering ${i+1} of ${pins.length}…`);const blob=await pinToBlob(tmpl,pins[i],imgCache);const nm=`${String(i+1).padStart(2,"0")}-${(pins[i].title||"pin").slice(0,30).replace(/[^a-z0-9]+/gi,"-")}.png`;zip.file(nm,blob);}
  setProgress("Zipping…");
  const content=await zip.generateAsync({type:"blob"});
  const a=document.createElement("a");a.download="pinterest-pins.zip";a.href=URL.createObjectURL(content);a.click();setProgress("");
}

function SingleTab({tmpl,imgCache,setImgCache}){
  const [pin,setPin]=useState({title:"Your Recipe Title Here",subtitle:"Perfect for a weeknight dinner",label:"QUICK & EASY",url:"www.yoursite.com",topImg:null,botImg:null,topPos:{x:50,y:50,zoom:100},botPos:{x:50,y:50,zoom:100}});
  function handleImg(e,slot){const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);loadImg(url).then(img=>{if(img)setImgCache(c=>({...c,[url]:img}));setPin(p=>({...p,[slot]:url}));});}
  return(<div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap"}}>
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,flexShrink:0}}>
      <PinCanvas tmpl={tmpl} pin={pin} imgCache={imgCache} scale={0.27}/>
      <button onClick={()=>downloadPin(tmpl,pin,imgCache)} style={{...S.btn,width:"100%"}}>⬇ Download (1000×2000px)</button>
    </div>
    <div style={{flex:1,minWidth:300,display:"flex",flexDirection:"column",gap:11}}>
      <div style={S.fg}><span style={S.lbl}>Headline</span><textarea value={pin.title} onChange={e=>setPin(p=>({...p,title:e.target.value}))} style={{...S.inp,minHeight:56}}/></div>
      <div style={S.fg}><span style={S.lbl}>Subtitle</span><input style={S.inp} value={pin.subtitle} onChange={e=>setPin(p=>({...p,subtitle:e.target.value}))}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={S.fg}><span style={S.lbl}>Label strip</span><input style={S.inp} value={pin.label} onChange={e=>setPin(p=>({...p,label:e.target.value}))}/></div>
        <div style={S.fg}><span style={S.lbl}>Website URL</span><input style={S.inp} value={pin.url} onChange={e=>setPin(p=>({...p,url:e.target.value}))}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <ImagePosControl label="Top image" pos={pin.topPos} hasImg={!!pin.topImg} onChange={p=>setPin(x=>({...x,topPos:p}))} onUpload={e=>handleImg(e,"topImg")}/>
        {tmpl.layout==="two"&&<ImagePosControl label="Bottom image" pos={pin.botPos} hasImg={!!pin.botImg} onChange={p=>setPin(x=>({...x,botPos:p}))} onUpload={e=>handleImg(e,"botImg")}/>}
      </div>
    </div>
  </div>);
}

function CSVTab({tmpl,imgCache,setImgCache}){
  const [headers,setHeaders]=useState([]);const [rows,setRows]=useState([]);
  const [mapping,setMapping]=useState({title:"",subtitle:"",label:"",url:"",topImg:"",botImg:""});
  const [pins,setPins]=useState([]);const [mapped,setMapped]=useState(false);const [sel,setSel]=useState(0);const [progress,setProgress]=useState("");
  function handleFile(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const{headers,rows}=parseCSV(ev.target.result);setHeaders(headers);setRows(rows);setMapped(false);setPins([]);setMapping({title:headers[0]||"",subtitle:headers[1]||"",label:"",url:"",topImg:"",botImg:""});};r.readAsText(f);}
  function applyMapping(){const np=rows.map(row=>({title:row[mapping.title]||"",subtitle:row[mapping.subtitle]||"",label:row[mapping.label]||"",url:row[mapping.url]||"",topImg:row[mapping.topImg]||null,botImg:row[mapping.botImg]||null,topPos:{x:50,y:50,zoom:100},botPos:{x:50,y:50,zoom:100}}));setPins(np);setMapped(true);setSel(0);np.forEach(p=>[p.topImg,p.botImg].forEach(src=>{if(src&&!imgCache[src])loadImg(src).then(img=>{if(img)setImgCache(c=>({...c,[src]:img}));});}));}
  function handleUpImg(idx,e,slot){const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);loadImg(url).then(img=>{if(img)setImgCache(c=>({...c,[url]:img}));setPins(ps=>ps.map((p,i)=>i===idx?{...p,[slot]:url}:p));});}
  const sampleCSV="data:text/csv;charset=utf-8,title,subtitle,label,url,image_top,image_bot\nMy Best Recipe,Easy weeknight dinner,QUICK %26 EASY,www.site.com,,";
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={S.card}>
      <div style={{fontSize:13,fontWeight:700}}>Step 1 — Upload your CSV</div>
      <input type="file" accept=".csv" onChange={handleFile}/>
      <div style={{fontSize:12,color:"#888"}}>Any column names — you'll map them next. <a href={sampleCSV} download="pin-template.csv" style={{color:"#185FA5"}}>Download sample CSV</a></div>
    </div>
    {headers.length>0&&!mapped&&(<div style={S.card}>
      <div style={{fontSize:13,fontWeight:700}}>Step 2 — Map your columns <span style={{color:"#888",fontWeight:400}}>({rows.length} rows)</span></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[["title","Headline *"],["subtitle","Subtitle"],["label","Label strip"],["url","Website URL"],["topImg","Top image URL"],["botImg","Bottom image URL"]].map(([k,lbl])=>(
          <div key={k} style={S.fg}><span style={S.lbl}>{lbl}</span>
            <select style={S.inp} value={mapping[k]} onChange={e=>setMapping(m=>({...m,[k]:e.target.value}))}><option value="">— skip —</option>{headers.map(h=><option key={h} value={h}>{h}</option>)}</select></div>))}
      </div>
      <button onClick={applyMapping} style={{...S.btn,alignSelf:"flex-start"}}>Generate {rows.length} pins →</button>
    </div>)}
    {mapped&&pins.length>0&&(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:13,fontWeight:700}}>{pins.length} pins — click a card to customize it</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {progress&&<span style={{fontSize:12,color:"#185FA5",fontWeight:600}}>{progress}</span>}
          <button onClick={()=>downloadAllZip(tmpl,pins,imgCache,setProgress)} style={{...S.btn,background:"#2C3E2D"}}>⬇ Download all (ZIP)</button>
          <button onClick={()=>setMapped(false)} style={{fontSize:12,color:"#185FA5",background:"none",border:"none",cursor:"pointer"}}>← Re-map</button>
        </div>
      </div>
      {pins.map((pin,i)=><PinRow key={i} pin={pin} idx={i} total={pins.length} tmpl={tmpl} imgCache={imgCache} selected={sel===i} onSelect={()=>setSel(i)} onUpdate={p=>setPins(ps=>ps.map((x,j)=>j===i?p:x))} onDownload={()=>downloadPin(tmpl,pin,imgCache)} onUploadImg={(e,slot)=>handleUpImg(i,e,slot)}/>)}
    </div>)}
  </div>);
}

function SitemapTab({tmpl,imgCache,setImgCache}){
  const [url,setUrl]=useState("");const [status,setStatus]=useState("");const [pins,setPins]=useState([]);
  const [loading,setLoading]=useState(false);const [done,setDone]=useState(false);const [sel,setSel]=useState(0);const [progress,setProgress]=useState("");
  async function scrape(){
    if(!url)return;setLoading(true);setStatus("Fetching sitemap…");setPins([]);setDone(false);
    try{
      const xmlText=await fetchViaProxy(url);
      const doc=new DOMParser().parseFromString(xmlText,"text/xml");
      let locs=[...doc.querySelectorAll("loc")].map(l=>l.textContent.trim());
      const childSitemaps=locs.filter(u=>u.endsWith(".xml"));
      let pageLocs=locs.filter(u=>!u.endsWith(".xml"));
      if(pageLocs.length===0&&childSitemaps.length>0){
        setStatus("Sitemap index detected — loading first child sitemap…");
        const cx=await fetchViaProxy(childSitemaps[0]);
        const cdoc=new DOMParser().parseFromString(cx,"text/xml");
        pageLocs=[...cdoc.querySelectorAll("loc")].map(l=>l.textContent.trim()).filter(u=>!u.endsWith(".xml"));
      }
      pageLocs=pageLocs.slice(0,30);
      if(!pageLocs.length){setStatus("No page URLs found. Try a direct post-sitemap URL.");setLoading(false);return;}
      setStatus(`Found ${pageLocs.length} pages. Scraping metadata…`);
      const results=[];
      for(let i=0;i<pageLocs.length;i++){
        setStatus(`Scraping page ${i+1} of ${pageLocs.length}…`);
        try{
          const html=await fetchViaProxy(pageLocs[i]);
          const pdoc=new DOMParser().parseFromString(html,"text/html");
          const gm=s=>pdoc.querySelector(s)?.getAttribute("content")||"";
          const title=gm('meta[property="og:title"]')||pdoc.querySelector("title")?.textContent?.trim()||pdoc.querySelector("h1")?.textContent?.trim()||"";
          const desc=gm('meta[name="description"]')||gm('meta[property="og:description"]')||"";
          const img=gm('meta[property="og:image"]')||gm('meta[name="twitter:image"]')||"";
          results.push({pageUrl:pageLocs[i],title:title.slice(0,80),desc:desc.slice(0,120),img});
        }catch{results.push({pageUrl:pageLocs[i],title:pageLocs[i].split("/").filter(Boolean).pop().replace(/-/g," "),desc:"",img:""});}
      }
      const np=results.map(p=>({title:p.title,subtitle:p.desc,label:"",url:(()=>{try{return new URL(p.pageUrl).hostname;}catch{return"";}})(),topImg:p.img||null,botImg:null,topPos:{x:50,y:50,zoom:100},botPos:{x:50,y:50,zoom:100}}));
      setPins(np);setDone(true);setSel(0);setStatus(`✓ Done! ${results.length} pins ready.`);
      np.forEach(p=>{if(p.topImg&&!imgCache[p.topImg])loadImg(p.topImg).then(img=>{if(img)setImgCache(c=>({...c,[p.topImg]:img}));});});
    }catch(err){setStatus("Couldn't scrape this site (it may block bots). "+err.message+". Try the CSV tab instead.");}
    setLoading(false);
  }
  function handleUpImg(idx,e,slot){const f=e.target.files[0];if(!f)return;const u=URL.createObjectURL(f);loadImg(u).then(img=>{if(img)setImgCache(c=>({...c,[u]:img}));setPins(ps=>ps.map((p,i)=>i===idx?{...p,[slot]:u}:p));});}
  return(<div style={{display:"flex",flexDirection:"column",gap:16}}>
    <div style={S.card}>
      <div style={{fontSize:13,fontWeight:700}}>Scrape from your sitemap</div>
      <div style={{fontSize:12,color:"#888"}}>Pulls page title, meta description, OG image and URL. Tries multiple proxies automatically.</div>
      <div style={{display:"flex",gap:8}}>
        <input style={{...S.inp,flex:1}} value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yoursite.com/post-sitemap.xml"/>
        <button onClick={scrape} disabled={loading||!url} style={{...S.btn,opacity:loading?0.6:1,cursor:loading?"not-allowed":"pointer",whiteSpace:"nowrap"}}>{loading?"Scraping…":"Scrape →"}</button>
      </div>
      {status&&<div style={{fontSize:12,color:loading?"#185FA5":(status.startsWith("✓")?"#3B6D11":"#993C1D"),fontWeight:600}}>{status}</div>}
    </div>
    {done&&pins.length>0&&(<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{fontSize:13,fontWeight:700}}>{pins.length} pins — click a card to customize it</div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {progress&&<span style={{fontSize:12,color:"#185FA5",fontWeight:600}}>{progress}</span>}
          <button onClick={()=>downloadAllZip(tmpl,pins,imgCache,setProgress)} style={{...S.btn,background:"#2C3E2D"}}>⬇ Download all (ZIP)</button>
        </div>
      </div>
      {pins.map((pin,i)=><PinRow key={i} pin={pin} idx={i} total={pins.length} tmpl={tmpl} imgCache={imgCache} selected={sel===i} onSelect={()=>setSel(i)} onUpdate={p=>setPins(ps=>ps.map((x,j)=>j===i?p:x))} onDownload={()=>downloadPin(tmpl,pin,imgCache)} onUploadImg={(e,slot)=>handleUpImg(i,e,slot)}/>)}
    </div>)}
  </div>);
}

function App(){
  const [tab,setTab]=useState("single");const [tmpl,setTmpl]=useState(DEFAULT_TMPL);
  const [localFont,setLocalFont]=useState(null);const [imgCache,setImgCache]=useState({});const [tmplOpen,setTmplOpen]=useState(true);
  const TABS=[{id:"single",label:"Single Pin"},{id:"csv",label:"CSV Batch"},{id:"sitemap",label:"Sitemap Scraper"}];
  return(<div style={{fontFamily:"'Poppins',sans-serif"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,paddingBottom:14,borderBottom:"2px solid #eee",flexWrap:"wrap",gap:10}}>
      <div><div style={{fontSize:20,fontWeight:800,color:"#1A1A1A",letterSpacing:"-.02em"}}>📌 Pinterest Pin Studio</div>
        <div style={{fontSize:12,color:"#aaa",marginTop:1}}>Templates · per-pin styling · batch ZIP · 1000×2000px</div></div>
      <button onClick={()=>setTmplOpen(o=>!o)} style={{padding:"7px 16px",border:"0.5px solid #ddd",borderRadius:8,background:tmplOpen?"#1A1A1A":"#f5f5f5",color:tmplOpen?"#fff":"#222",fontSize:12,fontWeight:700,cursor:"pointer"}}>{tmplOpen?"Hide template ✕":"Edit template ✏️"}</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:tmplOpen?"310px 1fr":"1fr",gap:28,alignItems:"start"}}>
      {tmplOpen&&(<div style={{borderRight:"0.5px solid #eee",paddingRight:24}}>
        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#bbb",marginBottom:10}}>Template — base style for all pins</div>
        <TemplatePanel tmpl={tmpl} setTmpl={setTmpl} localFontStack={localFont} setLocalFontStack={setLocalFont}/></div>)}
      <div>
        <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:"2px solid #eee"}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"9px 20px",border:"none",borderBottom:tab===t.id?"2.5px solid #D85A30":"2.5px solid transparent",background:"none",fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?"#D85A30":"#aaa",cursor:"pointer",fontFamily:"'Poppins',sans-serif",marginBottom:-2}}>{t.label}</button>)}
        </div>
        {tab==="single"&&<SingleTab tmpl={tmpl} imgCache={imgCache} setImgCache={setImgCache}/>}
        {tab==="csv"&&<CSVTab tmpl={tmpl} imgCache={imgCache} setImgCache={setImgCache}/>}
        {tab==="sitemap"&&<SitemapTab tmpl={tmpl} imgCache={imgCache} setImgCache={setImgCache}/>}
      </div>
    </div>
  </div>);
}
export default App;
