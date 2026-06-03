/* TrailMark PCM marketing — shared behavior */
(function(){
  var CONTACT_ENDPOINT = "https://drflivnlnkhzrsatrkrg.supabase.co/functions/v1/contact-form";

  // Language-aware copy (Spanish pages set <html lang="es">)
  var ES = (document.documentElement.lang || "").toLowerCase().indexOf("es") === 0;
  var T = {
    sending:    ES ? "Enviando…" : "Sending…",
    notifyDone: ES ? "Gracias: te escribiremos en cuanto esté listo." : "Thanks — we’ll email you the moment it’s ready.",
    msgTitle:   ES ? "Mensaje recibido" : "Message received",
    msgSub:     ES ? "Respondemos cada mensaje en un máximo de dos días hábiles, normalmente mucho antes. Revisa tu bandeja de entrada."
                   : "We reply to every note within two business days — usually much faster. Watch your inbox.",
    needEmail:  ES ? "Por favor, ingresa tu correo." : "Please enter your email.",
    failMsg:    ES ? "Lo sentimos: algo salió mal. Escríbenos directamente a contact@trailmarkpcm.com."
                   : "Sorry — something went wrong. Please email contact@trailmarkpcm.com directly."
  };

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
  // POST a form payload to the Resend-backed edge function
  function send(payload){
    return fetch(CONTACT_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(function(r){ if(!r.ok) throw new Error('bad'); return r.json(); });
  }
  function fail(btn){
    if(btn){ btn.disabled=false; if(btn.dataset.label!=null) btn.innerHTML=btn.dataset.label; }
    alert(T.failMsg);
  }
  // notify + contact forms → deliver to contact@trailmarkpcm.com via Resend
  function initForms(){
    document.querySelectorAll('[data-notify]').forEach(function(form){
      form.addEventListener('submit',function(e){
        e.preventDefault();
        var input=form.querySelector('input[type=email]')||form.querySelector('input');
        var email=input?input.value.trim():'';
        if(!email) return;
        var hp=form.querySelector('input[name=company]');
        var btn=form.querySelector('button');
        if(btn){ btn.dataset.label=btn.innerHTML; btn.disabled=true; btn.textContent=T.sending; }
        send({type:'notify',email:email,product:form.getAttribute('data-product')||'',_gotcha:hp?hp.value:''})
          .then(function(){
            var done=document.createElement('div');
            done.style.cssText='font-size:14px;font-weight:800;color:#fff;display:flex;align-items:center;gap:8px;padding:11px 4px;';
            done.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> '+T.notifyDone;
            form.replaceWith(done);
          })
          .catch(function(){ fail(btn); });
      });
    });
    document.querySelectorAll('[data-contact]').forEach(function(form){
      form.addEventListener('submit',function(e){
        e.preventDefault();
        function v(id){ var el=form.querySelector('#'+id); return el?el.value.trim():''; }
        var email=v('email');
        if(!email){ alert(T.needEmail); return; }
        var hp=form.querySelector('input[name=company]');
        var btn=form.querySelector('button[type=submit]');
        if(btn){ btn.dataset.label=btn.innerHTML; btn.disabled=true; btn.textContent=T.sending; }
        send({type:'contact',name:v('name'),email:email,club:v('club'),topic:v('topic'),message:v('msg'),_gotcha:hp?hp.value:''})
          .then(function(){
            var card=form.closest('[data-contact-card]')||form;
            var msg=document.createElement('div');
            msg.style.cssText='text-align:center;padding:20px 0;';
            msg.innerHTML='<div style="width:56px;height:56px;border-radius:16px;background:var(--forest-tint);color:var(--forest);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><h3 style="margin:0 0 8px;">'+T.msgTitle+'</h3><p class="sub" style="margin:0;">'+T.msgSub+'</p>';
            (card||form).replaceWith(msg);
          })
          .catch(function(){ fail(btn); });
      });
    });
  }
  document.addEventListener('DOMContentLoaded',function(){initNav();initReveal();initForms();});
})();
