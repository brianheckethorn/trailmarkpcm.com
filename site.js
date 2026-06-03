/* TrailMark PCM marketing — shared behavior */
(function(){
  // mobile nav toggle
  function initNav(){
    var t=document.querySelector('.nav-toggle');
    var links=document.querySelector('.nav-links');
    if(t&&links){t.addEventListener('click',function(){links.classList.toggle('open');});}
    // active link by filename
    var file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a').forEach(function(a){
      var href=(a.getAttribute('href')||'').toLowerCase();
      if(href===file||(file===''&&href==='index.html')){a.classList.add('active');}
    });
  }
  // reveal on scroll
  function initReveal(){
    var els=document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)||!els.length){els.forEach(function(e){e.classList.add('in');});return;}
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
      });
    },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e);});
  }
  // notify / signup forms — friendly inline confirmation (no backend)
  function initForms(){
    document.querySelectorAll('[data-notify]').forEach(function(form){
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var input=form.querySelector('input');
        var val=input?input.value.trim():'';
        var done=document.createElement('div');
        done.style.cssText='font-size:14px;font-weight:800;color:#fff;display:flex;align-items:center;gap:8px;padding:11px 4px;';
        done.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Thanks — we\u2019ll email you the moment it\u2019s ready.';
        form.replaceWith(done);
      });
    });
    document.querySelectorAll('[data-contact]').forEach(function(form){
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var card=form.closest('[data-contact-card]')||form;
        var msg=document.createElement('div');
        msg.style.cssText='text-align:center;padding:20px 0;';
        msg.innerHTML='<div style="width:56px;height:56px;border-radius:16px;background:var(--forest-tint);color:var(--forest);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><h3 style="margin:0 0 8px;">Message received</h3><p class="sub" style="margin:0;">We reply to every note within two business days — usually much faster. Watch your inbox.</p>';
        form.replaceWith(msg);
      });
    });
  }
  document.addEventListener('DOMContentLoaded',function(){initNav();initReveal();initForms();});
})();
