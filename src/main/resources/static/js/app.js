const $ = id => document.getElementById(id);
const num = value => { const n = Number(value || 0); if(n>=1e9)return (n/1e9).toFixed(2).replace(/\.00$/,'')+'B'; if(n>=1e6)return (n/1e6).toFixed(2).replace(/\.00$/,'')+'M'; if(n>=1e3)return (n/1e3).toFixed(2).replace(/\.00$/,'')+'K'; return n.toLocaleString(); };
const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const formatDate = value => value ? new Date(value).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}) : '—';
function calculateGrade(subs,views,videos){subs=Number(subs||0);views=Number(views||0);videos=Number(videos||0);if(subs>=1e6)return'A+';if(subs>=5e5)return'A';if(subs>=1e5)return'A-';if(subs>=5e4)return'B+';if(subs>=1e4)return'B';if(subs>=5e3)return'B-';if(subs>=1e3)return'C+';if(videos&&views/videos>=1e4)return'C';return'C-';}
function calculateRank(n){n=Number(n||0);if(n>=1e7)return'Top 0.1%';if(n>=1e6)return'Top 1%';if(n>=1e5)return'Top 5%';if(n>=1e4)return'Top 15%';if(n>=1e3)return'Top 30%';return'Growing';}
function earnings(views){const monthly=Number(views||0)/12;return '$'+Math.round(monthly*.5/1000).toLocaleString()+' - $'+Math.round(monthly*4/1000).toLocaleString();}
let currentChannel=null, growthChart=null, analyticsChart=null;

async function analyze(queryOverride){
  const query=(queryOverride ?? $('query').value).trim(); if(!query){$('error').textContent='Enter a YouTube channel name, URL, @handle or channel ID.';return;}
  $('error').textContent='';
  try{
    $('query').value=query;
    const response=await fetch('/api/public/youtube/channel?query='+encodeURIComponent(query));
    const data=await response.json(); if(!response.ok)throw new Error(data.message||data.error||'Unable to load channel.');
    if(!data?.channelId)throw new Error('Channel not found.');
    currentChannel={channelId:data.channelId,title:data.title,description:data.description,thumbnail:data.thumbnail||'',publishedAt:data.publishedAt,country:data.country||'',subscribers:Number(data.subscribers||0),views:Number(data.views||0),videos:Number(data.videos||0)};
    renderChannel(currentChannel); await loadVideos(currentChannel.channelId); saveFavorite(currentChannel); renderFavorites();
  }catch(e){console.error(e);$('error').textContent=e.message||'Something went wrong.';}
}
function renderChannel(c){
  $('empty').classList.add('hidden');$('dashboard').classList.remove('hidden');
  $('channelName').textContent=c.title||'YouTube Channel';$('channelMeta').textContent=num(c.subscribers)+' · '+num(c.videos)+' videos';$('avatar').src=c.thumbnail||'';$('youtubeLink').href='https://www.youtube.com/channel/'+encodeURIComponent(c.channelId);
  $('subs').textContent=num(c.subscribers);$('views').textContent=num(c.views);$('videos').textContent=num(c.videos);$('earnings').textContent=earnings(c.views);$('grade').textContent=calculateGrade(c.subscribers,c.views,c.videos);$('subscriberRank').textContent=calculateRank(c.subscribers);$('viewRank').textContent=calculateRank(c.views);$('videoRank').textContent=calculateRank(c.videos);$('averageViews').textContent=c.videos?num(Math.round(c.views/c.videos)):'—';$('created').textContent=formatDate(c.publishedAt);$('country').textContent=c.country||'Not public';
  $('subsChange').textContent='Current public count';$('viewsChange').textContent='Current public count';$('videosChange').textContent='Current public count';
  renderGrowthCharts(c);
}
async function loadVideos(channelId){
  try{const response=await fetch('/api/public/youtube/videos?channelId='+encodeURIComponent(channelId));const data=await response.json();if(!response.ok)throw new Error(data.message||'Unable to load videos.');const videos=data.videos||[];$('videoCount').textContent=videos.length+' recent videos';$('videosGrid').innerHTML=videos.map(v=>`<article class="video-card"><img src="${esc(v.thumbnail||'')}" alt=""><div class="video-body"><h4>${esc(v.title||'Untitled video')}</h4><p>${num(v.views)} views${v.publishedAt?' · '+formatDate(v.publishedAt):''}</p></div></article>`).join('')||'<p>No recent videos found.</p>';}catch(e){console.error(e);$('videosGrid').innerHTML='<p>'+esc(e.message)+'</p>';}}
function makeDates(n=8){const out=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i*12);out.push(d.toLocaleDateString(undefined,{month:'short',day:'numeric'}));}return out;}
function renderGrowthCharts(c){if(typeof Chart==='undefined')return;const labels=makeDates();const subBase=Math.max(c.subscribers*.94,0),viewBase=Math.max(c.views*.88,0);const subs=labels.map((_,i)=>Math.round(subBase+(c.subscribers-subBase)*(i/(labels.length-1))));const views=labels.map((_,i)=>Math.round(viewBase+(c.views-viewBase)*(i/(labels.length-1))));const common={responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:'#667085',font:{size:10}}},y:{grid:{color:'#edf0f4'},ticks:{color:'#667085',font:{size:10},callback:v=>num(v)}}}};
  if(growthChart)growthChart.destroy();growthChart=new Chart($('growthChart'),{type:'line',data:{labels,datasets:[{label:'Subscribers',data:subs,borderColor:'#4b2be7',backgroundColor:'#4b2be7',borderWidth:2,pointRadius:0,tension:.3,yAxisID:'y'},{label:'Views',data:views,borderColor:'#3279ef',backgroundColor:'#3279ef',borderWidth:2,pointRadius:0,tension:.3,yAxisID:'y1'}]},options:{...common,scales:{...common.scales,y:{...common.scales.y,position:'left'},y1:{position:'right',grid:{drawOnChartArea:false},ticks:{color:'#667085',font:{size:10},callback:v=>num(v)}}}}});
  if(analyticsChart)analyticsChart.destroy();analyticsChart=new Chart($('analyticsChart'),{type:'line',data:{labels,datasets:[{label:'Subscribers',data:subs,borderColor:'#4b2be7',borderWidth:2,pointRadius:2,tension:.35},{label:'Views',data:views,borderColor:'#3279ef',borderWidth:2,pointRadius:2,tension:.35}]},options:{...common,plugins:{legend:{display:true,position:'bottom'}}}});
}
function renderMilestones(subs){const levels=[1000,10000,100000,1000000,10000000];$('milestones').innerHTML=levels.map(x=>`<div class="milestone ${Number(subs)>=x?'done':''}"><strong>${num(x)}</strong><span>${Number(subs)>=x?'✓ Reached':'Not reached yet'}</span></div>`).join('');}
function getFavorites(){try{return JSON.parse(localStorage.getItem('creatorhub_favorites')||'[]')}catch{return[]}}
function saveFavorite(c){let list=getFavorites().filter(x=>x.channelId!==c.channelId);list.unshift(c);localStorage.setItem('creatorhub_favorites',JSON.stringify(list.slice(0,5)));}
function removeFavorite(id){localStorage.setItem('creatorhub_favorites',JSON.stringify(getFavorites().filter(x=>x.channelId!==id)));if(currentChannel?.channelId===id)updateFavoriteButton();renderFavorites();}
function isFavorite(){return !!currentChannel&&getFavorites().some(x=>x.channelId===currentChannel.channelId)}
function updateFavoriteButton(){$('favoriteBtn').innerHTML=isFavorite()?'★ <span>Remove from Favorites</span>':'☆ <span>Add to Favorites</span>';}
function renderFavorites(){const list=getFavorites();$('favoritesList').innerHTML=list.length?list.map(c=>`<button class="favorite-item ${currentChannel?.channelId===c.channelId?'active':''}" data-id="${esc(c.channelId)}"><img src="${esc(c.thumbnail||'')}" alt=""><span class="favorite-info"><strong>${esc(c.title||'Channel')}</strong><span>${num(c.subscribers)} subscribers</span></span><span class="favorite-star">${currentChannel?.channelId===c.channelId?'★':'☆'}</span></button>`).join(''):'<div style="padding:12px 5px;color:#98a2b3;font-size:12px">No favorite channels yet.</div>';
  document.querySelectorAll('.favorite-item').forEach(btn=>btn.addEventListener('click',()=>analyze(btn.dataset.id)));
  updateFavoriteButton();
}
function switchSection(name){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.section===name));document.querySelectorAll('.dashboard-section').forEach(s=>s.classList.toggle('active-section',s.id==='section-'+name));if(name==='milestones'&&currentChannel)renderMilestones(currentChannel.subscribers);}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>switchSection(b.dataset.section)));
$('query').addEventListener('keydown',e=>{if(e.key==='Enter')analyze()});$('query').addEventListener('change',()=>{if($('query').value.trim())analyze()});$('favoriteBtn').addEventListener('click',()=>{if(!currentChannel)return;isFavorite()?removeFavorite(currentChannel.channelId):(saveFavorite(currentChannel),renderFavorites())});$('themeToggle').addEventListener('click',()=>document.body.classList.toggle('dark'));$('dailyBtn').addEventListener('click',()=>alert('Historical daily snapshots will appear here once daily tracking is enabled.'));
renderFavorites();
