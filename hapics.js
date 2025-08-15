// hapics.js — лёгкий тактильный отклик
;(function(){
  const vibrate = (pattern)=>{ try{ navigator.vibrate && navigator.vibrate(pattern);}catch(_){} };

  // Простой API: вызывай вручную при больших событиях, если хочешь
  window.hfx = {
    spawn(){ vibrate(8); },
    merge(value){
      if (value >= 2048) vibrate([20,40,20]);
      else if (value >= 256) vibrate(22);
      else vibrate(14);
    }
  };

  // Автоподписка на визуальные события от fx.js (если захочешь без ручных вызовов)
  document.addEventListener('animationstart', (e)=>{
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    if (e.animationName === 'fx-spawn') hfx.spawn();
    if (e.animationName === 'fx-merge-zoom'){
      const v = parseInt(el.dataset.value || el.textContent, 10) || 0;
      hfx.merge(v);
    }
  }, true);
})();