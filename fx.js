// fx.js — премиальные анимации 2048

;(function(){
  const EASE_OUT = 'cubic-bezier(.18,.76,.18,1)';

  // палитра подсветки по номиналу
  const COLOR_MAP = {
    2:   'rgba(255, 237, 184, .75)',
    4:   'rgba(255, 226, 160, .78)',
    8:   'rgba(255, 196, 120, .82)',
    16:  'rgba(255, 170,  98, .84)',
    32:  'rgba(255, 149,  83, .86)',
    64:  'rgba(255, 127,  72, .88)',
    128: 'rgba(255, 210,  90, .90)',
    256: 'rgba(255, 196,  72, .92)',
    512: 'rgba(255, 176,  64, .94)',
    1024:'rgba(249, 140, 120, .96)',
    2048:'rgba(175, 115, 255, .96)',
    4096:'rgba(152,  90, 255, .97)',
    8192:'rgba(124,  68, 245, .98)',
  };

  // находим контейнер с плитками (поддержим разные реализации)
  const candidates = [
    document.querySelector('.tiles-layer'),
    document.querySelector('.tile-container'),
    document.querySelector('#tiles-layer'),
    document.querySelector('#board'),
    document.body
  ];
  const host = candidates.find(Boolean);

  // применяем плавные переходы движения, если движок меняет transform
  const applyMovementSmoothing = (tile) => {
    tile.style.willChange = 'transform';
    tile.style.transition = tile.style.transition || `transform 110ms ${EASE_OUT}`;
  };

  // читаем число на плитке
  const readValue = (tile) => {
    if (tile.dataset.value) return Number(tile.dataset.value);
    // некоторые реализации держат число в .innerText
    const txt = tile.textContent.trim();
    const num = parseInt(txt, 10);
    return isNaN(num) ? 0 : num;
  };

  // назначаем цвет свечения по значению
  const setGlowColor = (tile, value) => {
    const color = COLOR_MAP[value] || 'rgba(255, 210, 90, .75)';
    tile.style.setProperty('--fx-color', color);
    tile.classList.add('fx-glow');
  };

  // вспышка при слиянии
  const makeBurst = (tile) => {
    const burst = document.createElement('div');
    burst.className = 'fx-burst';
    tile.appendChild(burst);
    burst.addEventListener('animationend', ()=>burst.remove());
  };

  // мягкая вибрация
  const vib = (ms)=>{ try{ navigator.vibrate && navigator.vibrate(ms);}catch(_){} };

  // триггеры
  const onSpawn = (tile)=>{
    applyMovementSmoothing(tile);
    tile.classList.add('fx-spawn');
    // цвет даже для новых
    setGlowColor(tile, readValue(tile));
  };

  const onMerge = (tile)=>{
    applyMovementSmoothing(tile);
    setGlowColor(tile, readValue(tile));
    tile.classList.add('fx-merge');
    makeBurst(tile);
    vib(18);
    // автосброс класса после анимации — чтобы можно было триггерить снова
    tile.addEventListener('animationend', (e)=>{
      if (e.animationName === 'fx-merge-zoom'){
        tile.classList.remove('fx-merge');
      }
    }, {once:false});
  };

  // Инициализация: обработаем уже существующие
  const seedTiles = ()=>{
    document.querySelectorAll('.tile').forEach(t=>{
      applyMovementSmoothing(t);
      setGlowColor(t, readValue(t));
    });
  };
  seedTiles();

  // Наблюдаем за изменениями DOM, чтобы ловить новые/слитые плитки
  const mo = new MutationObserver((records)=>{
    for (const rec of records){
      rec.addedNodes?.forEach?.(node=>{
        if (!(node instanceof HTMLElement)) return;

        // поддержка разных разметок: иногда создаётся обёртка, а сама плитка — внутри
        const tiles = node.matches?.('.tile') ? [node] : node.querySelectorAll?.('.tile');
        tiles && tiles.forEach(t=>{
          applyMovementSmoothing(t);

          const v = readValue(t);
          setGlowColor(t, v);

          // если движок помечает статусы классами
          if (t.classList.contains('tile-new'))  onSpawn(t);
          if (t.classList.contains('tile-merged')) onMerge(t);

          // если классов нет — эвристика: новые часто появляются маленькими/прозрачными
          if (!t.classList.contains('tile-new') && !t.classList.contains('tile-merged')){
            // мягкий spawn
            t.classList.add('fx-spawn');
          }
        });
      });

      // ловим изменения классов (когда движок добавляет tile-merged позже)
      if (rec.type === 'attributes' && rec.target.classList?.contains('tile')){
        const t = rec.target;
        if (t.classList.contains('tile-merged')) onMerge(t);
      }
    }
  });

  mo.observe(host, { childList:true, subtree:true, attributes:true, attributeFilter:['class','data-value'] });

  // Экспорт хука, если хочешь вручную вызывать при начислении очков
  window.__fx_merged = (tileEl)=> onMerge(tileEl);
})();