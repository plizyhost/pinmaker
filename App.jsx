import { useState, useEffect, useRef } from "react";

const GFONTS = [
  { name: "Poppins", cat: "Sans-serif", stack: "'Poppins',sans-serif" },
  { name: "Montserrat", cat: "Sans-serif", stack: "'Montserrat',sans-serif" },
  { name: "Raleway", cat: "Sans-serif", stack: "'Raleway',sans-serif" },
  { name: "Nunito", cat: "Sans-serif", stack: "'Nunito',sans-serif" },
  { name: "Josefin Sans", cat: "Sans-serif", stack: "'Josefin Sans',sans-serif" },
  { name: "Quicksand", cat: "Rounded", stack: "'Quicksand',sans-serif" },
  { name: "Comfortaa", cat: "Rounded", stack: "'Comfortaa',sans-serif" },
  { name: "Bebas Neue", cat: "Display", stack: "'Bebas Neue',sans-serif" },
  { name: "Anton", cat: "Display", stack: "'Anton',sans-serif" },
  { name: "Oswald", cat: "Display", stack: "'Oswald',sans-serif" },
  { name: "Fjalla One", cat: "Display", stack: "'Fjalla One',sans-serif" },
  { name: "Righteous", cat: "Display", stack: "'Righteous',sans-serif" },
  { name: "Alfa Slab One", cat: "Display", stack: "'Alfa Slab One',serif" },
  { name: "Abril Fatface", cat: "Display", stack: "'Abril Fatface',serif" },
  { name: "Secular One", cat: "Display", stack: "'Secular One',sans-serif" },
  { name: "Playfair Display", cat: "Serif", stack: "'Playfair Display',serif" },
  { name: "Merriweather", cat: "Serif", stack: "'Merriweather',serif" },
  { name: "Lora", cat: "Serif", stack: "'Lora',serif" },
  { name: "Cinzel", cat: "Serif", stack: "'Cinzel',serif" },
  { name: "Cormorant Garamond", cat: "Serif", stack: "'Cormorant Garamond',serif" },
  { name: "Spectral", cat: "Serif", stack: "'Spectral',serif" },
  { name: "Dancing Script", cat: "Script", stack: "'Dancing Script',cursive" },
  { name: "Pacifico", cat: "Script", stack: "'Pacifico',cursive" },
  { name: "Lobster", cat: "Script", stack: "'Lobster',cursive" },
  { name: "Satisfy", cat: "Script", stack: "'Satisfy',cursive" },
  { name: "Great Vibes", cat: "Script", stack: "'Great Vibes',cursive" },
  { name: "Permanent Marker", cat: "Handwriting", stack: "'Permanent Marker',cursive" },
];

const FONT_URL = `https://fonts.googleapis.com/css2?${GFONTS.map(f => `family=${f.name.replace(/ /g, "+")}:ital,wght@0,400;0,700;0,900;1,700`).join("&")}&display=swap`;

const DEFAULT_TMPL = {
  layout: "two",
  fontStack: "'Poppins',sans-serif",
  fontWeight: "900",
  fontStyle: "normal",
  uppercase: true,
  fontScale: 100,
  bannerH: 560,
  bannerW: 100,
  bannerR: 20,
  bannerPad: 60,
  colors: { band: "#FFFFFF", title: "#D85A30", label: "#3B2A1A" },
};

const PW = 1000, PH = 2000;

function renderPin(cv, tmpl, pin, imgCache) {
  const ctx = cv.getContext("2d");
  const { layout, fontStack, fontWeight, fontStyle, uppercase, fontScale, bannerH, bannerW, bannerR, bannerPad, colors } = tmpl;
  const { title = "", subtitle = "", label = "", url = "", topImg, botImg } = pin;
  const tfsBase = Math.round(108 * fontScale / 100);
  const sfs = Math.round(40 * fontScale / 100);
  const lfs = Math.round(38 * fontScale / 100);
  const mainTxt = uppercase ? title.toUpperCase() : title;

  function lightness(hex) {
    if (!hex || hex.length < 7) return 128;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return (r*299 + g*587 + b*114) / 1000;
  }
  function labelTxt(bg) { return lightness(bg) > 128 ? "#1A1A1A" : "#FFFFFF"; }
  function subColor(bg) { return lightness(bg) > 128 ? "#666" : "rgba(255,255,255,.75)"; }

  function drawImg(img, x, y, w, h) {
    if (!img) {
      ctx.fillStyle = "#E8E0D5"; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "#B0A898"; ctx.font = `500 28px 'Poppins',sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("No image", x + w/2, y + h/2);
      return;
    }
    const sc = Math.max(w/img.width, h/img.height);
    ctx.drawImage(img, x+(w-img.width*sc)/2, y+(h-img.height*sc)/2, img.width*sc, img.height*sc);
  }

  function wrapText(text, maxW, maxLines) {
    const words = text.split(" "); let line = ""; const lines = [];
    for (const w of words) {
      const t = line ? line+" "+w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return maxLines ? lines.slice(0, maxLines) : lines;
  }

  function drawLabel(text, cx, y) {
    if (!text) return 0;
    ctx.font = `700 normal ${lfs}px 'Poppins',sans-serif`;
    const tw = ctx.measureText(text).width;
    const pad = 56, ph = lfs + 32;
    ctx.fillStyle = colors.label;
    ctx.beginPath(); ctx.roundRect(cx-tw/2-pad/2, y, tw+pad, ph, ph/2); ctx.fill();
    ctx.fillStyle = labelTxt(colors.label);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, cx, y+ph/2);
    return ph + 20;
  }

  function drawBanner(cx, cy) {
    const bw = Math.round(PW * bannerW / 100);
    const bx = cx - bw/2;
    const r = bannerW < 100 ? bannerR : 0;
    ctx.save();
    ctx.fillStyle = colors.band;
    ctx.beginPath(); ctx.roundRect(bx, cy, bw, bannerH, r); ctx.fill();
    ctx.beginPath(); ctx.roundRect(bx, cy, bw, bannerH, r); ctx.clip();
    let ty = cy + bannerPad;
    ty += drawLabel(label, cx, ty);
    ctx.font = `${fontStyle} ${fontWeight} ${tfsBase}px ${fontStack}`;
    ctx.fillStyle = colors.title; ctx.textAlign = "center"; ctx.textBaseline = "top";
    const lines = wrapText(mainTxt, bw - 80, 5);
    lines.forEach(l => { ctx.fillText(l, cx, ty); ty += tfsBase * 1.18; });
    if (subtitle) {
      ty += 6; ctx.font = `400 normal ${sfs}px 'Poppins',sans-serif`;
      ctx.fillStyle = subColor(colors.band); ctx.fillText(subtitle, cx, ty);
    }
    ctx.restore();
  }

  function drawUrl(y, isOverlay) {
    if (!url) return;
    if (isOverlay) { ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(0,y,PW,80); ctx.fillStyle = "#fff"; }
    else { ctx.fillStyle = lightness(colors.band)>128 ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.08)"; ctx.fillRect(0,y,PW,80); ctx.fillStyle = subColor(colors.band); }
    ctx.font = `600 34px 'Poppins',sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(url.toLowerCase(), PW/2, y+40);
  }

  ctx.clearRect(0,0,PW,PH);
  ctx.save(); ctx.beginPath(); ctx.roundRect(0,0,PW,PH,28); ctx.clip();
  const topImgEl = topImg ? imgCache[topImg] : null;
  const botImgEl = botImg ? imgCache[botImg] : null;

  if (layout === "two") {
    const rem = PH - bannerH - 80; const tph = Math.round(rem/2);
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,PW,tph); ctx.clip(); drawImg(topImgEl,0,0,PW,tph); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(0,tph+bannerH,PW,rem-tph); ctx.clip(); drawImg(botImgEl,0,tph+bannerH,PW,rem-tph); ctx.restore();
    drawBanner(PW/2, tph); drawUrl(PH-80, false);
  } else if (layout === "top") {
    drawBanner(PW/2, 0);
    ctx.save(); ctx.beginPath(); ctx.rect(0,bannerH,PW,PH-bannerH-80); ctx.clip(); drawImg(topImgEl,0,bannerH,PW,PH-bannerH-80); ctx.restore();
    drawUrl(PH-80, true);
  } else if (layout === "one") {
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,PW,PH); ctx.clip(); drawImg(topImgEl,0,0,PW,PH); ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,.36)"; ctx.fillRect(0,0,PW,PH);
    drawBanner(PW/2, Math.round((PH-bannerH)/2)); drawUrl(PH-80, true);
  } else {
    const ph = PH - bannerH - 80;
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,PW,ph); ctx.clip(); drawImg(topImgEl,0,0,PW,ph); ctx.restore();
    drawBanner(PW/2, ph); drawUrl(PH-80, false);
  }
  ctx.restore();
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g,""));
  const rows = lines.slice(1).map(line => {
    const vals = []; let cur = ""; let inQ = false;
    for (const ch of line) {
      if (ch==='"') inQ=!inQ;
      else if (ch==="," && !inQ) { vals.push(cur.trim()); cur=""; }
      else cur += ch;
    }
    vals.push(cur.trim());
    return Object.fromEntries(headers.map((h,i) => [h, vals[i]||""]));
  });
  return { headers, rows };
}

async function loadImageFromUrl(src) {
  return new Promise(res => {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => res(img); img.onerror = () => res(null); img.src = src;
  });
}

function SectionHead({ icon, label }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#888",padding:"8px 0 3px",borderTop:"0.5px solid #e5e5e5",marginTop:4}}>
      {label}
    </div>
  );
}

function RangeRow({ label, min, max, step=1, value, onChange, fmt=v=>v }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      <div style={{fontSize:12,fontWeight:600,color:"#666"}}>{label}</div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} style={{flex:1,accentColor:"#D85A30"}}/>
        <span style={{fontSize:13,fontWeight:700,minWidth:44,textAlign:"right",color:"#222"}}>{fmt(value)}</span>
      </div>
    </div>
  );
}

const BAND_COLORS = ["#FFFFFF","#FFF8F2","#F3EDE3","#1A1A1A","#2C3E2D","#3B2A1A","#D85A30","#185FA5","#7B4EA0","#FAC775"];
const TITLE_COLORS = ["#D85A30","#1A1A1A","#3B2A1A","#185FA5","#2C3E2D","#7B4EA0","#FFFFFF","#FAC775"];
const LABEL_COLORS = ["#3B2A1A","#D85A30","#1A1A1A","#185FA5","#2C3E2D","#7B4EA0","#FFFFFF"];

function SwatchRow({ value, options, onChange }) {
  return (
    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
      {options.map(c => (
        <div key={c} onClick={()=>onChange(c)} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",flexShrink:0,border:value===c?"2px solid #333":"2px solid transparent",outline:value===c?"2px solid #aaa":"none",outlineOffset:1,boxShadow:c==="#FFFFFF"?"inset 0 0 0 0.5px #ccc":"none",transform:value===c?"scale(1.18)":"scale(1)",transition:"transform .15s"}}/>
      ))}
    </div>
  );
}

const INP = {width:"100%",padding:"7px 10px",border:"0.5px solid #ddd",borderRadius:8,fontFamily:"'Poppins',sans-serif",fontSize:13,background:"#fff",color:"#222"};

function TemplatePanel({ tmpl, setTmpl, localFontStack, setLocalFontStack }) {
  const [fontSearch, setFontSearch] = useState("Poppins");
  const [ddOpen, setDdOpen] = useState(false);
  const [localName, setLocalName] = useState("");
  const [localPreview, setLocalPreview] = useState(null);
  const filtered = GFONTS.filter(f => f.name.toLowerCase().includes(fontSearch.toLowerCase()));

  function set(key, val) { setTmpl(t => ({...t, [key]: val})); }
  function setColor(key, val) { setTmpl(t => ({...t, colors:{...t.colors,[key]:val}})); }

  function handleLocalFont(e) {
    const f = e.target.files[0]; if (!f) return;
    const name = "LocalFont_" + Date.now();
    const ff = new FontFace(name, `url(${URL.createObjectURL(f)})`);
    ff.load().then(loaded => {
      document.fonts.add(loaded);
      const stack = `'${name}',sans-serif`;
      setLocalFontStack(stack); setLocalName(f.name); setLocalPreview(stack);
    }).catch(() => setLocalName("Failed to load"));
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:11}}>
      <SectionHead label="Layout" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[["two","Two Photos","text in middle"],["top","Top Banner","text at top"],["one","One Photo","text overlay"],["bot","Bottom Banner","text at bottom"]].map(([id,name,sub])=>(
          <div key={id} onClick={()=>set("layout",id)} style={{padding:"10px 8px",border:"0.5px solid #ddd",borderRadius:12,background:tmpl.layout===id?"#1A1A1A":"#f5f5f5",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:700,color:tmpl.layout===id?"#fff":"#222"}}>{name}</div>
            <div style={{fontSize:11,color:tmpl.layout===id?"rgba(255,255,255,.6)":"#888"}}>{sub}</div>
          </div>
        ))}
      </div>

      <SectionHead label="Headline Font" />
      <div style={{position:"relative"}}>
        <input style={INP} value={fontSearch} onChange={e=>{setFontSearch(e.target.value);setDdOpen(true);}} onFocus={()=>setDdOpen(true)} placeholder="Search Google Fonts…" autoComplete="off"/>
        {ddOpen && filtered.length>0 && (
          <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"0.5px solid #ddd",borderRadius:8,zIndex:99,maxHeight:180,overflowY:"auto",boxShadow:"0 4px 16px rgba(0,0,0,.12)"}}>
            {filtered.map(f=>(
              <div key={f.name} onClick={()=>{set("fontStack",f.stack);setFontSearch(f.name);setDdOpen(false);}}
                style={{padding:"8px 12px",cursor:"pointer",fontSize:14,borderBottom:"0.5px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontFamily:f.stack,fontWeight:700}}>{f.name}</span>
                <span style={{fontSize:10,color:"#aaa"}}>{f.cat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{padding:"10px 14px",background:"#f5f5f5",borderRadius:8,fontSize:22,textAlign:"center",fontFamily:tmpl.fontStack,fontWeight:700,color:"#222",minHeight:48,lineHeight:1.3}}>Your Headline</div>

      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Weight / Style</div>
        <select style={INP} value={`${tmpl.fontWeight} ${tmpl.fontStyle}`} onChange={e=>{const [w,s]=e.target.value.split(" ");set("fontWeight",w);set("fontStyle",s);}}>
          <option value="900 normal">Black / Extra Bold</option>
          <option value="700 normal">Bold</option>
          <option value="700 italic">Bold Italic</option>
          <option value="900 italic">Black Italic</option>
          <option value="400 normal">Regular</option>
          <option value="400 italic">Regular Italic</option>
        </select>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Uppercase</div>
        <select style={INP} value={tmpl.uppercase?"1":"0"} onChange={e=>set("uppercase",e.target.value==="1")}>
          <option value="1">Yes — ALL CAPS</option>
          <option value="0">No — keep as typed</option>
        </select>
      </div>

      <SectionHead label="Local Font Upload" />
      <div style={{background:"#f5f5f5",border:"0.5px dashed #ccc",borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:8}}>
        <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleLocalFont} style={{fontSize:12}}/>
        {localName && <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:12,color:"#666"}}>{localName}</span>
          {localFontStack && <button onClick={()=>set("fontStack",localFontStack)} style={{padding:"4px 10px",background:"#fff",border:"0.5px solid #ddd",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Use this font</button>}
        </div>}
        {localPreview && <div style={{padding:"8px 14px",background:"#fff",borderRadius:8,fontSize:20,fontFamily:localPreview,fontWeight:700,textAlign:"center"}}>Your Headline</div>}
      </div>

      <SectionHead label="Banner Size" />
      <div style={{background:"#f5f5f5",border:"0.5px solid #e5e5e5",borderRadius:8,padding:12,display:"flex",flexDirection:"column",gap:10}}>
        <RangeRow label="Height" min={150} max={900} step={10} value={tmpl.bannerH} onChange={v=>set("bannerH",v)} fmt={v=>`${v}px`}/>
        <RangeRow label="Width" min={40} max={100} step={1} value={tmpl.bannerW} onChange={v=>set("bannerW",v)} fmt={v=>`${v}%`}/>
        {tmpl.bannerW<100 && <RangeRow label="Corner radius" min={0} max={80} step={2} value={tmpl.bannerR} onChange={v=>set("bannerR",v)} fmt={v=>`${v}px`}/>}
        <RangeRow label="Vertical padding" min={20} max={120} step={4} value={tmpl.bannerPad} onChange={v=>set("bannerPad",v)} fmt={v=>`${v}px`}/>
      </div>

      <SectionHead label="Font Size" />
      <RangeRow label="Headline scale" min={40} max={160} step={1} value={tmpl.fontScale} onChange={v=>set("fontScale",v)} fmt={v=>`${v}`}/>

      <SectionHead label="Colors" />
      <div style={{display:"flex",flexDirection:"column",gap:3}}><div style={{fontSize:12,fontWeight:600,color:"#666"}}>Banner background</div><SwatchRow value={tmpl.colors.band} options={BAND_COLORS} onChange={v=>setColor("band",v)}/></div>
      <div style={{display:"flex",flexDirection:"column",gap:3}}><div style={{fontSize:12,fontWeight:600,color:"#666"}}>Headline color</div><SwatchRow value={tmpl.colors.title} options={TITLE_COLORS} onChange={v=>setColor("title",v)}/></div>
      <div style={{display:"flex",flexDirection:"column",gap:3}}><div style={{fontSize:12,fontWeight:600,color:"#666"}}>Label strip color</div><SwatchRow value={tmpl.colors.label} options={LABEL_COLORS} onChange={v=>setColor("label",v)}/></div>
    </div>
  );
}

function PinCanvas({ tmpl, pin, imgCache, scale=0.27 }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    document.fonts.ready.then(() => renderPin(ref.current, tmpl, pin, imgCache));
  }, [tmpl, pin, imgCache]);
  return <canvas ref={ref} width={PW} height={PH} style={{width:PW*scale,height:PH*scale,borderRadius:8,boxShadow:"0 2px 16px rgba(0,0,0,.18)",flexShrink:0}}/>;
}

function PinEditorRow({ pin, idx, total, tmpl, imgCache, onUpdate, onDownload, onUploadImg }) {
  function handleImg(e, slot) { onUploadImg(e, slot); }
  return (
    <div style={{display:"flex",gap:20,padding:"20px 0",borderBottom:"0.5px solid #eee",alignItems:"flex-start"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{fontSize:11,color:"#aaa",fontWeight:700}}>#{idx+1} / {total}</div>
        <PinCanvas tmpl={tmpl} pin={pin} imgCache={imgCache} scale={0.22}/>
        <button onClick={onDownload} style={{padding:"6px 14px",background:"#D85A30",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",width:"100%"}}>⬇ Download</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <div style={{fontSize:11,fontWeight:600,color:"#666"}}>Headline</div>
          <textarea value={pin.title||""} onChange={e=>onUpdate({...pin,title:e.target.value})} style={{...INP,minHeight:52,resize:"vertical"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <div style={{fontSize:11,fontWeight:600,color:"#666"}}>Subtitle</div>
          <input style={INP} value={pin.subtitle||""} onChange={e=>onUpdate({...pin,subtitle:e.target.value})}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{fontSize:11,fontWeight:600,color:"#666"}}>Label strip</div>
            <input style={INP} value={pin.label||""} onChange={e=>onUpdate({...pin,label:e.target.value})}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{fontSize:11,fontWeight:600,color:"#666"}}>URL</div>
            <input style={INP} value={pin.url||""} onChange={e=>onUpdate({...pin,url:e.target.value})}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{fontSize:11,fontWeight:600,color:"#666"}}>Top image</div>
            <input type="file" accept="image/*" onChange={e=>handleImg(e,"topImg")} style={{fontSize:11}}/>
            {pin.topImg && <div style={{fontSize:10,color:"#aaa",wordBreak:"break-all"}}>{pin.topImg.startsWith("blob:")?"✓ Uploaded":pin.topImg.slice(0,40)+"…"}</div>}
          </div>
          {tmpl.layout==="two" && (
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              <div style={{fontSize:11,fontWeight:600,color:"#666"}}>Bottom image</div>
              <input type="file" accept="image/*" onChange={e=>handleImg(e,"botImg")} style={{fontSize:11}}/>
              {pin.botImg && <div style={{fontSize:10,color:"#aaa",wordBreak:"break-all"}}>{pin.botImg.startsWith("blob:")?"✓ Uploaded":pin.botImg.slice(0,40)+"…"}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CSVTab({ tmpl, imgCache, setImgCache }) {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({title:"",subtitle:"",label:"",url:"",topImg:"",botImg:""});
  const [pins, setPins] = useState([]);
  const [mapped, setMapped] = useState(false);

  function handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      const {headers, rows} = parseCSV(ev.target.result);
      setHeaders(headers); setRows(rows); setMapped(false); setPins([]);
      setMapping({title:headers[0]||"",subtitle:headers[1]||"",label:"",url:"",topImg:"",botImg:""});
    };
    r.readAsText(f);
  }

  function applyMapping() {
    const newPins = rows.map(row => ({
      title:row[mapping.title]||"", subtitle:row[mapping.subtitle]||"",
      label:row[mapping.label]||"", url:row[mapping.url]||"",
      topImg:row[mapping.topImg]||null, botImg:row[mapping.botImg]||null,
    }));
    setPins(newPins); setMapped(true);
    newPins.forEach(p => {
      [p.topImg,p.botImg].forEach(src => {
        if (src && !imgCache[src]) loadImageFromUrl(src).then(img => { if(img) setImgCache(c=>({...c,[src]:img})); });
      });
    });
  }

  function handleUploadImg(idx, e, slot) {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f);
    loadImageFromUrl(url).then(img => {
      if (img) setImgCache(c=>({...c,[url]:img}));
      setPins(ps=>ps.map((p,i)=>i===idx?{...p,[slot]:url}:p));
    });
  }

  function downloadPin(pin) {
    const cv = document.createElement("canvas"); cv.width=PW; cv.height=PH;
    document.fonts.ready.then(()=>{
      renderPin(cv,tmpl,pin,imgCache);
      const a=document.createElement("a"); a.download=`pin-${(pin.title||"pin").slice(0,30).replace(/\s+/g,"-")}.png`;
      a.href=cv.toDataURL("image/png",1.0); a.click();
    });
  }

  const sampleCSV = "data:text/csv;charset=utf-8,title,subtitle,label,url,image_top,image_bot\nMy Best Recipe,Easy weeknight dinner,QUICK %26 EASY,www.site.com,,";

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:"#f9f9f9",border:"0.5px solid #e5e5e5",borderRadius:8,padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:13,fontWeight:700}}>Step 1 — Upload your CSV</div>
        <input type="file" accept=".csv" onChange={handleFile} style={{fontSize:13}}/>
        <div style={{fontSize:12,color:"#888"}}>Any column names — you'll map them next. <a href={sampleCSV} download="pin-template.csv" style={{color:"#185FA5"}}>Download sample CSV</a></div>
      </div>
      {headers.length>0 && !mapped && (
        <div style={{background:"#f9f9f9",border:"0.5px solid #e5e5e5",borderRadius:8,padding:16,display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontSize:13,fontWeight:700}}>Step 2 — Map your columns ({rows.length} rows found)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[["title","Headline *"],["subtitle","Subtitle"],["label","Label strip"],["url","Website URL"],["topImg","Top image URL"],["botImg","Bottom image URL"]].map(([key,label])=>(
              <div key={key} style={{display:"flex",flexDirection:"column",gap:3}}>
                <div style={{fontSize:12,fontWeight:600,color:"#666"}}>{label}</div>
                <select style={INP} value={mapping[key]} onChange={e=>setMapping(m=>({...m,[key]:e.target.value}))}>
                  <option value="">— skip —</option>
                  {headers.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button onClick={applyMapping} style={{padding:"9px 20px",background:"#D85A30",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer",alignSelf:"flex-start"}}>
            Generate {rows.length} pins →
          </button>
        </div>
      )}
      {mapped && pins.length>0 && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700}}>{pins.length} pins — tweak each, then download</div>
            <button onClick={()=>setMapped(false)} style={{fontSize:12,color:"#185FA5",background:"none",border:"none",cursor:"pointer"}}>← Re-map columns</button>
          </div>
          {pins.map((pin,i)=>(
            <PinEditorRow key={i} pin={pin} idx={i} total={pins.length} tmpl={tmpl} imgCache={imgCache}
              onUpdate={p=>setPins(ps=>ps.map((x,j)=>j===i?p:x))}
              onDownload={()=>downloadPin(pin)}
              onUploadImg={(e,slot)=>handleUploadImg(i,e,slot)}/>
          ))}
        </div>
      )}
    </div>
  );
}

function SitemapTab({ tmpl, imgCache, setImgCache }) {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [status, setStatus] = useState("");
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraped, setScraped] = useState(false);

  async function scrapeSitemap() {
    if (!sitemapUrl) return;
    setLoading(true); setStatus("Fetching sitemap…"); setPins([]); setScraped(false);
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(sitemapUrl)}`);
      const data = await res.json();
      const doc = new DOMParser().parseFromString(data.contents, "text/xml");
      const locs = [...doc.querySelectorAll("loc")].map(l=>l.textContent.trim()).filter(u=>!u.endsWith(".xml")).slice(0,30);
      if (!locs.length) { setStatus("No page URLs found. Try a different sitemap URL."); setLoading(false); return; }
      setStatus(`Found ${locs.length} pages. Scraping metadata…`);
      const results = [];
      for (let i=0; i<locs.length; i++) {
        setStatus(`Scraping page ${i+1} of ${locs.length}…`);
        try {
          const pRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(locs[i])}`);
          const pData = await pRes.json();
          const pdoc = new DOMParser().parseFromString(pData.contents,"text/html");
          const title = pdoc.querySelector("title")?.textContent?.trim() || pdoc.querySelector("h1")?.textContent?.trim() || "";
          const desc = pdoc.querySelector('meta[name="description"]')?.getAttribute("content") || pdoc.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
          const img = pdoc.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
          results.push({pageUrl:locs[i], title:title.slice(0,80), desc:desc.slice(0,120), img});
        } catch { results.push({pageUrl:locs[i],title:locs[i],desc:"",img:""}); }
      }
      const newPins = results.map(p=>({
        title:p.title, subtitle:p.desc, label:"", url:new URL(p.pageUrl).hostname,
        topImg:p.img||null, botImg:null,
      }));
      setPins(newPins); setScraped(true);
      setStatus(`Done! ${results.length} pins ready.`);
      newPins.forEach(p => {
        if (p.topImg && !imgCache[p.topImg]) loadImageFromUrl(p.topImg).then(img=>{ if(img) setImgCache(c=>({...c,[p.topImg]:img})); });
      });
    } catch(err) { setStatus("Error: "+err.message); }
    setLoading(false);
  }

  function handleUploadImg(idx,e,slot) {
    const f=e.target.files[0]; if(!f) return;
    const url=URL.createObjectURL(f);
    loadImageFromUrl(url).then(img=>{
      if(img) setImgCache(c=>({...c,[url]:img}));
      setPins(ps=>ps.map((p,i)=>i===idx?{...p,[slot]:url}:p));
    });
  }

  function downloadPin(pin) {
    const cv=document.createElement("canvas"); cv.width=PW; cv.height=PH;
    document.fonts.ready.then(()=>{
      renderPin(cv,tmpl,pin,imgCache);
      const a=document.createElement("a"); a.download=`pin-${(pin.title||"pin").slice(0,30).replace(/\s+/g,"-")}.png`;
      a.href=cv.toDataURL("image/png",1.0); a.click();
    });
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:"#f9f9f9",border:"0.5px solid #e5e5e5",borderRadius:8,padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:13,fontWeight:700}}>Scrape your sitemap</div>
        <div style={{fontSize:12,color:"#888"}}>Pulls page title, meta description, OG image, and URL from each page. Works best on public blogs.</div>
        <div style={{display:"flex",gap:8}}>
          <input style={{...INP,flex:1}} value={sitemapUrl} onChange={e=>setSitemapUrl(e.target.value)} placeholder="https://yoursite.com/sitemap.xml"/>
          <button onClick={scrapeSitemap} disabled={loading||!sitemapUrl} style={{padding:"8px 18px",background:loading?"#ccc":"#D85A30",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",whiteSpace:"nowrap"}}>
            {loading?"Scraping…":"Scrape →"}
          </button>
        </div>
        {status && <div style={{fontSize:12,color:loading?"#185FA5":"#666",fontWeight:600}}>{status}</div>}
      </div>
      {scraped && pins.length>0 && (
        <div>
          <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>{pins.length} pins ready — tweak each, then download</div>
          {pins.map((pin,i)=>(
            <PinEditorRow key={i} pin={pin} idx={i} total={pins.length} tmpl={tmpl} imgCache={imgCache}
              onUpdate={p=>setPins(ps=>ps.map((x,j)=>j===i?p:x))}
              onDownload={()=>downloadPin(pin)}
              onUploadImg={(e,slot)=>handleUploadImg(i,e,slot)}/>
          ))}
        </div>
      )}
    </div>
  );
}

function SingleTab({ tmpl, imgCache, setImgCache }) {
  const [pin, setPin] = useState({title:"Your Recipe Title Here",subtitle:"Perfect for a weeknight dinner",label:"QUICK & EASY",url:"www.yoursite.com",topImg:null,botImg:null});

  function handleImg(e, slot) {
    const f=e.target.files[0]; if(!f) return;
    const url=URL.createObjectURL(f);
    loadImageFromUrl(url).then(img=>{
      if(img) setImgCache(c=>({...c,[url]:img}));
      setPin(p=>({...p,[slot]:url}));
    });
  }

  function download() {
    const cv=document.createElement("canvas"); cv.width=PW; cv.height=PH;
    document.fonts.ready.then(()=>{
      renderPin(cv,tmpl,pin,imgCache);
      const a=document.createElement("a"); a.download="pinterest-pin.png";
      a.href=cv.toDataURL("image/png",1.0); a.click();
    });
  }

  return (
    <div style={{display:"flex",gap:24,alignItems:"flex-start"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,flexShrink:0}}>
        <PinCanvas tmpl={tmpl} pin={pin} imgCache={imgCache} scale={0.27}/>
        <button onClick={download} style={{width:"100%",padding:"9px",background:"#D85A30",color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:13,cursor:"pointer"}}>⬇ Download (1000×2000px)</button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:11}}>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Headline</div>
          <textarea value={pin.title} onChange={e=>setPin(p=>({...p,title:e.target.value}))} style={{...INP,minHeight:56,resize:"vertical"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Subtitle</div>
          <input style={INP} value={pin.subtitle} onChange={e=>setPin(p=>({...p,subtitle:e.target.value}))}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Label strip</div>
            <input style={INP} value={pin.label} onChange={e=>setPin(p=>({...p,label:e.target.value}))}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Website URL</div>
            <input style={INP} value={pin.url} onChange={e=>setPin(p=>({...p,url:e.target.value}))}/>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>
          <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Top image</div>
          <input type="file" accept="image/*" onChange={e=>handleImg(e,"topImg")} style={{fontSize:12}}/>
        </div>
        {tmpl.layout==="two" && (
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <div style={{fontSize:12,fontWeight:600,color:"#666"}}>Bottom image</div>
            <input type="file" accept="image/*" onChange={e=>handleImg(e,"botImg")} style={{fontSize:12}}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("single");
  const [tmpl, setTmpl] = useState(DEFAULT_TMPL);
  const [localFontStack, setLocalFontStack] = useState(null);
  const [imgCache, setImgCache] = useState({});
  const [tmplOpen, setTmplOpen] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  const TABS = [{id:"single",label:"Single Pin"},{id:"csv",label:"CSV Batch"},{id:"sitemap",label:"Sitemap Scraper"}];

  return (
    <div style={{fontFamily:"'Poppins',sans-serif",padding:"0 0 40px",maxWidth:1100,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,paddingBottom:12,borderBottom:"0.5px solid #e5e5e5"}}>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"#1A1A1A"}}>📌 Pinterest Pin Studio</div>
          <div style={{fontSize:12,color:"#888"}}>Design once, apply to any pin</div>
        </div>
        <button onClick={()=>setTmplOpen(o=>!o)} style={{padding:"6px 14px",border:"0.5px solid #ddd",borderRadius:8,background:tmplOpen?"#1A1A1A":"#f5f5f5",color:tmplOpen?"#fff":"#222",fontSize:12,fontWeight:600,cursor:"pointer"}}>
          {tmplOpen?"Hide template ✕":"Edit template ✏️"}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:tmplOpen?"300px 1fr":"1fr",gap:24,alignItems:"start"}}>
        {tmplOpen && (
          <div>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#aaa",marginBottom:8}}>Template — applies to all pins</div>
            <TemplatePanel tmpl={tmpl} setTmpl={setTmpl} localFontStack={localFontStack} setLocalFontStack={setLocalFontStack}/>
          </div>
        )}
        <div>
          <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:"0.5px solid #e5e5e5"}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 18px",border:"none",borderBottom:tab===t.id?"2px solid #D85A30":"2px solid transparent",background:"none",fontSize:13,fontWeight:tab===t.id?700:500,color:tab===t.id?"#D85A30":"#888",cursor:"pointer",fontFamily:"'Poppins',sans-serif"}}>
                {t.label}
              </button>
            ))}
          </div>
          {tab==="single" && <SingleTab tmpl={tmpl} imgCache={imgCache} setImgCache={setImgCache}/>}
          {tab==="csv" && <CSVTab tmpl={tmpl} imgCache={imgCache} setImgCache={setImgCache}/>}
          {tab==="sitemap" && <SitemapTab tmpl={tmpl} imgCache={imgCache} setImgCache={setImgCache}/>}
        </div>
      </div>
    </div>
  );
}
