const $=id=>document.getElementById(id);
const num=n=>{n=Number(n||0);if(n>=1e9)return(n/1e9).toFixed(2).replace(/\.00$/,"")+"B";if(n>=1e6)return(n/1e6).toFixed(2).replace(/\.00$/,"")+"M";if(n>=1e3)return(n/1e3).toFixed(2).replace(/\.00$/,"")+"K";return n.toLocaleString()};
const esc=s=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const date=s=>s?new Date(s).toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}):"—";

async function analyze(){
 const q=$("query").value.trim();$("err").textContent="";
 if(!q){$("err").textContent="Enter a YouTube channel URL, @handle, or channel ID.";return}
 const b=$("go");b.disabled=true;b.textContent="Analyzing...";
 try{
  const r=await fetch("/api/public/youtube/channel?query="+encodeURIComponent(q)),d=await r.json();
  if(!r.ok)throw Error(d.message||d.error||"Unable to load channel.");
  render(d);
 }catch(e){console.error(e);$("err").textContent=e.message||"Something went wrong."}
 finally{b.disabled=false;b.textContent="Analyze Channel"}
}
function render(d){
 $("empty").classList.add("hide");$("dash").classList.remove("hide");
 $("heroTitle").textContent=d.title+" analytics";$("heroText").textContent="Public YouTube channel performance, presented by CreatorHub.";
 $("name").textContent=d.title;$("meta").textContent=num(d.subscribers)+" subscribers · "+num(d.videos)+" videos";
 $("avatar").src=d.thumbnail||"";$("sideAvatar").textContent=d.title[0]?.toUpperCase()||"C";$("sideTitle").textContent=d.title;$("sideHandle").textContent="YouTube · "+num(d.subscribers)+" subscribers";
 $("subs").textContent=d.hiddenSubscribers?"Hidden":num(d.subscribers);$("views").textContent=num(d.views);$("videos").textContent=num(d.videos);$("avg").textContent=d.videos?num(Math.round(d.views/d.videos)):"—";
 $("created").textContent=date(d.publishedAt);$("country").textContent=d.country||"Not public";$("cid").textContent=d.channelId;$("yt").href="https://www.youtube.com/channel/"+encodeURIComponent(d.channelId);
 const vs=d.recentVideos||[];const max=Math.max(...vs.map(v=>Number(v.views||0)),1);
 $("bars").innerHTML=vs.slice().reverse().map(v=>`<div class="bar" style="height:${Math.max(5,Number(v.views||0)/max*92)}%"><span>${num(v.views)} views</span></div>`).join("");
 $("rows").innerHTML=vs.slice().sort((a,b)=>b.views-a.views).map(v=>`<tr><td><div class="vcell"><img src="${esc(v.thumbnail)}"><span class="vtitle">${esc(v.title)}</span></div></td><td>${num(v.views)}</td><td>${num(v.likes)}</td><td>${num(v.comments)}</td><td>${date(v.publishedAt)}</td><td><a class="watch" target="_blank" href="https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}">Watch ↗</a></td></tr>`).join("");
}
function focusSearch(){$("query").focus();$("query").scrollIntoView({behavior:"smooth",block:"center"})}
$("go").onclick=analyze;$("query").onkeydown=e=>{if(e.key==="Enter")analyze()};document.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();focusSearch()}};
