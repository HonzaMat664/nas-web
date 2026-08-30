function pad(n){
return n.toString().padStart(2,"0");
}

function formatTime(d){

return d.getFullYear()+"-"+
pad(d.getMonth()+1)+"-"+
pad(d.getDate())+" "+
pad(d.getHours())+":"+
pad(d.getMinutes())+":"+
pad(d.getSeconds());

}

function updateTime(){

document.getElementById("time").innerText=formatTime(new Date());

}

async function loadLastLine(file,elementId){

const url=file+"?t="+Date.now();

try{

const r=await fetch(url,{cache:"no-store"});

if(!r.ok) throw new Error("HTTP "+r.status);

const text=await r.text();

const lines=text.trim().split("\n");

document.getElementById(elementId).innerText=lines[lines.length-1];

return lines[lines.length-1];

}

catch(err){

document.getElementById(elementId).innerText="Chyba: "+err;

return null;

}

}

function polar(alt,az,cx,cy,radius){

if(alt<0) return null;

if(alt>90) alt=90;

const r=radius*(1-alt/90);

const theta=(az+90)*Math.PI/180;

const x=cx+r*Math.cos(theta);

const y=cy+r*Math.sin(theta);

return[x,y];

}

function drawRose(sunAlt,sunAz,moonAlt,moonAz){

const canvas=document.getElementById("rose");

const ctx=canvas.getContext("2d");

const w=canvas.width;

const h=canvas.height;

const cx=w/2;

const cy=h/2;

const radius=Math.min(cx,cy)-10;

ctx.clearRect(0,0,w,h);

ctx.strokeStyle="#666";

ctx.beginPath();

ctx.arc(cx,cy,radius,0,Math.PI*2);

ctx.stroke();

ctx.strokeStyle="#333";

ctx.beginPath();

ctx.moveTo(cx,cy-radius);

ctx.lineTo(cx,cy+radius);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(cx-radius,cy);

ctx.lineTo(cx+radius,cy);

ctx.stroke();

ctx.strokeStyle="#555";

const angleRad=23*Math.PI/180;

const cos=Math.cos(angleRad);

const sin=Math.sin(angleRad);

ctx.beginPath();

ctx.moveTo(cx-radius*sin,cy-radius*cos);

ctx.lineTo(cx+radius*sin,cy+radius*cos);

ctx.stroke();

ctx.beginPath();

ctx.moveTo(cx-radius*cos,cy+radius*sin);

ctx.lineTo(cx+radius*cos,cy-radius*sin);

ctx.stroke();

ctx.fillStyle="#aaa";

ctx.font="14px monospace";

ctx.textAlign="center";

ctx.fillText("J",cx,cy-radius-8);

if(!isNaN(sunAlt)&&!isNaN(sunAz)){

const pos=polar(sunAlt,sunAz,cx,cy,radius);

if(pos){

ctx.fillStyle="yellow";

ctx.beginPath();

ctx.arc(pos[0],pos[1],6,0,Math.PI*2);

ctx.fill();

}

}

if(!isNaN(moonAlt)&&!isNaN(moonAz)){

const pos=polar(moonAlt,moonAz,cx,cy,radius);

if(pos){

ctx.fillStyle="lightblue";

ctx.beginPath();

ctx.arc(pos[0],pos[1],6,0,Math.PI*2);

ctx.fill();

}

}

}

async function tick(){

updateTime();

loadLastLine("data/vychod.csv","out3");

const line=await loadLastLine("data/azimut.csv","out1");

if(!line) return;

const parts=line.split(",");

if(parts.length>=5){

const sunAlt=parseFloat(parts[1]);

const sunAz=parseFloat(parts[2]);

const moonAlt=parseFloat(parts[3]);

const moonAz=parseFloat(parts[4]);

drawRose(sunAlt,sunAz,moonAlt,moonAz);

}

}

tick();

setInterval(tick,1000);
