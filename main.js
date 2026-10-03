(function(){
  var d=document, root=d.documentElement;
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ root.classList.add('loaded'); }); });

  // header solid + thumb bar after hero CTA leaves view
  var top=d.querySelector('.top'), thumb=d.querySelector('.thumb'), heroCta=d.querySelector('.hero .cta-row');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){
      var past=!e[0].isIntersecting && e[0].boundingClientRect.top<0;
      thumb.classList.toggle('show',past);
    }).observe(heroCta);
    new IntersectionObserver(function(e){ top.classList.toggle('solid',!e[0].isIntersecting); },{rootMargin:'-80px 0px 0px 0px'}).observe(d.querySelector('.hero-copy h1'));
    var io=new IntersectionObserver(function(es){ es.forEach(function(x){ if(x.isIntersecting){ var t=x.target; if(t.classList.contains('formula')) t.classList.add('in-view'); else t.querySelectorAll('.reveal').forEach(function(r){r.classList.add('in')}); io.unobserve(t);} }); },{threshold:.15});
    d.querySelectorAll('.formula').forEach(function(el){ io.observe(el); });
    d.querySelectorAll('.reveal').forEach(function(el){ io.observe(el.parentElement); });
  } else { thumb.classList.add('show'); d.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in')}); }

  // before/after sliders
  d.querySelectorAll('.ba-frame').forEach(function(f){
    var r=f.querySelector('.ba-range');
    var set=function(){ f.style.setProperty('--pos', r.value+'%'); };
    r.addEventListener('input',set); set();
  });
  // tabs
  var tabs=[].slice.call(d.querySelectorAll('.ba-tab'));
  function pick(t){ tabs.forEach(function(x){ var on=x===t; x.setAttribute('aria-selected',on); x.tabIndex=on?0:-1; d.getElementById(x.getAttribute('aria-controls')).hidden=!on; if(on){ var fm=d.querySelector('#'+x.getAttribute('aria-controls')+' .formula'); fm.classList.remove('in-view'); void fm.offsetWidth; fm.classList.add('in-view'); } }); }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){pick(t)});
    t.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ var n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length]; pick(n); n.focus(); e.preventDefault(); } });
  });

  // rail progress
  var rail=d.querySelector('.rail'), cnt=d.querySelector('.rail-count b'), bar=d.querySelector('.rail-bar i');
  if(rail){ var n=rail.children.length; var upd=function(){ var max=rail.scrollWidth-rail.clientWidth; var p=max>0?rail.scrollLeft/max:0; var i=Math.min(n,Math.round(p*(n-1))+1); cnt.textContent=(i<10?'0':'')+i; bar.style.width=(10+p*90)+'%'; }; rail.addEventListener('scroll',upd,{passive:true}); upd(); }

  // today + open status, Turlock time
  try{
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var get=function(t){ return (parts.find(function(p){return p.type===t})||{}).value; };
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday'));
    var mins=(parseInt(get('hour'),10)%24)*60+parseInt(get('minute'),10);
    var row=d.querySelector('.hours tr[data-d="'+day+'"]'); if(row) row.classList.add('today');
    var hrs={0:[540,990],3:[540,1080],4:[540,1080],5:[540,1080],6:[540,1080]};
    var s=d.getElementById('status'), h=hrs[day];
    if(h && mins>=h[0] && mins<h[1]) s.innerHTML='<b>Open now</b>, closes '+(day===0?'4:30 PM':'6 PM')+' (listed hours)';
    else if(h && mins<h[0]) s.innerHTML='Closed now, <b>opens today at 9 AM</b> (listed hours)';
    else s.textContent='Closed right now (listed hours). Message on Instagram to book ahead.';
  }catch(e){}
})();
