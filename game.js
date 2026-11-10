/* =====================================================================
   БИГ БАУ ВАУ — логика игры (v4)
   Режимы: РИТМ (нотная дорожка, своя песня у каждого соперника),
           КЛИКЕР (тапай сколько угодно), КРИК (микрофон).
   Карьера в 4 актах, прокачка аппарата за 🎸, пауза.
   ===================================================================== */

/* ================= ДАННЫЕ ================= */
const HEROES = [
  {id:'hetfield', name:'Джеймс Хетфилд', short:'Хетфилд', band:'Metallica', perk:'Даунпикинг: каждый удар +20%', power:1.2, bpm:132, open:true,
   img:'img/hero.webp', face:[62,4,330], riff:[40,40,43,40,45,40,46,45], prog:[40,40,43,38]},
  {id:'chester', name:'Честер Беннингтон', band:'Linkin Park', perk:'Крик: ярость копится x2', open:false, img:'img/hero.webp'},
  {id:'cobain',  name:'Курт Кобейн', band:'Nirvana', perk:'Громко-тихо: каждый 4-й в ритм x3', open:false, img:'img/hero.webp'},
  {id:'corey',   name:'Кори Тейлор', band:'Slipknot', perk:'Маска: атаки слабее на 30%', open:false, img:'img/hero.webp'},
];
const ACTS = [
  {id:1, name:'Гараж',  sub:'Где всё начиналось'},
  {id:2, name:'Бары',   sub:'Первые концерты за еду'},
  {id:3, name:'Студия', sub:'Шоу-бизнес кусается'},
  {id:4, name:'Тур',    sub:'Дикая природа и пума'},
];
// song: название трека (оригинальные риффы, написаны для игры)
const OPPS = [
  {id:'cat',      act:1, name:'Кот бабушки',          desc:'Орёт громче твоего комбика',            atk:{every:6,name:'МЯЯЯУ!!!',fx:'push'},        sfx:'cat',   h:36, face:[36,8,280], song:'Мяу-метал', lines:['МЯУ.','МЯЯЯУ!','*сбрасывает медиатор со стола*'], bye:'*уходит спать в шкаф*'},
  {id:'drill',    act:1, name:'Сосед с перфоратором', desc:'Воскресенье, 9 утра',                    atk:{every:6,name:'ДРРРРРР!',fx:'mute'},        sfx:'drill', h:50, face:[56,4,330], song:'Дрель в ре миноре', lines:['Сделай потише!','У меня ремонт!','Я полицию вызову!'], bye:'Ладно… а «Enter Sandman» можешь?'},
  {id:'teacher',  act:1, name:'Училка музыки',        desc:'«Сначала гаммы, потом твой метал»',     atk:{every:6,name:'СБИВАЕТ ТЕМП!',fx:'tempo'},  sfx:'tick',  h:50, face:[45,5,300], song:'Гаммы на скорость', lines:['Ты отстаёшь от метронома!','Это не музыка, это шум','Где твой дневник?'], bye:'Хм. Четвёрка. С минусом.'},
  {id:'bully',    act:1, name:'Враг детства',         desc:'Со двора. Помнит тебя «очкариком»',     atk:{every:6,name:'ОТБИРАЕТ ГИТАРУ!',fx:'disarm'}, sfx:'fan', h:40, face:[45,8,280], song:'Двор-кор', lines:['Э, слышь, сыграй «Кино»','Чё за шум, а драки нет?','*плюёт шелуху*'], bye:'Э… автограф дашь?'},
  {id:'dad',      act:1, name:'Батя',                 desc:'БОСС. «Найди нормальную работу!»',      atk:{every:5,name:'ВЫРУБАЕТ ПРОБКИ!',fx:'blackout'}, sfx:'roar', h:52, face:[52,5,300], boss:true, song:'Нормальная работа', lines:['Когда на завод?','Это не профессия!','Мать, неси ремень!'], bye:'…Ну, может, и правда получится.'},
  {id:'fan',      act:2, name:'Пьяный фанат',         desc:'Требует «Nothing Else Matters» в 5-й раз', atk:{every:6,name:'ЛЕЗЕТ ОБНИМАТЬСЯ!',fx:'push'}, sfx:'fan', h:50, face:[48,3,330], song:'Ещё одну!', lines:['Сыграй «Nothing Else Matters»!','Братан, я с 91-го с вами!','Ещё одну!!!'], bye:'Лучший концерт в моей жизни… *падает*'},
  {id:'soundguy', act:2, name:'Звукач-халтурщик',     desc:'Крутит не те ручки. Уверенно',          atk:{every:5,name:'ГЛУШИТ ГИТАРУ!',fx:'mute'},   sfx:'screech', h:50, face:[55,5,320], song:'Фон в каналах', lines:['А так вообще нормально звучит','Это у тебя гитара фонит','*зевает*'], bye:'Ладно, подниму тебе пульт.'},
  {id:'cover',    act:2, name:'Кавер-бэнд за стеной', desc:'Играют «Мурку» на кейтаре',             atk:{every:6,name:'ПОДДАЁТ ГРОМКОСТИ!',fx:'grow'}, sfx:'kazoo', h:50, face:[45,5,300], song:'Мурка в аду', lines:['А теперь медлячок!','Все танцуют!','Ещё громче!!!'], bye:'Ребят, мы уходим на перерыв…'},
  {id:'barowner', act:2, name:'Хозяин бара',          desc:'БОСС. «Заплачу пивом»',                 atk:{every:5,name:'ВЫЧИТАЕТ ИЗ ГОНОРАРА!',fx:'drain'}, sfx:'cash', h:52, face:[48,4,300], boss:true, song:'Гонорар пивом', lines:['Гонорар? Пивом возьмёшь','За свет вычту','Электричество не бесплатное'], bye:'Ладно-ладно, вот твои деньги!'},
  {id:'beatmaker',act:3, name:'Плохой битмейкер',     desc:'Всё, что не на сетке, — ошибка',        atk:{every:5,name:'ЛОМАЕТ БИТ!',fx:'glitch'},    sfx:'glitch', h:50, face:[50,6,300], song:'Тайп-бит смерти', lines:['Давай на тайп-бит','Гитара — это прошлый век','Добавлю 808-ю'], bye:'Окей… можно сэмпл твоего риффа?'},
  {id:'hater',    act:3, name:'Хейтер из комментов',  desc:'Пишет «раньше было лучше» с 2003 года', atk:{every:5,name:'СПАМИТ КОММЕНТЫ!',fx:'spam'},  sfx:'notif', h:50, face:[48,6,300], song:'Раньше было лучше', lines:['Кринж','Продались','Раньше было лучше'], bye:'*удалил аккаунт*'},
  {id:'popstar',  act:3, name:'Поп-звезда с автотюном',desc:'Без автотюна не попадает в ноты',      atk:{every:5,name:'АВТОТЮН!',fx:'tune'},         sfx:'warble', h:52, face:[50,4,300], song:'Автотюн-апокалипсис', lines:['Сделай фит со мной!','Можно попроще?','Зайки, я вас люблю!'], bye:'Можно с тобой селфи?..'},
  {id:'producer', act:3, name:'Продюсер-акула',       desc:'БОСС. Контракт на 99 лет',              atk:{every:5,name:'ПОДСОВЫВАЕТ КОНТРАКТ!',fx:'contract'}, sfx:'cash', h:54, face:[58,4,300], boss:true, song:'Контракт на 99 лет', lines:['Подпиши, не читая','Права на песни — мои','Сделаем тебя звездой'], bye:'Контракт… порван. Как?!'},
  {id:'racoon',   act:4, name:'Енот из гримёрки',     desc:'Ворует сет-листы и усилители',          atk:{every:5,name:'ТАЩИТ УСИЛОК!',fx:'steal'},   sfx:'goose', h:36, face:[30,4,290], song:'Енотовый грув', lines:['*шуршит*','Это теперь моё','*жуёт медиатор*'], bye:'*бросает кабель и убегает*'},
  {id:'goose',    act:4, name:'Гусь у тур-автобуса',  desc:'Атакует сериями без передышки',         atk:{every:3.2,name:'ГА-ГА-ГА!',fx:'push'},     sfx:'goose', h:34, face:[6,24,300], song:'Гусиный галоп', lines:['Шшшшш!','ГА!','*щипок*'], bye:'*гордо уходит, не оглядываясь*'},
  {id:'bear',     act:4, name:'Медведь с фестиваля',  desc:'Пришёл на запах пиццы из райдера',      atk:{every:5,name:'РЁВ!',fx:'heavy'},           sfx:'roar',  h:54, face:[40,3,320], song:'Медвежий дум', lines:['Ррррр','*нюхает райдер*','РРРАААА'], bye:'*забирает пиццу и уходит в лес*'},
  {id:'puma',     act:4, name:'Пума',                 desc:'ФИНАЛ. Та самая из новости',            atk:{every:4.5,name:'ПРЫЖОК ИЗ ТЕМНОТЫ!',fx:'pounce'}, sfx:'hiss', h:34, face:[8,26,290], boss:true, song:'Пума в свете фар', lines:['*не сводит глаз*','Хррр…','*готовится к прыжку*'], bye:'*убегает от «Don\'t Tread on Me»*'},
];
/* Песни. Темп растёт, рисунок усложняется: четверти → восьмые → синкопы → галоп → шестнадцатые. */
const PAT = [
  ['x...x...x...x...','x...x...x.x.x...','x.......x...x...','x...x...x...x.x.'],
  ['x.x.x.x.x.x.x.x.','x...x.x.x...x.x.','x.x...x.x.x...x.','x.x.x...x.x.x...'],
  ['x..x..x.x..x..x.','x.xxx...x.xxx...','x..x.x..x..x.x..','x.x..x.xx.x..x..'],
  ['x.xxx.xxx.xxx.x.','xx.xxx.xxx.xxx..','x.x.xx.xx.x.xx.x','x.xxx.xx.xxx.xx.'],
  ['xxxxx.xxxxx.xx.x','x.xxx.xxx.xxxxxx','xx.xxxx.xx.xxxx.','xxxx.xxxxxx.xxx.'],
];
const SONGS = [
  {bpm:92,  tier:0, key:40, groove:'rock'},  {bpm:100, tier:0, key:38, groove:'rock'},  {bpm:108, tier:1, key:45, groove:'punk'},
  {bpm:112, tier:1, key:43, groove:'punk'},  {bpm:118, tier:2, key:40, groove:'thrash'},
  {bpm:122, tier:1, key:41, groove:'rock'},  {bpm:126, tier:2, key:38, groove:'punk'},  {bpm:130, tier:2, key:45, groove:'thrash'},
  {bpm:134, tier:3, key:40, groove:'gallop'},
  {bpm:138, tier:2, key:43, groove:'thrash'},{bpm:142, tier:3, key:41, groove:'gallop'},{bpm:146, tier:3, key:38, groove:'thrash'},
  {bpm:150, tier:4, key:40, groove:'thrash'},
  {bpm:96,  tier:4, key:38, groove:'doom'},  {bpm:156, tier:3, key:45, groove:'gallop'},{bpm:84, tier:4, key:36, groove:'doom'},
  {bpm:164, tier:4, key:40, groove:'thrash'},
];
OPPS.forEach((o,i)=>{ o.idx=i; o.img=`img/${o.id}.webp`; o.k=.2*Math.pow(1.13,i); o.s=SONGS[i]; });

const UPG = [
  {id:'amp',    em:'🔊', name:'Усилитель',        desc:'Сила каждого удара +8%',                  max:12, base:40, k:1.35},
  {id:'pedal',  em:'🎛️', name:'Педаль перегруза',  desc:'Ритм: точные ноты +6% · Кликер: крит +4%', max:8,  base:60, k:1.5},
  {id:'metro',  em:'⏱️', name:'Метроном',         desc:'Ритм: окно попадания шире',               max:6,  base:50, k:1.55},
  {id:'roadie', em:'🧑‍🔧', name:'Роуди',           desc:'Кликер: +1 автоудар в секунду',           max:8,  base:50, k:1.5},
  {id:'wall',   em:'🧱', name:'Стена кабинетов',  desc:'Атаки соперников слабее на 7%',           max:8,  base:50, k:1.5},
  {id:'pick',   em:'⭐', name:'Медиатор ярости',  desc:'Логотип Music Core заполняется на 15% быстрее',          max:6,  base:45, k:1.5},
];
const SHOP = [
  {id:'warm',  em:'🔥', name:'Разогрев',        desc:'Старт с перевесом +20',        price:60},
  {id:'goat',  em:'⭐', name:'Заряженный Music Core', desc:'Суперудар готов со старта', price:80},
  {id:'guard', em:'🛡️', name:'Охранник',        desc:'Блокирует первую атаку',       price:50},
];
const ITEMS = [
  {em:'🔊', name:'УСИЛОК ×2',        w:3, fn:B=>B.amp=5},
  {em:'⚡', name:'ОВЕРДРАЙВ',        w:2, fn:B=>B.od=2.5},
  {em:'🎆', name:'ПИРОТЕХНИКА!',     w:2, fn:B=>{B.pos+=10; flash(); pyro()}},
  {em:'🎸', name:'МЕДИАТОР +30',     w:3, fn:B=>B.fury=Math.min(100,B.fury+30)},
  {em:'🛡️', name:'ОХРАНА',           w:2, fn:B=>B.shield=1},
  {em:'💔', name:'ПОРВАЛАСЬ СТРУНА', w:2, bad:true, fn:B=>B.broken=3},
];
const MODES = {
  rhythm:{name:'🥁 Ритм',   hint:'Ноты едут по дорожке — бей, когда нота в кольце. Каждый соперник — своя песня, дальше быстрее и сложнее. Чем длиннее комбо, тем у́же окно.'},
  click: {name:'👆 Кликер', hint:'Просто тапай как можно быстрее. Ритм не нужен — нужны скорость и прокачка: усилитель и роуди.'},
  voice: {name:'🎤 Крик',   hint:'Кричи в микрофон «ХЕЙ!». Каждый отдельный крик — удар, громче = сильнее. Тапы отключены.'},
};
/* Ссылка для «Поделиться»: пост Music Core с историей и игрой. Пока пусто — делимся ботом. */
const POST_URL = '';
const SHARE_LINK = () => POST_URL || 'https://t.me/big_bowwow_mc_bot';
const HATE = ['Кринж 🤡','Раньше было лучше','Продались','Это автотюн?','Отписка','Мой кот играет лучше','Где новый альбом?','Скучно 💤'];
[...OPPS.map(o=>o.img),'img/hero.webp','img/stage.webp','img/mc-logo.png'].forEach(s=>{const i=new Image(); i.src=s});

/* ================= СОСТОЯНИЕ ================= */
const S = (()=>{ try{ return JSON.parse(localStorage.getItem('bbw4')||'{}') }catch(e){ return {} } })();
S.coins ??= 0; S.hero ??= 'hetfield'; S.beaten ??= 0; S.mode ??= 'rhythm'; S.best ??= 0; S.boosts ??= {}; S.mute ??= false; S.up ??= {}; S.tut ??= {};
let B=null;   // текущий бой
const save = ()=>{ try{ localStorage.setItem('bbw4', JSON.stringify(S)) }catch(e){} };
const lvl = id => S.up[id]||0;
const $ = id => document.getElementById(id);
const TG = window.Telegram && Telegram.WebApp && Telegram.WebApp.platform && Telegram.WebApp.platform!=='unknown' ? Telegram.WebApp : null;
if (TG){ TG.ready(); TG.expand(); try{TG.disableVerticalSwipes(); TG.setHeaderColor('#07060a'); TG.setBackgroundColor('#000000')}catch(e){} }
const haptic = t => { try{ TG && TG.HapticFeedback.impactOccurred(t) }catch(e){} };
const hero = () => HEROES.find(h=>h.id===S.hero);
const faceBg = (img,f)=>`background-image:url(${img});background-size:${f[2]}%;background-position:${f[0]}% ${f[1]}%`;
const faceStyle = (el,img,f)=>{ el.style.backgroundImage=`url(${img})`; el.style.backgroundSize=f[2]+'%'; el.style.backgroundPosition=`${f[0]}% ${f[1]}%`; };

/* ---- баланс ----
   S0 — «базовое давление» сильного игрока в секунду. Соперник давит S0·k·(рост к концу боя).
   Без прокачки проходятся первые 2–3 соперника, дальше нужен аппарат. */
const S0 = 7.33;
const powerMult = () => (hero().power||1) * (1 + .08*lvl('amp'));
const perfBonus = () => 1 + .06*lvl('pedal');
const winPerf   = () => .060 + .008*lvl('metro');
const winGood   = () => .120 + .010*lvl('metro');
const atkMult   = () => Math.max(.4, 1 - .07*lvl('wall'));
const furyMult  = () => 1 + .15*lvl('pick');
function playerRate(){
  if (S.mode==='rhythm') return S0*1.0*(powerMult()/1.2)*perfBonus()*(1+.03*lvl('metro'));
  const taps = (S.mode==='voice'?3:6.5);
  return .7*(taps*(S.mode==='voice'?2.2:1)+lvl('roadie'))*powerMult()*(1+.08*lvl('pedal'));
}
const might = () => Math.round(playerRate()/S0*100);
const need  = o => Math.round((3.3 + .7*atkMult() + S0*1.15*o.k)/S0*100);
const upPrice = u => Math.round(u.base*Math.pow(u.k, lvl(u.id)));

/* прожекторы */
document.querySelectorAll('[data-beams]').forEach(c=>{
  [[-8,'-28deg','8deg',5.5,'var(--beam)'],[22,'-10deg','18deg',7,'var(--beam2)'],[46,'-18deg','14deg',6,'var(--beam)'],[70,'-6deg','26deg',8,'var(--beam2)']].forEach(([l,a,b,d,c2])=>{
    const e=document.createElement('div'); e.className='beam'; e.style.cssText=`left:${l}%;--a:${a};--b:${b};--d:${d}s;--c:${c2}`; c.appendChild(e);
  });
});

function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on', s.id===id));
  document.querySelectorAll('.cn').forEach(e=>e.textContent=S.coins);
  document.querySelectorAll('.snd').forEach(e=>e.textContent=S.mute?'🔇':'🔊');
  if (id==='menu'){ $('menuHero').src=hero().img; $('best').textContent = S.best?`Рекорд выживания: ${S.best}`:''; if(AC) startLoop(100,.45); }
  if (id==='heroes') renderHeroes();
  if (id==='ladder') renderLadder();
  if (id==='shop') renderShop();
  ambient.target = document.querySelector(`#${id} [data-fx]`);
  camOnScreen(id);
}
function renderHeroes(){
  $('heroGrid').innerHTML = HEROES.map(h=>`
    <div class="card ${h.id===S.hero?'sel':''} ${h.open?'':'locked'}" onclick="${h.open?`S.hero='${h.id}';save();renderHeroes()`:''}">
      ${h.open?'':'<div class="tag">СКОРО</div>'}
      <div class="ava"><img src="${h.img}" alt=""></div>
      <div class="nm">${h.name}</div><div class="ds">${h.band}</div><div class="ds">${h.perk}</div>
    </div>`).join('');
}
function renderLadder(){
  $('modeSeg').innerHTML = Object.entries(MODES).map(([k,m])=>`<button class="${S.mode===k?'on':''}" onclick="setMode('${k}')">${m.name}</button>`).join('');
  $('modeHint').textContent = MODES[S.mode].hint; syncCamUI();
  $('might').innerHTML = `<span>Мощь аппарата: <b>${might()}</b></span><button onclick="go('shop')">Прокачать</button>`;
  let html='';
  ACTS.forEach(a=>{
    const list=OPPS.filter(o=>o.act===a.id), open=list[0].idx<=S.beaten;
    const done=list.filter(o=>o.idx<S.beaten).length;
    html+=`<div class="act ${open?'':'locked'}"><b>Акт ${a.id}. ${a.name}</b><span>${open?`${done}/${list.length} · ${a.sub}`:'🔒 закрыт'}</span></div>`;
    list.forEach(o=>{
      const i=o.idx, op=i<=S.beaten, dn=i<S.beaten, low=might()<need(o);
      html+=`<div class="row ${op?'':'locked'} ${o.boss?'boss':''}" onclick="${op?`startBattle(${i})`:''}">
        <div class="face" style="${faceBg(o.img,o.face)}"></div>
        <div><div class="t">${op?o.name:'???'}</div><div class="d">${op?`♪ «${o.song}» · ${o.s.bpm} BPM`:'Победи предыдущего'}</div>
        ${op?`<span class="req ${low?'low':''}">Нужна мощь ${need(o)}${low?' — прокачайся!':''}</span>`:''}</div>
        <div class="st">${dn?'✔':op?'▶':'🔒'}</div></div>`;
    });
  });
  $('ladderList').innerHTML=html;
}
function renderShop(){
  let h=`<div class="shopH">Аппарат · навсегда</div>`;
  h+=UPG.map(u=>{ const l=lvl(u.id), mx=l>=u.max, p=upPrice(u);
    return `<div class="row ${!mx&&S.coins<p?'poor':''}" onclick="upgrade('${u.id}')">
      <div class="face" style="display:flex;align-items:center;justify-content:center;font-size:9cqw">${u.em}</div>
      <div style="flex:1"><div class="t">${u.name}</div><div class="d">${u.desc}</div>
      <div class="lvl">${Array.from({length:u.max},(_,k)=>`<u class="${k<l?'on':''}"></u>`).join('')}</div></div>
      <div class="st ${mx?'max':''}">${mx?'MAX':p+' 🎸'}</div></div>`}).join('');
  h+=`<div class="shopH">Расходники · на 1 бой</div>`;
  h+=SHOP.map(s=>`<div class="row ${S.coins<s.price?'poor':''}" onclick="buy('${s.id}')">
      <div class="face" style="display:flex;align-items:center;justify-content:center;font-size:9cqw">${s.em}</div>
      <div><div class="t">${s.name}</div><div class="d">${s.desc}${S.boosts[s.id]?` · есть: ${S.boosts[s.id]}`:''}</div></div>
      <div class="st">${s.price} 🎸</div></div>`).join('');
  $('shopList').innerHTML=h;
}
function upgrade(id){
  const u=UPG.find(x=>x.id===id), p=upPrice(u);
  if (lvl(id)>=u.max) return;
  if (S.coins<p){ note(`Не хватает 🎸: нужно ${p}. Перепройди соперников или сыграй «Выживание».`); return; }
  S.coins-=p; S.up[id]=lvl(id)+1; save(); sfx('coin'); go('shop');
}
function buy(id){
  const s=SHOP.find(x=>x.id===id); if (S.coins<s.price){ note('Не хватает 🎸'); return; }
  S.coins-=s.price; S.boosts[id]=(S.boosts[id]||0)+1; save(); sfx('coin'); go('shop');
}
function note(t){ try{ TG ? TG.showAlert(t) : alert(t) }catch(e){ alert(t) } }
function setMode(m){ S.mode=m; save(); renderLadder(); }
function toggleMute(){ audio(); S.mute=!S.mute; save(); musicGain.gain.value=S.mute?0:M.vol; go(document.querySelector('.screen.on').id); }

/* ================= ЗВУК ================= */
let AC, dist, musicGain, sfxGain, noiseBuf, masterOut;
function audio(){
  if (AC){ if(AC.state==='suspended') AC.resume(); return; }
  AC = new (window.AudioContext||window.webkitAudioContext)();
  masterOut=AC.createDynamicsCompressor(); masterOut.connect(AC.destination);
  musicGain=AC.createGain(); musicGain.connect(masterOut);
  sfxGain=AC.createGain(); sfxGain.gain.value=.9; sfxGain.connect(masterOut);
  dist=AC.createWaveShaper();
  const n=1024, c=new Float32Array(n); for(let i=0;i<n;i++){const x=i*2/n-1; c[i]=Math.tanh(x*7)} dist.curve=c;
  const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2800;
  const g=AC.createGain(); g.gain.value=.2; dist.connect(lp).connect(g).connect(sfxGain);
  noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate); const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  setInterval(scheduler,25);
}
const mtof = m => 440*Math.pow(2,(m-69)/12);
function osc(type,f0,f1,t,len,vol,out=sfxGain){
  const o=AC.createOscillator(), g=AC.createGain(); o.type=type;
  o.frequency.setValueAtTime(f0,t); if(f1) o.frequency.exponentialRampToValueAtTime(f1,t+len);
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+len);
  o.connect(g).connect(out); o.start(t); o.stop(t+len+.02); return o;
}
function noise(t,len,vol,freq,type='bandpass',out=sfxGain){
  const s=AC.createBufferSource(), f=AC.createBiquadFilter(), g=AC.createGain();
  s.buffer=noiseBuf; f.type=type; f.frequency.value=freq;
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+len);
  s.connect(f).connect(g).connect(out); s.start(t); s.stop(t+len+.02);
}
function chord(root,len=.22,big=false,t=AC&&AC.currentTime,out){
  if(!AC) return;
  [0,7,12].concat(big?[19,24]:[]).forEach(iv=>{
    const o=AC.createOscillator(), g=AC.createGain();
    o.type='sawtooth'; o.frequency.value=mtof(root+iv); o.detune.value=(Math.random()-.5)*14;
    g.gain.setValueAtTime(.5,t); g.gain.exponentialRampToValueAtTime(.001,t+len);
    o.connect(g).connect(out||dist); o.start(t); o.stop(t+len+.02);
  });
}
function sfx(k){
  if(!AC) return; const t=AC.currentTime;
  switch(k){
    case 'goose': osc('square',620,420,t,.12,.15); osc('square',600,400,t+.16,.14,.15); break;
    case 'cat':   { const o=osc('sawtooth',450,380,t,.7,.12); o.frequency.linearRampToValueAtTime(950,t+.3); break; }
    case 'drill': { const o=osc('square',110,null,t,.8,.12); const l=AC.createOscillator(),lg=AC.createGain(); l.frequency.value=32; lg.gain.value=40; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t+.8); noise(t,.8,.15,2500); break; }
    case 'roar':  osc('sawtooth',90,55,t,.8,.2); noise(t,.8,.3,400,'lowpass'); break;
    case 'hiss':  noise(t,.6,.35,5000,'highpass'); osc('sawtooth',140,70,t+.1,.5,.12); break;
    case 'fan':   { const o=osc('sawtooth',220,160,t,.6,.1); o.frequency.linearRampToValueAtTime(300,t+.25); break; }
    case 'tick':  for(let i=0;i<4;i++) osc('square',i%4?1200:1800,null,t+i*.12,.03,.1); break;
    case 'screech': osc('sine',2600,3400,t,.7,.07); osc('sine',2650,3300,t,.7,.05); break;
    case 'kazoo': [67,71,74,71].forEach((m,i)=>osc('square',mtof(m),null,t+i*.11,.1,.07)); break;
    case 'glitch': for(let i=0;i<6;i++) osc('square',200+Math.random()*1500,null,t+i*.04,.035,.08); break;
    case 'notif': [88,93].forEach((m,i)=>osc('sine',mtof(m),null,t+i*.08,.12,.12)); osc('sine',mtof(91),null,t+.3,.1,.1); break;
    case 'warble': { const o=osc('sine',500,null,t,.7,.12); const l=AC.createOscillator(),lg=AC.createGain(); l.frequency.value=9; lg.gain.value=60; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t+.7); break; }
    case 'cash':  osc('square',mtof(96),null,t,.06,.08); osc('square',mtof(100),null,t+.07,.25,.08); noise(t,.1,.2,4000); break;
    case 'hit':   noise(t,.12,.4,160,'lowpass'); osc('sine',160,50,t,.15,.5); break;
    case 'miss':  noise(t,.05,.25,900,'bandpass'); osc('triangle',140,90,t,.07,.1); break;
    case 'item':  [76,79,84].forEach((m,i)=>osc('square',mtof(m),null,t+i*.06,.12,.08)); break;
    case 'bad':   osc('sawtooth',300,80,t,.5,.12); break;
    case 'coin':  osc('square',mtof(83),null,t,.07,.08); osc('square',mtof(88),null,t+.07,.2,.08); break;
    case 'cheer': noise(t,1.8,.4,1500,'bandpass'); noise(t+.1,1.6,.25,3000); break;
    case 'feedback': osc('sine',1800,2400,t,1.0,.06); break;
    case 'boo':   osc('sawtooth',160,110,t,1,.12); osc('sawtooth',165,112,t,1,.12); break;
    case 'boom':  osc('sine',90,30,t,.6,.8); noise(t,.5,.5,300,'lowpass'); break;
  }
}

/* ================= МУЗЫКА =================
   loop — фоновый трэш-луп (меню, кликер, крик).
   song — песня соперника в «Ритме»: барабаны и бас идут сами, гитару играешь ты. */
const M={on:false,kind:'loop',bpm:120,t0:0,next:0,step:0,intense:false,vol:.5,prog:[40,40,43,38],song:null};
function startLoop(bpm,vol=.5){
  if(!AC) return;
  const now=AC.currentTime+.06;
  Object.assign(M,{on:true,kind:'loop',bpm,t0:now,next:now,step:0,intense:false,vol,prog:hero().prog,song:null});
  musicGain.gain.setValueAtTime(S.mute?0:vol, AC.currentTime);
  document.documentElement.style.setProperty('--spb',(60/bpm)+'s');
}
function startSong(song,t0,vol=.5){
  Object.assign(M,{on:true,kind:'song',bpm:song.bpm,t0,next:t0,step:0,intense:false,vol,song});
  musicGain.gain.setValueAtTime(S.mute?0:vol, AC.currentTime);
  document.documentElement.style.setProperty('--spb',(60/song.bpm)+'s');
}
function stopMusic(){ M.on=false; }
function scheduler(){
  if(!M.on||!AC) return;
  const st=60/M.bpm/4;
  while(M.next < AC.currentTime+.12){ (M.kind==='song'?songStep:loopStep)(M.step, M.next); M.next+=st; M.step++; }
}
function drums(p,t,groove,kickOn,I){
  if (kickOn) osc('sine',130,42,t,.14,.55,musicGain);
  const snare = groove==='doom' ? p===8 : (p===4||p===12);
  if (snare){ noise(t,.16,.5,1800,'bandpass',musicGain); osc('triangle',190,140,t,.08,.2,musicGain); }
  const hat = groove==='doom' ? p%4===0 : (I||groove==='thrash'||groove==='gallop') ? true : p%2===0;
  if (hat) noise(t,.03,.1,8000,'highpass',musicGain);
}
function loopStep(s,t){
  const p=s%16, bar=Math.floor(s/16)%4, root=M.prog[bar];
  drums(p,t,'rock',[0,3,6,8,11,14].includes(p),M.intense);
  if (p===0 && bar===0) noise(t,.9,.18,6000,'highpass',musicGain);
  if ([0,2,3,6,8,10,11,14].includes(p)) chord(root,p===0?.28:.08,false,t,musicDist());
  if (p%4===0){ const at=(t-AC.currentTime)*1000; setTimeout(()=>onMusicBeat(p===0), Math.max(0,at)); }
}
function songStep(s,t){
  const sg=M.song, p=s%16, bar=Math.floor(s/16), pat=sg.bars[bar % sg.bars.length];
  const note = pat && pat[p]==='x';
  drums(p,t,sg.groove, (note && (p%2===0||sg.groove!=='rock')) || p===0, M.intense);
  if (p===0 && bar%4===0) noise(t,.9,.18,6000,'highpass',musicGain);
  if (p===0||p===8) osc('triangle',mtof(sg.prog[bar%4]-12),null,t,.4,.25,musicGain);
  if (p%4===0){ const at=(t-AC.currentTime)*1000; setTimeout(()=>onMusicBeat(p===0), Math.max(0,at)); }
}
let _md; function musicDist(){
  if(_md) return _md;
  _md=AC.createWaveShaper(); _md.curve=dist.curve;
  const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1400;
  const g=AC.createGain(); g.gain.value=.09; _md.connect(lp).connect(g).connect(musicGain); return _md;
}
function onMusicBeat(downbeat){
  const scr=document.querySelector('.screen.on'); if(!scr) return;
  scr.classList.add('pulse'); setTimeout(()=>scr.classList.remove('pulse'),110);
  if (downbeat && ambient.target) ambient.spark();
  if (B && B.started && !B.over && !B.paused) fx.beatSparks(downbeat);
}

/* ---- нотная карта (детерминированная: у соперника всегда одна и та же песня) ---- */
function rng(seed){ return ()=>{ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; }; }
function buildSong(o, startAt, seconds=32){
  const base=o.s, r=rng(o.idx*977+13);
  const scale=[0,1,3,5,7,8,10,12];
  const prog=[0,[0,5,3,7][o.idx%4],[3,8,5,10][o.idx%4],[5,3,7,1][o.idx%4]].map(x=>base.key+x);
  const riff=Array.from({length:16},()=>scale[(r()*scale.length)|0]);
  const spb=60/base.bpm, bars=Math.ceil(seconds/(spb*4))+1;
  const list=[];
  for(let b=0;b<bars;b++){
    let tier = b<1 ? Math.max(0,base.tier-2) : b<3 ? Math.max(0,base.tier-1) : (r()<.65?base.tier:Math.max(0,base.tier-1));
    const set=PAT[tier]; list.push(set[(r()*set.length)|0]);
  }
  const notes=[];
  list.forEach((pat,b)=>{ for(let p=0;p<16;p++) if(pat[p]==='x'){
    notes.push({t:startAt+(b*16+p)*spb/4, root:prog[b%4]+(p===0?0:riff[p]), hit:false, missed:false});
  }});
  return {song:{...base, bars:list, prog}, notes, dur:bars*4*spb};
}

/* ================= ЧАСТИЦЫ / FX ================= */
/* во время записи ролика частицы и дорожка рисуются в 1x — вчетверо меньше пикселей и для игры, и для копии в ролик */
const fxDpr = ()=> window.recHook ? 1 : Math.min(2,window.devicePixelRatio||1);
function makeFX(canvas){
  const ctx=canvas.getContext('2d'); const P=[], R=[];
  let W=0,H=0,D=0;
  function size(){ const r=canvas.getBoundingClientRect(), dpr=fxDpr(); if(r.width&&(r.width!==W||r.height!==H||dpr!==D)){ W=r.width;H=r.height;D=dpr; canvas.width=W*dpr; canvas.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);} }
  const api={
    W:()=>W, H:()=>H,
    add(p){ if(P.length<600) P.push(Object.assign({life:1,decay:1,g:0,drag:.98,size:3,rot:0,vr:0,type:'dot'},p)); },
    ring(x,y,color,max,w=6){ R.push({x,y,r:8,max,color,w,life:1}); },
    burst(x,y,n,colors,spd=6,type='dot'){ for(let i=0;i<n;i++){ const a=Math.random()*Math.PI*2, v=spd*(.3+Math.random()); api.add({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1,color:colors[i%colors.length],size:2+Math.random()*4,decay:.9+Math.random()*.8,g:.12,type}); } },
    notes(x,y,tx,ty,n=2){ for(let i=0;i<n;i++) api.add({x:x+Math.random()*20,y:y+Math.random()*20,vx:(tx-x)/40*(0.8+Math.random()*.4),vy:(ty-y)/40-2+Math.random()*2,color:['#ffcf4a','#22e5ff','#fff'][Math.random()*3|0],size:14+Math.random()*10,type:'note',ch:'♪♫♬'[Math.random()*3|0],decay:1.1,drag:.995,vr:(Math.random()-.5)*.2}); },
    beatSparks(big){ for(let i=0;i<(big?14:5);i++) api.add({x:Math.random()*W,y:-5,vx:(Math.random()-.5)*1.5,vy:2+Math.random()*3,color:Math.random()<.5?'#ffcf4a':'#fff',size:1.5+Math.random()*2,decay:.5,g:.06,type:'spark'}); },
    step(){
      size(); ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='lighter';
      for(let i=R.length-1;i>=0;i--){ const r=R[i]; r.r+=(r.max-r.r)*.14; r.life-=.045; if(r.life<=0){R.splice(i,1);continue}
        ctx.strokeStyle=r.color; ctx.globalAlpha=r.life; ctx.lineWidth=r.w*r.life; ctx.beginPath(); ctx.ellipse(r.x,r.y,r.r,r.r*.75,0,0,Math.PI*2); ctx.stroke(); }
      for(let i=P.length-1;i>=0;i--){ const p=P[i]; p.vx*=p.drag; p.vy=p.vy*p.drag+p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life-=.016*p.decay;
        if(p.life<=0||p.y>H+40){P.splice(i,1);continue}
        ctx.globalAlpha=Math.min(1,p.life*1.5); ctx.fillStyle=p.color;
        if(p.type==='note'){ ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.font=`${p.size}px serif`; ctx.shadowColor=p.color; ctx.shadowBlur=10; ctx.fillText(p.ch,0,0); ctx.restore(); }
        else if(p.type==='spark'){ ctx.strokeStyle=p.color; ctx.lineWidth=p.size; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-p.vx*3,p.y-p.vy*3); ctx.stroke(); }
        else if(p.type==='confetti'){ ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.fillRect(-p.size,-p.size/2,p.size*2,p.size); ctx.restore(); }
        else { ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); }
      }
      ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
    }
  };
  return api;
}
const fx = makeFX($('fx'));
const ambient = { target:null, fx:new Map(), spark(){ const f=this.get(); if(f) f.beatSparks(true); }, get(){ if(!this.target) return null; if(!this.fx.has(this.target)) this.fx.set(this.target, makeFX(this.target)); return this.fx.get(this.target); } };

/* ---- нотная дорожка (canvas) ---- */
const trk = $('track'), tctx = trk.getContext('2d');
let TW=0, TH=0, TD=0;
const HITX = .17;          // кольцо попадания — доля ширины
const LEAD = 1.6;          // сколько секунд нота едет до кольца
function drawTrack(){
  const r=trk.getBoundingClientRect(), dpr=fxDpr();
  if (r.width && (r.width!==TW||r.height!==TH||dpr!==TD)){ TW=r.width; TH=r.height; TD=dpr; trk.width=TW*dpr; trk.height=TH*dpr; tctx.setTransform(dpr,0,0,dpr,0,0); }
  tctx.clearRect(0,0,TW,TH);
  if (!B || B.mode!=='rhythm' || !B.notes || B.blind>0) return;
  const now = B.paused ? B.pauseAt : AC.currentTime, cy=TH*.5, hx=TW*HITX, speed=(TW*(1-HITX)+20)/LEAD;
  const g=tctx.createLinearGradient(0,0,0,TH); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(.25,'rgba(8,6,12,.72)'); g.addColorStop(.75,'rgba(8,6,12,.72)'); g.addColorStop(1,'rgba(0,0,0,0)');
  tctx.fillStyle=g; tctx.fillRect(0,0,TW,TH);
  tctx.strokeStyle='rgba(255,255,255,.12)'; tctx.lineWidth=2; tctx.beginPath(); tctx.moveTo(0,cy); tctx.lineTo(TW,cy); tctx.stroke();
  const spb=60/B.song.bpm;
  for(let k=Math.floor((now-B.songT0)/spb); k<100000; k++){ const t=B.songT0+k*spb, x=hx+(t-now)*speed; if(x>TW) break; if(x<0) continue;
    tctx.strokeStyle= k%4===0?'rgba(255,255,255,.22)':'rgba(255,255,255,.07)'; tctx.lineWidth=k%4===0?2:1; tctx.beginPath(); tctx.moveTo(x,cy-TH*.3); tctx.lineTo(x,cy+TH*.3); tctx.stroke(); }
  const shrink=windowShrink(), rad=TH*.3;
  tctx.lineWidth=4; tctx.strokeStyle= B.glitch>0?`hsl(${Math.random()*360},90%,60%)`:'#ffcf4a'; tctx.shadowColor='#ffcf4a'; tctx.shadowBlur=14;
  tctx.beginPath(); tctx.arc(hx,cy,rad,0,Math.PI*2); tctx.stroke();
  tctx.lineWidth=2; tctx.strokeStyle='rgba(255,207,74,.45)'; tctx.beginPath(); tctx.arc(hx,cy,rad*(.55+.45*shrink),0,Math.PI*2); tctx.stroke();
  tctx.shadowBlur=0;
  for(const n of B.notes){
    if (n.hit) continue;
    const x=hx+(n.t-now)*speed; if (x>TW+30) break; if (x<-30) continue;
    const jit = B.glitch>0 ? (Math.random()-.5)*10 : 0;
    tctx.globalAlpha = n.missed ? .25 : 1;
    const gr=tctx.createRadialGradient(x-4,cy-4+jit,2,x,cy+jit,rad*.8);
    gr.addColorStop(0,'#fff'); gr.addColorStop(.35, n.missed?'#666':'#22e5ff'); gr.addColorStop(1, n.missed?'#333':'#0a6f86');
    tctx.fillStyle=gr; tctx.shadowColor='#22e5ff'; tctx.shadowBlur=n.missed?0:12;
    tctx.beginPath(); tctx.arc(x,cy+jit,rad*.72,0,Math.PI*2); tctx.fill();
  }
  tctx.globalAlpha=1; tctx.shadowBlur=0;
}
(function tick(){
  fx.step(); drawTrack();
  if (window.recHook) window.recHook();
  const f=ambient.get();
  if (f){ if(Math.random()<.25) f.add({x:Math.random()*f.W(),y:f.H()+5,vx:(Math.random()-.5)*.4,vy:-.6-Math.random()*1.2,color:Math.random()<.5?'#ff8a1c':'#22e5ff',size:1+Math.random()*2,decay:.35,drag:1}); f.step(); }
  requestAnimationFrame(tick);
})();

/* ================= МИКРОФОН ================= */
let mic=null;
async function micStart(){
  if (mic) return true;
  try{
    const shared = !!(CAM.stream && CAM.stream.getAudioTracks().some(t=>t.readyState==='live'));   // iOS глушит второй захват микрофона — берём из камеры
    const st= shared ? new MediaStream(CAM.stream.getAudioTracks()) : await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:false,autoGainControl:false}});
    const src=AC.createMediaStreamSource(st), an=AC.createAnalyser(); an.fftSize=1024; src.connect(an);
    mic={st,an,shared,buf:new Float32Array(an.fftSize),floor:.01,loud:false,peak:0};
    return true;
  }catch(e){ note('Микрофон недоступен (нет разрешения или устройства). Этот бой — в режиме «Кликер».'); return false; }
}
function micTick(){
  if(!mic) return;
  mic.an.getFloatTimeDomainData(mic.buf);
  let s=0; for(const v of mic.buf) s+=v*v; const rms=Math.sqrt(s/mic.buf.length);
  $('micLvl').style.width=Math.min(30,rms*150)+'cqw';
  const on=mic.floor*3+.03, off=mic.floor*1.8+.015;
  if(!mic.loud && rms>on){ mic.loud=true; mic.peak=rms; }
  else if(mic.loud){ mic.peak=Math.max(mic.peak,rms); if(rms<off){ mic.loud=false; tapClick('voice', Math.min(1.6,.6+mic.peak*5)); } }
  if(!mic.loud) mic.floor=mic.floor*.995+rms*.005;
}

/* ================= БОЙ ================= */
const comboMult   = c => c>=50?1.5 : c>=25?1.3 : c>=10?1.15 : 1;
const windowShrink= () => B ? Math.max(.55, 1 - Math.min(B.combo,60)*.0075) : 1;   // чем длиннее комбо, тем у́же окно

function newBattle(o,i,survival){
  B={i,o,h:hero(),survival,mode:S.mode,wave:1,pos:0,t:survival?Infinity:30,elapsed:0,last:performance.now(),
     combo:0,maxCombo:0,fury:0,goatT:0,riffI:0,atkIn:o.atk.every,warnT:0,warnHits:0,hits:0,perfect:0,good:0,miss:0,fake:0,
     sayT:2.5,itemIn:5,amp:0,od:0,odAcc:0,roadAcc:0,broken:0,shield:0,mute:0,blind:0,glitch:0,disarm:0,drained:0,
     solo:false,over:false,started:false,paused:false,k:o.k, notes:null, song:null, heat:0, hot:0, lastTap:0, preT:0};
  const used=[];
  if(S.boosts.warm){ S.boosts.warm--; B.pos=20; used.push('🔥'); }
  if(S.boosts.goat){ S.boosts.goat--; B.fury=100; used.push('🤘'); }
  if(S.boosts.guard){ S.boosts.guard--; B.shield=1; used.push('🛡️'); }
  save(); return used;
}
function startBattle(i){ audio(); enter(newBattle(OPPS[i],i,false)); }
function startSurvival(){ audio(); enter(newBattle(OPPS[0],0,true)); }
function setOpp(o){
  B.o=o; B.k=o.k; $('oName').textContent=o.name; $('oppImg').src=o.img;
  const w=$('oppW'); w.getAnimations().forEach(a=>a.cancel()); w.style.height=o.h+'%'; w.className='spr';
  faceStyle($('pOpp'),o.img,o.face);
  Object.assign($('oppShadow').style,{right:'2%',bottom:'23.5%',width:'50%',height:'5%'});
  $('songName').innerHTML = B.mode==='rhythm' ? `♪ ${o.song}<small>${o.s.bpm} BPM</small>` : '';
}
function loadSong(o, startAt){
  const s=buildSong(o,startAt, B.survival?40:32);
  B.song=s.song; B.notes=s.notes; B.songT0=startAt; B.songEnd=startAt+s.dur;
  startSong(s.song,startAt,.5);
}
function enter(used){
  recDiscard(); if (S.cam) camAcquire();
  $('frame').classList.remove('solo'); $('arena').classList.remove('dark');
  $('hName').textContent=B.h.short||B.h.name; $('heroImg').src=B.h.img; faceStyle($('pHero'),B.h.img,B.h.face);
  setOpp(B.o);
  document.querySelectorAll('.item,.cmt,.tut,.pause,.judge,.tip').forEach(e=>e.remove());
  if (!document.querySelector('.heatBar')){ const h=document.createElement('div'); h.className='heatBar'; h.innerHTML='<i></i><span>🌡️</span>'; $('arena').appendChild(h); }
  $('warn').style.display='none'; $('warn').className='warn';
  $('micMeter').style.display='none'; $('shout').style.display='none'; $('beat').style.display='none';
  stopMusic(); go('battle'); draw();
  const begin=()=>countdown(()=>{
    B.started=true; B.last=performance.now();
    recStart();
    if (B.mode==='rhythm') loadSong(B.o, AC.currentTime+LEAD);
    else startLoop(B.h.bpm, B.mode==='voice'?.15:.5);
    if(used.length) setTimeout(()=>pop('БУСТЫ '+used.join(' '),'#ffcf4a',true),300);
    sfx(B.o.sfx); requestAnimationFrame(loop);
  });
  const afterTut=()=>{
    if (B.mode==='voice') micStart().then(ok=>{ if(!ok) B.mode='click'; $('micMeter').style.display=ok?'block':'none'; $('shout').style.display=ok?'block':'none'; begin(); });
    else begin();
  };
  if (!S.tut[B.mode]) tutorial(B.mode, afterTut); else afterTut();
}
function tutorial(mode, cb){
  const d=document.createElement('div'); d.className='tut';
  const common=`<p><b>⚠️</b><span>Когда соперник атакует — <em>бей часто</em> (${mode==='rhythm'?'8':'10'} ударов за секунду), чтобы отбить. Не отбил — толчок и пакость.</span></p>
    <p><b>⭐</b><span><em>Логотип Music Core</em> внизу заполняется цветом от твоих ударов. Заполнился — <em>жми на него</em>: суперудар ×2 на 4 секунды.</span></p>
    <p><b>⏱️</b><span>30 секунд, чтобы <em>дожать соперника до края</em>. Он давит сильнее к концу боя.</span></p>
    <p><b>🔊</b><span>Каждый следующий соперник сильнее — прокачивай аппарат в <em>Магазине</em>.</span></p>`;
  const head = mode==='rhythm'
    ? `<p><b>🥁</b><span>Ноты едут справа налево. <em>Тапай, когда нота в золотом кольце.</em> Каждый соперник — своя песня: темп и рисунок меняются.</span></p>
       <p><b>🎯</b><span>Пропустил ноту или тапнул в пустоту — <em>комбо сгорает</em>, соперник давит. Комбо ×1.15 / ×1.3 / ×1.5 на 10 / 25 / 50, но <em>окно попадания сужается</em>.</span></p>`
    : `<p><b>👆</b><span>Режим «${mode==='voice'?'Крик':'Кликер'}»: ${mode==='voice'?'<em>кричи «ХЕЙ!»</em> — каждый отдельный крик — удар.':'<em>тапай как можно быстрее</em>, ритм не нужен.'}</span></p>
       <p><b>🧑‍🔧</b><span>Роуди из Магазина бьют за тебя автоматически.</span></p>`;
  d.innerHTML=`<h3>Как играть</h3>${head}${common}<button class="btn" style="margin-top:3cqw">Понял, погнали!</button>`;
  d.querySelector('button').onclick=e=>{ e.stopPropagation(); S.tut[mode]=true; save(); d.remove(); cb(); };
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  $('arena').appendChild(d);
}
function countdown(cb){
  const d=document.createElement('div'); d.className='count'; $('arena').appendChild(d);
  let n=3; const step=()=>{
    if(n===0){ d.textContent='🤘'; chord(40,.6,true); sfx('boom'); flash(); setTimeout(()=>{d.remove();cb()},450); return }
    d.textContent=n--; d.animate([{transform:'scale(1.6)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:250,easing:'ease-out'});
    osc('sine',150,45,AC.currentTime,.15,.6); setTimeout(step,600) };
  step();
}
/* ---- пауза ---- */
function freeze(){
  B.paused=true; B.pauseAt=AC.currentTime; stopMusic(); musicGain.gain.setValueAtTime(0,AC.currentTime);
  try{ if (CAM.rec && CAM.rec.state==='recording') CAM.rec.pause(); }catch(e){}
  document.querySelectorAll('.item').forEach(e=>e.getAnimations().forEach(a=>a.pause()));
}
/* Стоп-кадр с подсказкой (один раз на каждую механику) */
function tip(key, title, html, focus){
  if (S.tut[key] || !B || B.over || B.paused) return false;
  S.tut[key]=true; save(); freeze();
  const d=document.createElement('div'); d.className='tip';
  d.innerHTML=`<div class="tipCard"><h3>${title}</h3>${html}<button class="btn">Понял, дальше!</button></div>`;
  if (focus){ const a=$('arena').getBoundingClientRect(), r=focus.getBoundingClientRect();
    const ring=document.createElement('div'); ring.className='tipRing';
    Object.assign(ring.style,{left:(r.left-a.left-8)+'px',top:(r.top-a.top-8)+'px',width:(r.width+16)+'px',height:(r.height+16)+'px'}); d.appendChild(ring); }
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  d.querySelector('button').onclick=e=>{ e.stopPropagation(); d.remove(); resume(); };
  $('arena').appendChild(d); haptic('heavy');
  return true;
}
function pause(){
  if(!B||!B.started||B.over||B.paused) return;
  freeze();
  const d=document.createElement('div'); d.className='pause';
  d.innerHTML=`<h3>ПАУЗА</h3>
    <button class="btn" data-a="resume">Продолжить</button>
    <button class="btn ghost" data-a="restart">Заново</button>
    <button class="btn ghost" data-a="ladder">Сдаться · к списку</button>
    <button class="btn ghost" data-a="menu">В главное меню</button>`;
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  d.querySelectorAll('button').forEach(b=>b.onclick=e=>{ e.stopPropagation(); const a=b.dataset.a; d.remove();
    if (a==='resume') resume();
    else { B.over=true; document.querySelectorAll('.item,.cmt,.judge').forEach(x=>x.remove()); $('warn').style.display='none';
      if (a==='restart') (B.survival?startSurvival():startBattle(B.i)); else go(a); } });
  $('arena').appendChild(d);
}
function resume(){
  const shift=AC.currentTime-B.pauseAt;
  if (B.mode==='rhythm'){ B.notes.forEach(n=>n.t+=shift); B.songT0+=shift; B.songEnd+=shift; M.t0+=shift; M.next+=shift; }
  else { M.t0+=shift; M.next=AC.currentTime+.05; }
  M.on=true; musicGain.gain.setValueAtTime(S.mute?0:M.vol,AC.currentTime);
  document.querySelectorAll('.item').forEach(e=>e.getAnimations().forEach(a=>a.play()));
  try{ if (CAM.rec && CAM.rec.state==='paused') CAM.rec.resume(); }catch(e){}
  B.paused=false; B.last=performance.now(); requestAnimationFrame(loop);
}
$('pauseBtn').addEventListener('pointerdown',e=>{ e.stopPropagation(); pause(); });
document.addEventListener('visibilitychange',()=>{ if(document.hidden) pause(); });

const heroMouth = ()=>{ const a=$('arena').getBoundingClientRect(), r=$('heroW').getBoundingClientRect(); return {x:r.left-a.left+r.width*.62, y:r.top-a.top+r.height*.52}; };
const oppCenter = ()=>{ const a=$('arena').getBoundingClientRect(), r=$('oppW').getBoundingClientRect(); return {x:r.left-a.left+r.width*.45, y:r.top-a.top+r.height*.5}; };

/* ---- удар: общая сила и визуал ---- */
function strike(p, grade, root){
  if (B.goatT>0) p*=2; if (B.amp>0) p*=2; if (B.broken>0) p*=.5; if (B.mute>0) p*=.4;
  B.pos+=p;
  chord(root, .18, B.goatT>0);
  const s=heroMouth(), o=oppCenter(), gc=B.goatT>0?'#ff3b2b':grade==='perfect'?'#ffcf4a':'#22e5ff';
  fx.ring(s.x+20,s.y,gc,grade==='perfect'?110:60,grade==='perfect'?7:4);
  fx.notes(s.x,s.y,o.x,o.y,grade==='perfect'?2:1);
  setTimeout(()=>{ if(!B) return; fx.ring(o.x,o.y,gc,grade==='perfect'?80:45,4); fx.burst(o.x,o.y,grade==='perfect'?10:5,[gc,'#fff'],grade==='perfect'?6:4,'spark'); },160);
  const ow=$('oppW'); ow.classList.remove('hurt'); void ow.offsetWidth; ow.classList.add('hurt');
  const hw=$('heroW'); hw.classList.remove('strum'); void hw.offsetWidth; hw.classList.add('strum');
}
function judge(txt,col){
  const old=document.querySelector('.judge'); if(old) old.remove();
  const d=document.createElement('div'); d.className='judge'; d.textContent=txt; d.style.color=col; $('arena').appendChild(d);
  d.animate([{transform:'translateX(-50%) scale(1.3)',opacity:1},{transform:'translateX(-50%) translateY(-30px) scale(1)',opacity:0}],{duration:450,easing:'ease-out'});
  setTimeout(()=>d.remove(),450);
}
function comboUp(){
  B.maxCombo=Math.max(B.maxCombo,B.combo);
  const c=$('combo'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  if ([10,25,50].includes(B.combo)){ pop(`🔥 КОМБО ${B.combo}  ×${comboMult(B.combo)}`,'#ff8a1c',true); sfx('cheer'); if(B.combo>=25) pop('ОКНО СУЖАЕТСЯ','#ff3d6a'); }
}
function breakCombo(){ if(B.combo>=10) pop('КОМБО СГОРЕЛО','#ff3d6a'); B.combo=0; }

/* РИТМ: тап проверяется против ближайшей ноты */
function tapRhythm(){
  const now=AC.currentTime, shrink=windowShrink()*(B.glitch>0?.6:1);
  const wp=winPerf()*shrink, wg=winGood()*shrink;
  let best=null, bd=1e9;
  for(const n of B.notes){ if(n.hit||n.missed) continue; const d=Math.abs(n.t-now); if(d<bd){bd=d;best=n;} if(n.t-now>wg) break; }
  if (B.warnT>0) { B.warnHits++; $('warnBar').style.width=Math.min(100,B.warnHits/8*100)+'%'; }
  if (!best || bd>wg){            // тап в пустоту — фальшь
    B.fake++; breakCombo(); B.pos-=S0/12; sfx('miss'); judge('ФАЛЬШЬ','#ff6b8a'); haptic('light');
    if (B.warnT<=0){ B.heat+=2.2; if (B.heat>=HEAT_MAX) overheat(); }
    return;
  }
  best.hit=true; B.hits++;
  const grade = bd<=wp ? 'perfect':'good';
  const per = S0*(B.songEnd-B.songT0)/B.notes.length;    // давление на ноту — с учётом плотности песни
  const p = per*(powerMult()/1.2)*comboMult(B.combo)*(grade==='perfect'?perfBonus():.6);
  B.combo++; comboUp();
  if (grade==='perfect'){ B.perfect++; B.fury=Math.min(100,B.fury+2.2*furyMult()); judge('ТОЧНО','#ffcf4a'); }
  else { B.good++; B.fury=Math.min(100,B.fury+.8*furyMult()); judge('НОРМ','#22e5ff'); }
  strike(p, grade, best.root);
  haptic(grade==='perfect'?'medium':'light');
}
/* КЛИКЕР / КРИК */
function tapClick(kind='tap', scale=1){
  let p = .7*powerMult()*scale*(kind==='voice'?2.2:1);
  const crit = Math.random() < .04*lvl('pedal');
  if (crit){ p*=3; pop('КРИТ ×3','#ff8a1c'); }
  if (kind!=='auto'){ B.hits++; if (B.warnT>0){ B.warnHits++; $('warnBar').style.width=Math.min(100,B.warnHits/10*100)+'%'; } }
  B.fury=Math.min(100,B.fury+(kind==='auto'?.15:.55)*furyMult()*(kind==='voice'?2:1));
  strike(p, crit?'perfect':'good', B.h.riff[B.riffI++%B.h.riff.length]);
  if (kind!=='auto') haptic('light');
}
/* Защита от мультитапа: тапы чаще 1 в 45 мс отбрасываются (несколько пальцев разом),
   а «долбёжка» греет усилок. Перегрелся — 2 секунды тишины. Во время отражения атаки нагрева нет. */
const HEAT_MAX = 11;
function onTap(){
  if(!B||!B.started||B.over||B.paused) return;
  const now=performance.now();
  if (now-B.lastTap<45) return;
  B.lastTap=now;
  if (B.hot>0){ judge('🔥 ПЕРЕГРЕВ','#ff8a1c'); return; }
  if (B.disarm>0){ pop('🚫 ГИТАРУ ОТОБРАЛИ','#ff3d6a'); return; }
  if (B.mode==='click' && B.warnT<=0){ B.heat+=1; if (B.heat>=HEAT_MAX) return overheat(); }
  if (B.mode==='rhythm') tapRhythm();
  else if (B.mode==='click') tapClick('tap');
}
function overheat(){
  B.heat=0; B.hot=2; B.combo=0; sfx('bad'); haptic('heavy'); shake(8);
  pop('🔥 ПЕРЕГРЕВ УСИЛКА!','#ff8a1c',true);
  tip('heat','🔥 Перегрев усилка',`<p>Ты долбишь по экрану слишком часто (или несколькими пальцами). Усилок перегрелся и <em>2 секунды не играет</em>.</p>
    <p>Шкала 🌡️ слева показывает нагрев. ${B.mode==='rhythm'?'Бей <em>только по нотам</em> — тапы мимо нот греют усилок.':'Тапай <em>ровно и быстро</em>, но не «пулемётом». Сильнее бьют прокачка и роуди, а не пальцы.'}</p>
    <p>Во время отражения атаки перегрева нет — там долби сколько хочешь.</p>`, document.querySelector('.heatBar'));
}
function goat(){
  if(!B||!B.started||B.over||B.paused||B.fury<100||B.goatT>0) return;
  B.fury=0; B.goatT=4; B.pos+=6; chord(40,1,true); sfx('feedback'); sfx('cheer'); sfx('boom'); haptic('heavy');
  pop('MUSIC CORE! ×2','#e0a084',true); flash(); punch(); pyro();
}
function pyro(){
  const W=fx.W(), H=fx.H();
  [[.08,.78],[.92,.78],[.3,.8],[.7,.8]].forEach(([x,y],k)=>setTimeout(()=>{
    for(let i=0;i<26;i++) fx.add({x:W*x,y:H*y,vx:(Math.random()-.5)*3,vy:-8-Math.random()*8,color:['#ffcf4a','#ff8a1c','#fff'][i%3],size:2+Math.random()*2.5,g:.22,decay:.9,type:'spark'});
  },k*70));
}
function punch(){ const a=$('arena'); a.classList.remove('punch'); void a.offsetWidth; a.classList.add('punch'); }
function shake(px=10){ $('arena').animate([{transform:'translate(0,0)'},{transform:`translate(${px}px,-${px/2}px)`},{transform:`translate(-${px}px,${px/2}px)`},{transform:`translate(${px/2}px,${px/3}px)`},{transform:'translate(0,0)'}],{duration:280}); }
function flash(){ const f=document.createElement('div'); f.className='flash'; $('arena').appendChild(f); setTimeout(()=>f.remove(),400); }
function pop(txt,col,center){
  const a=$('arena').getBoundingClientRect(), d=document.createElement('div'); d.className='pop';
  d.textContent=txt; d.style.color=col; d.style.fontSize=center?'6.5cqw':'4.4cqw';
  const x=center?a.width/2:a.width*(.4+Math.random()*.1), y=a.height*(center?.46:.38);
  d.style.left=x+'px'; d.style.top=y+'px';
  $('arena').appendChild(d);
  d.animate(center?[{transform:'translate(-50%,-50%) scale(.4) rotate(-6deg)',opacity:0},{transform:'translate(-50%,-50%) scale(1.15) rotate(2deg)',opacity:1,offset:.2},{transform:'translate(-50%,-90%) scale(1)',opacity:0}]
                  :[{transform:'translate(-50%,0) scale(.6)',opacity:1},{transform:'translate(-50%,-60px) scale(1)',opacity:0}],{duration:center?1000:700,easing:'ease-out'});
  setTimeout(()=>d.remove(),1000);
}
function say(t){ const s=$('say'); s.textContent=t; s.classList.add('on'); clearTimeout(s._t); s._t=setTimeout(()=>s.classList.remove('on'),1700); }
function spawnItem(){
  const tot=ITEMS.reduce((a,x)=>a+x.w,0); let r=Math.random()*tot, it=ITEMS[0];
  for(const x of ITEMS){ if((r-=x.w)<0){ it=x; break; } }
  const a=$('arena').getBoundingClientRect(), el=document.createElement('div'); el.className='item'+(it.bad?' bad':''); el.textContent=it.em;
  const W=a.width, H=a.height, sz=W*.17, mode=['flyL','flyR','pop','pop','drop'][Math.random()*5|0];
  const rx=()=>W*(.06+Math.random()*.72), ry=()=>H*(.24+Math.random()*.38);
  let an;
  $('arena').appendChild(el);
  if (mode==='pop'){            // возникает в случайной точке и быстро исчезает
    el.style.left=rx()+'px'; el.style.top=ry()+'px';
    an=el.animate([{transform:'scale(0)',opacity:0},{transform:'scale(1.2)',opacity:1,offset:.08},{transform:'scale(1)',opacity:1,offset:.15},{transform:'scale(1)',opacity:1,offset:.8},{transform:'scale(.9)',opacity:.3,offset:.9},{transform:'scale(1)',opacity:1,offset:.95},{transform:'scale(0)',opacity:0}],{duration:2300,easing:'ease-out'});
  } else if (mode==='drop'){    // падает сверху
    el.style.left=rx()+'px'; el.style.top=(-sz)+'px';
    an=el.animate([{transform:'translateY(0) rotate(0)'},{transform:`translateY(${H*.85}px) rotate(${(Math.random()-.5)*400}deg)`}],{duration:2800,easing:'cubic-bezier(.4,.1,.7,1)'});
  } else {                      // пролетает слева или справа
    const fromL=mode==='flyL', y=ry(), amp=20+Math.random()*30;
    el.style.left=(fromL?-sz:W)+'px'; el.style.top=y+'px';
    an=el.animate([0,.25,.5,.75,1].map(k=>({transform:`translate(${(fromL?1:-1)*k*(W+sz)}px,${Math.sin(k*Math.PI*3)*amp}px) rotate(${(fromL?1:-1)*k*200}deg)`})),{duration:3000,easing:'linear'});
  }
  an.onfinish=()=>el.remove();
  if (!it.bad) setTimeout(()=>{ if(el.isConnected) tip('item','🎁 Усилители',`<p>По сцене появляются значки — <em>тапни по ним</em>, чтобы забрать: 🔊 усилок ×2, ⚡ овердрайв, 🎆 пиротехника, 🎸 медиатор, 🛡️ охрана.</p><p>Они возникают <em>в разных местах</em> и быстро исчезают. Красные (💔) — ловушки, их <em>не трогай</em>.</p>`, el); },350);
  el.addEventListener('pointerdown',e=>{ e.stopPropagation(); if(!B||B.over||B.paused) return;
    const rr=el.getBoundingClientRect();
    fx.burst(rr.left-a.left+rr.width/2, rr.top-a.top+rr.height/2, 24, it.bad?['#ff3d6a','#fff']:['#ffcf4a','#4cf08f','#fff'],6);
    it.fn(B); sfx(it.bad?'bad':'item'); haptic(it.bad?'heavy':'medium');
    pop(it.em+' '+it.name, it.bad?'#ff3d6a':'#4cf08f', true); el.remove(); });
}
function spamComments(n=4){
  const a=$('arena').getBoundingClientRect();
  for(let i=0;i<n;i++){
    const c=document.createElement('div'); c.className='cmt';
    c.innerHTML=`<small>@user${(Math.random()*90000+10000)|0}</small>${HATE[Math.random()*HATE.length|0]}`;
    c.style.left=(a.width*(.08+Math.random()*.42))+'px'; c.style.top=(a.height*(.3+Math.random()*.35))+'px';
    c.addEventListener('pointerdown',e=>{ e.stopPropagation(); c.remove(); sfx('miss'); });
    $('arena').appendChild(c);
    c.animate([{transform:'scale(.3)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:200,delay:i*120,fill:'backwards',easing:'cubic-bezier(.2,1.5,.4,1)'});
  }
}
function applyAtk(fxk){
  let push=S0*1.6*B.k*atkMult()*(B.survival?1+B.wave*.05:1);
  const tag=t=>pop(t,'#ff3d6a',true);
  switch(fxk){
    case 'mute':    B.mute=3; tag('🔇 ЗВУК ЗАГЛУШЕН'); break;
    case 'tempo':   if(B.mode==='rhythm'){ B.glitch=3; } else { B.mute=2; } tag('⏱️ СБИЛА С РИТМА'); break;
    case 'disarm':  B.disarm=1.5; tag('🚫 ОТОБРАЛ ГИТАРУ'); break;
    case 'blackout':B.blind=3; tag('💡 ПРОБКИ ВЫБИЛО'); break;
    case 'grow':    B.k*=1.12; tag('📈 ОНИ ГРОМЧЕ'); break;
    case 'drain':   B.fury=Math.max(0,B.fury-40); B.drained++; tag('💸 −ЯРОСТЬ, −ГОНОРАР'); break;
    case 'glitch':  B.glitch=4; tag('🎚️ БИТ ПОПЛЫЛ'); break;
    case 'spam':    spamComments(4); break;
    case 'tune':    breakCombo(); B.fury=Math.max(0,B.fury-30); tag('🤖 АВТОТЮН: КОМБО СГОРЕЛО'); break;
    case 'contract':B.drained++; B.mute=2; push*=1.2; tag('📝 −ГОНОРАР'); break;
    case 'steal':   B.amp=0; B.od=0; B.shield=0; B.fury=Math.max(0,B.fury-25); document.querySelectorAll('.item').forEach(e=>e.remove()); tag('🦝 УКРАЛ УСИЛЕНИЯ'); break;
    case 'heavy':   push*=1.15; break;
    case 'pounce':  B.blind=2; push*=1.1; break;
  }
  B.pos-=push; sfx('hit'); haptic('heavy'); shake(fxk==='heavy'||fxk==='pounce'?20:12);
  const ow=$('oppW'); ow.classList.add('lunge'); setTimeout(()=>ow.classList.remove('lunge'),360);
  const s=heroMouth(); fx.burst(s.x-30,s.y,24,['#ff3d6a','#ff8a1c'],8);
}

function loop(now){
  if(!B||B.over||B.paused) return;
  const dt=Math.min(.05,(now-B.last)/1000); B.last=now;
  B.elapsed+=dt; if(!B.survival) B.t-=dt;
  if (B.mode==='voice') micTick();
  // давление соперника растёт к концу боя (0.85 → 1.45)
  const ramp = B.survival ? 1+(B.wave-1)*.06 : .85 + .6*Math.min(1,B.elapsed/30);
  let f=S0*B.k*ramp*(1+Math.sin(now/700)*.12);
  if (B.o.id==='fan') f*=1+Math.sin(now/310)*.3;
  B.pos-=f*dt;
  if (B.mode==='rhythm' && B.notes){
    const tnow=AC.currentTime, wg=winGood()*windowShrink();
    for(const n of B.notes){ if(n.t>tnow) break; if(!n.hit&&!n.missed&&tnow-n.t>wg){ n.missed=true; B.miss++; breakCombo(); B.pos-=S0/20; judge('МИМО','#8a8a96'); } }
    if (tnow>B.songEnd-.3) loadSong(B.o, tnow+LEAD);   // песня закончилась — играем заново
  }
  if (B.mode!=='rhythm' && lvl('roadie')>0){ B.roadAcc+=dt*lvl('roadie'); while(B.roadAcc>=1){ B.roadAcc--; tapClick('auto'); } }
  if (B.preT>0){                       // соперник заряжает атаку
    B.preT-=dt;
    $('warnBar').style.width=Math.min(100,(1-B.preT/B.preMax)*100)+'%';
    if (B.preT<=0){
      B.warnT=1.3; B.warnHits=0; const need=B.mode==='rhythm'?8:10;
      $('warn').className='warn hit'; $('warnT').textContent=`🛡️ ОТБИВАЙ! ТАПАЙ ×${need}`; $('warnBar').style.width='0%';
      sfx(B.o.sfx); haptic('heavy');
    }
  } else if (B.warnT>0){
    B.warnT-=dt;
    if (B.warnT<=0){
      $('warn').style.display='none'; $('warn').className='warn'; $('oppW').classList.remove('windup');
      const needHits = B.mode==='rhythm'?8:10;
      if (B.warnHits>=needHits){ pop('ОТБИЛ!','#4cf08f',true); B.pos+=4; B.fury=Math.min(100,B.fury+6); sfx('cheer'); const o=oppCenter(); fx.burst(o.x,o.y,30,['#4cf08f','#fff'],8,'spark'); }
      else if (B.shield){ B.shield=0; pop('🛡️ ОХРАНА ПРИКРЫЛА','#4cf08f',true); }
      else applyAtk(B.o.atk.fx);
      B.atkIn=B.o.atk.every*(.8+Math.random()*.4);
    }
  } else if ((B.atkIn-=dt)<=0){
    B.preMax=B.preT=B.o.act>=3?1.1:1.6;
    $('warn').className='warn pre'; $('warn').style.display='block';
    $('warnT').textContent=`⚡ ${B.o.name.toUpperCase()} ГОТОВИТСЯ: ${B.o.atk.name}`; $('warnBar').style.width='0%';
    $('oppW').classList.add('windup'); sfx('tick');
    tip('atk','⚡ Соперник готовится к атаке',`<p>Видишь жёлтую плашку и заряжающуюся шкалу? Через секунду будет <em>атака</em>.</p>
      <p>Когда плашка станет <em>красной «ОТБИВАЙ!»</em> — тапай по экрану <em>очень быстро</em>: ${B.mode==='rhythm'?'8':'10'} ударов, пока не закончилась шкала. Можно хоть всеми пальцами.</p>
      <p>Отбил — соперник отлетает, а логотип Music Core заряжается. Не отбил — он толкает тебя и делает пакость (у каждого своя).</p>`, $('oppW'));
  }
  if ((B.sayT-=dt)<=0){ say(B.o.lines[Math.random()*B.o.lines.length|0]); B.sayT=4+Math.random()*3; }
  if ((B.itemIn-=dt)<=0){ spawnItem(); B.itemIn=7+Math.random()*5; }
  if (B.od>0){ B.od-=dt; B.odAcc+=dt*8; while(B.odAcc>=1){ B.odAcc--; strike(.6*powerMult(),'good',B.h.riff[B.riffI++%8]); } }
  ['goatT','amp','broken','mute','blind','glitch','disarm','hot'].forEach(k=>{ if(B[k]>0) B[k]-=dt; });
  B.heat=Math.max(0,B.heat-dt*(B.mode==='rhythm'?3:7));
  if (!B.survival && !B.solo && B.t<=10){ B.solo=true; M.intense=true; $('frame').classList.add('solo'); pop('🎸 ФИНАЛ: ДАВИТ СИЛЬНЕЕ','#ff3b2b',true); sfx('cheer'); }
  B.pos=Math.max(-100,Math.min(100,B.pos));
  draw();
  if (B.pos>=100){ if (B.survival) nextWave(); else return end(true); }
  if (B.pos<=-100) return end(false);
  if (B.t<=0) return end(false, true);
  requestAnimationFrame(loop);
}
function nextWave(){
  B.wave++; B.pos=0; sfx('cheer'); flash(); pyro();
  const pool=OPPS.slice(0,Math.min(OPPS.length,2+B.wave));
  const o=pool[Math.random()*pool.length|0]; setOpp(o);
  B.atkIn=o.atk.every; B.combo=0;
  if (B.mode==='rhythm') loadSong(o, AC.currentTime+LEAD);
  $('oppW').animate([{transform:'translateX(60%)',opacity:0},{transform:'translateX(0)',opacity:1}],{duration:400,easing:'ease-out'});
  pop(`ВОЛНА ${B.wave}`,'#ffcf4a',true); sfx(o.sfx);
}
function draw(){
  const p=(B.pos+100)/2;
  $('tugMe').style.width=p+'%'; $('tugThem').style.width=(100-p)+'%'; $('knot').style.left=p+'%';
  const tm=$('timer'); tm.textContent=B.survival?`ВОЛНА ${B.wave}`:Math.max(0,Math.ceil(B.t)); tm.classList.toggle('hot',!B.survival&&B.t<=10);
  const gb=$('goat'); $('fury').style.clipPath=`inset(${100-(B.goatT>0?100:B.fury)}% 0 0 0)`;
  gb.classList.toggle('ready',B.fury>=100&&B.goatT<=0); gb.classList.toggle('active',B.goatT>0);
  $('mcPct').textContent = B.goatT>0 ? 'ЖАРИТ!' : B.fury>=100 ? 'ЖМИ!' : Math.floor(B.fury)+'%';
  $('combo').textContent=B.mode==='rhythm'&&B.combo>1?`КОМБО ${B.combo}${comboMult(B.combo)>1?'  ·  ×'+comboMult(B.combo):''}`:'';
  $('arena').classList.toggle('dark',B.blind>0);
  const hb=document.querySelector('.heatBar'); if(hb){ hb.querySelector('i').style.height=(B.hot>0?100:B.heat/HEAT_MAX*100)+'%'; hb.classList.toggle('hot',B.hot>0||B.heat>HEAT_MAX*.7); hb.style.opacity=(B.mode==='click'||B.heat>0||B.hot>0)?1:.25; }
  const k=B.pos/100, ow=$('oppW');
  if(!ow.classList.contains('lunge')) ow.style.transform=`translateX(${k*14}%) translateY(${-k*6}%) scale(${1-k*.18})`;
  ow.classList.toggle('scared',k>.55);
  $('oppShadow').style.transform=`translateX(${k*14}%) scale(${1-k*.18})`;
  $('bbg').style.transform=`translateX(${-k*1.5}%) scale(1.03)`;
  $('heroW').classList.toggle('goatOn',B.goatT>0);
  const bf=[], db=[];
  if(B.amp>0) bf.push(`🔊 ${Math.ceil(B.amp)}`); if(B.od>0) bf.push(`⚡ ${Math.ceil(B.od)}`);
  if(B.goatT>0) bf.push(`MC ×2 ${Math.ceil(B.goatT)}`); if(B.shield) bf.push('🛡️');
  if(B.broken>0) db.push(`💔 ${Math.ceil(B.broken)}`); if(B.mute>0) db.push(`🔇 ${Math.ceil(B.mute)}`);
  if(B.glitch>0) db.push(`🎚️ ${Math.ceil(B.glitch)}`); if(B.disarm>0) db.push('🚫');
  $('buffs').innerHTML=bf.map(x=>`<span>${x}</span>`).join('')+db.map(x=>`<span class="debuff">${x}</span>`).join('');
}
function end(win, timeout=false){
  B.over=true; $('warn').style.display='none'; stopMusic(); $('arena').classList.remove('dark');
  document.querySelectorAll('.item,.cmt,.judge').forEach(e=>e.remove());
  const o=B.o, ow=$('oppW');
  if (win){ ow.animate([{transform:ow.style.transform},{transform:'translateX(140%) translateY(-20%) rotate(25deg) scale(.6)',opacity:.2}],{duration:600,easing:'ease-in',fill:'forwards'}); pyro(); }
  else { ow.animate([{transform:ow.style.transform},{transform:'translateX(-60%) scale(1.7)'}],{duration:450,easing:'ease-in',fill:'forwards'}); shake(18); }
  let reward; const stat=(v,l)=>`<div class="stat"><b>${v}</b><span>${l}</span></div>`;
  $('resArt').src=o.img; $('resT').classList.toggle('lose',!win&&!B.survival);
  $('callBox').innerHTML='';
  if (B.survival){
    reward=(B.wave-1)*12 + Math.floor(B.maxCombo/3); const rec=B.wave-1>S.best; if(rec) S.best=B.wave-1;
    $('resT').innerHTML=rec?'Новый<br>рекорд!':'Сцена<br>пала';
    $('resS').innerHTML=stat(B.wave-1,'отпугнул')+stat(B.maxCombo,'макс. комбо')+stat(S.best,'рекорд');
    $('resNext').textContent='Ещё раз'; $('resNext').onclick=startSurvival;
  } else {
    const first = win && B.i===S.beaten;
    const total = B.perfect+B.good+B.miss;
    const acc = total? Math.round((B.perfect+B.good*.6)/total*100) : 0;
    reward = win ? Math.round((first ? 25+B.i*14 : 10+B.i*5) * (o.boss?1.6:1) * Math.pow(.7,B.drained)) + Math.floor(B.maxCombo/3) : 4+Math.max(0,Math.round((B.pos+100)/20));
    if (first) S.beaten++;
    $('resT').innerHTML = win?'Отпугнул!':(timeout?'Не дожал…':'Сбежал…');
    $('resS').innerHTML = B.mode==='rhythm' ? stat(acc+'%','точность')+stat(B.maxCombo,'макс. комбо')+stat(B.miss+B.fake,'ошибок')
                                            : stat(B.hits,'ударов')+stat((B.hits/Math.max(1,B.elapsed)).toFixed(1),'в секунду')+stat(lvl('roadie'),'роуди');
    const fin = win && o.id==='puma' && B.h.id==='hetfield';
    if (fin) $('callBox').innerHTML = `
      <div class="imsg"><div class="bar"><div class="av">J</div><div class="who">James ›</div></div>
        <div class="body"><div class="ts">iMessage · Сегодня 13:45</div>
          <div class="photo"><img src="${B.h.img}" alt=""></div>
          <div class="bub">Слышал про пуму. Решил подтвердить, что это правда я <nobr>🤘</nobr></div></div></div>`;
    else $('callBox').innerHTML = `<div class="quote"><div class="face" style="${faceBg(o.img,o.face)}"></div><div><b>${o.name}</b><span>${win?o.bye:(timeout?'Время вышло. Прокачай аппарат и возвращайся.':o.lines[0])}</span></div></div>`;
    const next = win && B.i+1<OPPS.length;
    const i=B.i;
    if (win){ $('resNext').textContent = next?'Следующий соперник':'Карьера пройдена!'; $('resNext').onclick=()=> next?startBattle(i+1):go('ladder'); }
    else if (might()<need(o)){ $('resNext').textContent='Прокачать аппарат'; $('resNext').onclick=()=>go('shop'); }
    else { $('resNext').textContent='Реванш'; $('resNext').onclick=()=>startBattle(i); }
  }
  $('resR').textContent=`+${reward} 🎸`;
  recFinish($('resT').innerHTML.replace(/<br>/g,' '), win||(B.survival&&B.wave>1));
  S.coins+=reward; save();
  if (win||B.survival){ chord(40,1.2,true); sfx('cheer'); } else sfx('boo');
  setTimeout(()=>{ $('frame').classList.remove('solo'); go('result');
    if (win){ const f=ambient.get(); if(f){ for(let i=0;i<120;i++) f.add({x:Math.random()*f.W(),y:-10-Math.random()*200,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,color:['#ffcf4a','#ff3b2b','#22e5ff','#fff'][i%4],size:3+Math.random()*3,g:.03,decay:.35,drag:.995,type:'confetti',vr:(Math.random()-.5)*.3}); } }
  },900);
}
function share(){
  const txt = B&&B.survival ? `Я отпугнул ${B.wave-1} соперников в «Биг Бау Вау» от Music Core 🤘 Побьёшь?` : `Я дошёл до соперника «${OPPS[Math.min(S.beaten,OPPS.length-1)].name}» в «Биг Бау Вау» от Music Core 🤘`;
  const url = SHARE_LINK();
  if (TG) TG.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(txt));
  else if (navigator.share) navigator.share({text:txt,url}).catch(()=>{});
  else note(txt);
}

/* ================= ВИДЕО-РЕАКЦИЯ =================
   Необязательно: тумблер «🎥 Снимать себя». Фронталка в кружке, бой собирается
   на <canvas> 720×1280 (9:16) + игровой звук + микрофон → MediaRecorder.
   Ролик остаётся только на устройстве игрока: никуда не отправляется. */
const CAM={stream:null,pending:null,rec:null,cv:null,ctx:null,timer:0,dest:null,micSrc:null,final:null,blob:null,url:null,mime:''};
const RW=720, RH=1280, BAND=170, RS=.75;   // разметка в 720×1280, сам ролик 540×960 (Telegram всё равно пережимает до ~464×848)
const STAGE=new Image(); STAGE.src='img/stage.webp';
const MCLOGO=new Image(); MCLOGO.src='img/mc-logo.png';
const recOK = ()=> !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder && HTMLCanvasElement.prototype.captureStream);

function syncCamUI(){
  const live=!!CAM.stream;
  $('camSw').classList.toggle('on', !!S.cam);
  $('camRow').classList.toggle('live', live);
  $('arena').classList.toggle('camOn', live);
  const b=$('camBtn'); b.textContent = S.cam ? '✕' : '🎥'; b.title = S.cam ? 'Выключить камеру' : 'Снимать себя';
  $('recDot').style.display = CAM.rec ? 'block' : 'none';
}
function camAttach(){
  document.querySelectorAll('video.camFeed').forEach(v=>{
    if (v.srcObject!==CAM.stream) v.srcObject=CAM.stream;
    if (CAM.stream) v.play().catch(()=>{});
  });
  syncCamUI();
}
function camAcquire(){
  if (CAM.stream) return Promise.resolve(true);
  if (CAM.pending) return CAM.pending;
  if (!recOK()){ S.cam=false; save(); syncCamUI(); note('Запись видео тут не поддерживается. Играем без камеры.'); return Promise.resolve(false); }
  const vid={facingMode:'user',width:{ideal:360},height:{ideal:360},frameRate:{ideal:24,max:30}};
  const withMic = !(mic && mic.st && mic.st.active && !mic.shared);   // микрофон уже взят режимом «Крик» — второй раз не просим
  const ask = a => navigator.mediaDevices.getUserMedia({video:vid, audio:a?{echoCancellation:true,noiseSuppression:false,autoGainControl:false}:false});
  CAM.pending = ask(withMic).catch(e=> withMic && e && e.name!=='NotAllowedError' ? ask(false) : Promise.reject(e))
    .then(st=>{
      CAM.pending=null;
      if (!S.cam){ st.getTracks().forEach(t=>t.stop()); return false; }   // успели выключить
      CAM.stream=st; camAttach(); return true;
    })
    .catch(e=>{
      CAM.pending=null; S.cam=false; save(); syncCamUI();
      note(e && e.name==='NotAllowedError' ? 'Нет доступа к камере. Разреши его в настройках Telegram/браузера — а пока играем без камеры.'
         : e && e.name==='NotFoundError' ? 'Фронтальная камера не найдена. Играем без камеры.'
         : 'Камера сейчас недоступна. Играем без неё.');
      return false;
    });
  return CAM.pending;
}
function camRelease(){
  if (!CAM.stream) return;
  CAM.stream.getTracks().forEach(t=>t.stop()); CAM.stream=null;
  if (mic && mic.shared) mic=null;   // «Крик» слушал микрофон камеры — в следующий раз возьмёт свой
  camAttach();
}
function toggleCam(){
  audio();
  if (S.cam){ S.cam=false; save(); recDiscard(); camRelease(); syncCamUI(); return; }
  S.cam=true; save(); syncCamUI();
  camAcquire().then(ok=>{ if (ok) recStart(); });
}
/* камера живёт только на экранах карьеры, боя и результата */
function camOnScreen(id){
  if (id!=='battle' && id!=='result' && CAM.rec && !CAM.final) recDiscard();
  if (!['ladder','battle','result'].includes(id)) camRelease();
  else if (S.cam && id==='ladder') camAcquire();
  syncCamUI();
}

function pickMime(){
  const c=['video/mp4;codecs="avc1.42E01E, mp4a.40.2"','video/mp4;codecs=avc1,mp4a','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  return c.find(m=>{ try{ return MediaRecorder.isTypeSupported(m) }catch(e){ return false } }) || '';
}
function recStart(){
  if (!CAM.stream || !B || !B.started || B.over || CAM.rec || !AC) return;
  recClear();
  if (!CAM.cv){ CAM.cv=document.createElement('canvas'); CAM.cv.width=RW*RS; CAM.cv.height=RH*RS; CAM.ctx=CAM.cv.getContext('2d',{alpha:false}); }
  if (!CAM.dest){ CAM.dest=AC.createMediaStreamDestination(); masterOut.connect(CAM.dest); }
  if (CAM.micSrc){ try{ CAM.micSrc.disconnect(); }catch(e){} CAM.micSrc=null; }
  let at=CAM.stream.getAudioTracks().filter(t=>t.readyState==='live');
  if (!at.length && mic && mic.st) at=mic.st.getAudioTracks().filter(t=>t.readyState==='live');
  if (at.length){ CAM.micSrc=AC.createMediaStreamSource(new MediaStream(at)); const g=AC.createGain(); g.gain.value=1.3; CAM.micSrc.connect(g).connect(CAM.dest); }
  recFrame();
  const vs=CAM.cv.captureStream(30);
  const ms=new MediaStream([...vs.getVideoTracks(), ...CAM.dest.stream.getAudioTracks()]);
  CAM.mime=pickMime();
  let rec;
  try{ rec=new MediaRecorder(ms, CAM.mime?{mimeType:CAM.mime, videoBitsPerSecond:1500000, audioBitsPerSecond:128000}:undefined); }
  catch(e){ try{ rec=new MediaRecorder(ms); }catch(e2){ vs.getTracks().forEach(t=>t.stop()); note('Не получилось начать запись видео. Играем дальше без неё.'); return; } }
  const chunks=[]; CAM.final=null;
  rec.ondataavailable=e=>{ if (e.data && e.data.size) chunks.push(e.data); };
  rec.onstop=()=>{
    vs.getTracks().forEach(t=>t.stop());
    if (rec._discard || !chunks.length) return;
    const type=((rec.mimeType||CAM.mime||'video/webm').split(';')[0]) || 'video/webm';
    CAM.blob=new Blob(chunks,{type}); CAM.url=URL.createObjectURL(CAM.blob); CAM.final=null; renderRec();
  };
  CAM.rec=rec; rec.start(1000);
  CAM.gap=1000/30; CAM.ema=0; CAM.lastF=0; window.recHook=recTick;
  syncCamUI();
}
/* кадр ролика рисуется в том же requestAnimationFrame, что и игра (раскладка уже посчитана),
   не чаще 30 раз в секунду; если телефон не успевает — сам снижает до 24 или 20 кадров */
function recTick(){
  const now=performance.now(); if (now-CAM.lastF < CAM.gap-4) return;
  CAM.lastF=now; recFrame(); const dt=performance.now()-now;
  CAM.ema = CAM.ema ? CAM.ema*.9+dt*.1 : dt;
  CAM.gap = CAM.ema>14 ? 1000/20 : CAM.ema>9 ? 1000/24 : CAM.ema<6 ? 1000/30 : CAM.gap;
}
function recStop(discard){
  window.recHook=null;
  const r=CAM.rec; CAM.rec=null;
  if (r){ r._discard=discard; try{ if (r.state!=='inactive') r.stop(); }catch(e){} }
  syncCamUI();
}
function recDiscard(){ recStop(true); CAM.final=null; recClear(); }
function recClear(){
  if (CAM.url) URL.revokeObjectURL(CAM.url);
  CAM.url=null; CAM.blob=null; renderRec();
}
function recFinish(title, win){
  if (!CAM.rec) return;
  CAM.final={title, win, name:B.o.name, t:performance.now()};
  renderRec();
  setTimeout(()=>{ if (CAM.final) recStop(false); }, 2600);   // 0.5 с развязки + 2 с финальной карточки
}

/* ---- кадр ролика ---- */
function rrect(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
function coverDraw(c,img,x,y,w,h){
  const iw=img.naturalWidth, ih=img.naturalHeight; if(!iw||!ih) return;
  const sc=Math.max(w/iw,h/ih), sw=w/sc, sh=h/sc; c.drawImage(img,(iw-sw)/2,(ih-sh)/2,sw,sh,x,y,w,h);
}
/* статичные слои рисуются один раз и дальше только копируются */
function layer(w,h,draw){ const cv=document.createElement('canvas'); cv.width=Math.round(w*RS); cv.height=Math.round(h*RS); const c=cv.getContext('2d'); c.scale(RS,RS); draw(c); return cv; }
function stageLayer(){
  if (!CAM.bgL && STAGE.naturalWidth) CAM.bgL=layer(RW*1.08,RH*1.08,c=>coverDraw(c,STAGE,0,0,RW*1.08,RH*1.08));
  return CAM.bgL;
}
function bandLayer(){
  if (CAM.bandL) return CAM.bandL;
  if (!MCLOGO.naturalWidth || !(document.fonts && document.fonts.check('32px "Russo One"'))) return null;
  return CAM.bandL=layer(RW,BAND+60,c=>{
    const g=c.createLinearGradient(0,0,0,BAND+60); g.addColorStop(0,'rgba(7,6,10,0)'); g.addColorStop(.3,'rgba(7,6,10,.92)'); g.addColorStop(1,'#07060a'); c.fillStyle=g; c.fillRect(0,0,RW,BAND+60);
    const h=74, w=MCLOGO.naturalWidth*h/MCLOGO.naturalHeight; c.drawImage(MCLOGO,(RW-w)/2,78,w,h);
    c.textAlign='center'; c.font=`32px ${FONT}`; c.fillStyle='#e0a084'; c.fillText('Биг Бау Вау · Music Core',RW/2,BAND+30);
  });
}
function fitText(c,txt,max,size,font){ let s=size; do{ c.font=`${s}px ${font}`; s-=2; }while(c.measureText(txt).width>max && s>12); }
const FONT='"Russo One","Arial Black",sans-serif', BODYF='"Oswald","Arial Narrow",Arial,sans-serif';
function recFrame(){
  const c=CAM.ctx; if(!c || !B) return;
  const fr=$('frame').getBoundingClientRect(), ar=$('arena'), aw=ar.offsetWidth, ah=ar.offsetHeight, vis=!!(aw&&ah);
  if (!vis && !CAM.final) return;   // бой скрыт (уже экран результата) — дорисовываем только финальную карточку
  const s=vis?Math.min(RW/aw,(RH-BAND)/ah):1, ox=vis?(RW-aw*s)/2:0, AH=ah*s, u=aw/100*s;   // u — 1cqw в пикселях ролика
  const M=r=>({x:ox+(r.left-fr.left)*s, y:(r.top-fr.top)*s, w:r.width*s, h:r.height*s});
  const arR=ar.getBoundingClientRect(), dx=vis?(arR.left-fr.left)*s:0, dy=vis?(arR.top-fr.top)*s:0;   // тряска сцены
  const k=B.pos/100;
  let g;
  c.setTransform(RS,0,0,RS,0,0); c.globalAlpha=1; c.globalCompositeOperation='source-over'; c.shadowBlur=0;
  // сцена
  const bg=stageLayer();
  if (bg) c.drawImage(bg, -RW*.04+dx-k*RW*.015, -RH*.04+dy, RW*1.08, RH*1.08); else { c.fillStyle='#07060a'; c.fillRect(0,0,RW,RH); }
  if (vis){
  if (B.solo){ c.fillStyle='rgba(255,40,20,.12)'; c.fillRect(0,0,RW,RH); }
  // спрайты (позиции, тряска, отлёт берутся прямо из DOM)
  const spr=img=>{ if(!img.complete||!img.naturalWidth) return; const r=M(img.getBoundingClientRect()); if(r.w<2) return;
    const sc=Math.min(r.w/img.naturalWidth,r.h/img.naturalHeight), w=img.naturalWidth*sc, h=img.naturalHeight*sc;
    c.drawImage(img, r.x+(r.w-w)/2, r.y+r.h-h, w, h); };
  const oa=B.over?parseFloat(getComputedStyle($('oppW')).opacity):1; c.globalAlpha=isNaN(oa)?1:oa; spr($('oppImg')); c.globalAlpha=1;
  spr($('heroImg'));
  // нотная дорожка и частицы — готовые канвасы игры
  [$('track'),$('fx')].forEach(cv=>{ if(cv.width){ const r=M(cv.getBoundingClientRect()); if(r.w) c.drawImage(cv,r.x,r.y,r.w,r.h); } });
  if (B.blind>0){ c.fillStyle='rgba(0,0,0,.82)'; c.fillRect(0,0,RW,AH); }
  // плашки, реплики, усилители, «попапы» ударов
  const warn=$('warn');
  if (warn.style.display==='block'){ const r=M($('warnT').getBoundingClientRect()), pre=warn.classList.contains('pre'), t=$('warnT').textContent;
    c.fillStyle=pre?'rgba(255,170,30,.92)':'rgba(255,30,60,.88)'; c.fillRect(0,r.y,RW,r.h);
    c.fillStyle=pre?'#1a0d00':'#fff'; c.textAlign='center'; c.textBaseline='middle'; fitText(c,t,RW-40,Math.round(r.h*.5),FONT); c.fillText(t,RW/2,r.y+r.h/2); }
  const sayEl=$('say');
  if (sayEl.classList.contains('on')){ const r=M(sayEl.getBoundingClientRect()), fs=Math.round(3.6*u), lh=Math.round(fs*1.25), pad=Math.round(3*u);
    c.fillStyle='#fff'; rrect(c,r.x,r.y,r.w,r.h,Math.round(3.5*u)); c.fill();
    c.fillStyle='#111'; c.textAlign='left'; c.textBaseline='top'; c.font=`700 ${fs}px ${BODYF}`;
    let line='', y=r.y+Math.round(2*u);
    sayEl.textContent.split(' ').forEach(w=>{ const t=line?line+' '+w:w; if(c.measureText(t).width>r.w-pad*2 && line){ c.fillText(line,r.x+pad,y); y+=lh; line=w; } else line=t; });
    c.fillText(line,r.x+pad,y); }
  document.querySelectorAll('#arena .item').forEach(el=>{ const r=M(el.getBoundingClientRect()); c.textAlign='center'; c.textBaseline='middle'; c.font=`${Math.round(r.h*.55)}px sans-serif`;
    c.fillText(el.textContent,r.x+r.w/2,r.y+r.h/2); });
  document.querySelectorAll('#arena .pop, #arena .judge, #combo').forEach(el=>{ if(!el.textContent) return; const cs=getComputedStyle(el), o=parseFloat(cs.opacity); if(!(o>0)) return;
    const r=M(el.getBoundingClientRect()), x=r.x+r.w/2, y=r.y+r.h/2;
    c.globalAlpha=o; c.font=`${Math.round(parseFloat(cs.fontSize)*s)}px ${FONT}`; c.textAlign='center'; c.textBaseline='middle';
    c.lineWidth=6; c.strokeStyle='#000'; c.strokeText(el.textContent,x,y); c.fillStyle=cs.color; c.fillText(el.textContent,x,y); c.globalAlpha=1; });
  // HUD: имена, перетягивание, таймер
  const p=(B.pos+100)/200, bx=50, bw=RW-100, by=92, bh=34, hn=(B.h.short||B.h.name).toUpperCase(), on=B.o.name.toUpperCase();
  c.textBaseline='alphabetic'; c.lineWidth=5; c.strokeStyle='#000';
  c.font=`28px ${FONT}`; c.textAlign='left'; c.strokeText(hn,bx,76); c.fillStyle='#b8f6ff'; c.fillText(hn,bx,76);
  fitText(c,on,bw*.62,28,FONT); c.textAlign='right'; c.strokeText(on,bx+bw,76); c.fillStyle='#ffb3a8'; c.fillText(on,bx+bw,76);
  c.fillStyle='#000'; rrect(c,bx-5,by-5,bw+10,bh+10,22); c.fill();
  c.save(); rrect(c,bx,by,bw,bh,17); c.clip();
  g=c.createLinearGradient(0,by,0,by+bh); g.addColorStop(0,'#ff8d78'); g.addColorStop(.5,'#e5221a'); g.addColorStop(1,'#7d0f09'); c.fillStyle=g; c.fillRect(bx,by,bw,bh);
  g=c.createLinearGradient(0,by,0,by+bh); g.addColorStop(0,'#7ff3ff'); g.addColorStop(.5,'#14b9d6'); g.addColorStop(1,'#0a6f86'); c.fillStyle=g; c.fillRect(bx,by,bw*p,bh);
  c.fillStyle='rgba(255,255,255,.3)'; c.fillRect(bx,by,bw,bh/2); c.restore();
  c.fillStyle='rgba(255,255,255,.35)'; rrect(c,bx+bw*p-14,by-15,28,bh+30,10); c.fill(); c.fillStyle='#fff'; rrect(c,bx+bw*p-9,by-10,18,bh+20,6); c.fill();
  const tt=B.survival?`ВОЛНА ${B.wave}`:String(Math.max(0,Math.ceil(B.t)));
  c.textAlign='center'; c.font=`68px ${FONT}`; c.lineWidth=8; c.strokeText(tt,RW/2,by+bh+82); c.fillStyle=!B.survival&&B.t<=10?'#ff3b2b':'#fff'; c.fillText(tt,RW/2,by+bh+82);
  // вспышка
  const fl=document.querySelector('#arena .flash'); if (fl){ const o=parseFloat(getComputedStyle(fl).opacity)||0; if(o>0){ c.globalAlpha=o; c.fillStyle='#fff'; c.fillRect(0,0,RW,RH); c.globalAlpha=1; } }
  }
  // финальная карточка
  const fa = !CAM.final ? 0 : !vis ? 1 : Math.max(0,Math.min(1,(performance.now()-CAM.final.t-500)/350));
  if (fa>0){
    const T=CAM.final.title.toUpperCase(), N=CAM.final.name.toUpperCase();
    c.globalAlpha=fa; c.fillStyle='rgba(7,6,10,.86)'; c.fillRect(0,0,RW,RH);
    const oi=$('oppImg'); if (oi.naturalWidth){ const sc=Math.min(520/oi.naturalWidth,560/oi.naturalHeight), w=oi.naturalWidth*sc, h=oi.naturalHeight*sc;
      c.globalAlpha=fa*(CAM.final.win?.95:.8); c.drawImage(oi,(RW-w)/2,990-h,w,h); c.globalAlpha=fa; }
    c.textAlign='center'; c.textBaseline='alphabetic'; fitText(c,T,RW-60,110,FONT);
    g=c.createLinearGradient(0,240,0,340); g.addColorStop(0,'#fff'); g.addColorStop(.6,CAM.final.win?'#ffcf4a':'#c9c0d3'); g.addColorStop(1,CAM.final.win?'#ff8a1c':'#a99fb2');
    c.lineWidth=12; c.strokeStyle='#6a0d06'; c.strokeText(T,RW/2,340); c.fillStyle=g; c.fillText(T,RW/2,340);
    fitText(c,N,RW-80,38,FONT); c.fillStyle='#ffb3a8'; c.fillText(N,RW/2,400);
    c.globalAlpha=1;
  }
  // нижняя плашка бренда
  const band=bandLayer();
  if (band) c.drawImage(band,0,RH-BAND-60,RW,BAND+60);
  // кружок с лицом
  const v=$('camVid');
  if (CAM.stream && v.videoWidth){
    const br=$('camBubble').getBoundingClientRect(); let cx, cy, R;
    if (br.width){ const r=M(br); R=r.w/2*1.25; cx=Math.min(r.x+r.w/2,RW-R-14); cy=Math.min(r.y+r.h/2,RH-BAND-R-10); CAM.bub=[cx,cy,R]; }
    else if (CAM.bub) [cx,cy,R]=CAM.bub; else { R=110; cx=RW-R-30; cy=RH-BAND-R-30; }
    c.save(); c.beginPath(); c.arc(cx,cy,R,0,Math.PI*2); c.closePath(); c.clip();
    c.translate(cx,cy); c.scale(-1,1); const side=Math.min(v.videoWidth,v.videoHeight);
    c.drawImage(v,(v.videoWidth-side)/2,(v.videoHeight-side)/2,side,side,-R,-R,R*2,R*2); c.restore();
    c.beginPath(); c.arc(cx,cy,R,0,Math.PI*2); c.lineWidth=18; c.strokeStyle='rgba(34,229,255,.3)'; c.stroke(); c.lineWidth=8; c.strokeStyle='#22e5ff'; c.stroke();
  }
}

/* ---- ролик на экране результата ---- */
const recExt = ()=> CAM.blob && /mp4/.test(CAM.blob.type) ? 'mp4' : 'webm';
const recName = ()=> `big-bowwow-${new Date().toISOString().slice(0,19).replace(/[T:]/g,'-')}.${recExt()}`;
function renderRec(){
  const box=$('recBox'); if(!box) return;
  if (CAM.url){
    let canFile=false; try{ canFile=!!(navigator.share && navigator.canShare && navigator.canShare({files:[new File([CAM.blob],'v.'+recExt(),{type:CAM.blob.type})]})); }catch(e){}
    box.innerHTML=`<div class="recBox"><video src="${CAM.url}" controls playsinline preload="metadata"></video>
      <div class="acts"><b>🎬 Твой ролик готов</b>
        ${canFile?'<button class="recB" onclick="recShare()">📤 Поделиться роликом</button>':''}
        <button class="recB ghost" onclick="recSave()">💾 Сохранить</button>
        <small id="recHint"></small></div></div>`;
  } else if (CAM.final){
    box.innerHTML='<div class="recBox wait"><b>🎬 Монтирую ролик…</b></div>';
  } else box.innerHTML='';
}
function recHint(){
  const h=$('recHint'); if(!h) return;
  h.textContent='Не сохранилось? В Telegram так бывает: открой ролик на весь экран и удержи палец на видео — или сделай запись экрана телефона.';
  h.style.color='var(--gold)';
}
async function recShare(){
  if (!CAM.blob) return;
  const file=new File([CAM.blob],recName(),{type:CAM.blob.type});
  try{ await navigator.share({files:[file], text:`Отпугиваю соперников в «Биг Бау Вау» от Music Core 🤘 ${SHARE_LINK()}`}); }
  catch(e){
    if (e && e.name==='AbortError') return;
    try{ await navigator.share({files:[file]}); }catch(e2){ if(!e2 || e2.name!=='AbortError') recHint(); }
  }
}
function recSave(){
  if (!CAM.url) return;
  const a=document.createElement('a'); a.href=CAM.url; a.download=recName(); a.rel='noopener';
  document.body.appendChild(a); a.click(); a.remove();
  if (TG) setTimeout(recHint, 600);   // WebView Telegram часто молча игнорирует скачивание
}

/* ================= ВВОД ================= */
$('arena').addEventListener('pointerdown',()=>onTap());
$('goat').addEventListener('pointerdown',e=>{ e.stopPropagation(); goat(); });
$('camBtn').addEventListener('pointerdown',e=>{ e.stopPropagation(); toggleCam(); });
document.addEventListener('keydown',e=>{ if(e.code==='Space'){ e.preventDefault(); onTap(); } if(e.code==='Enter') goat(); if(e.code==='Escape') (B&&B.paused?resume():pause()); });
document.addEventListener('pointerdown',()=>{ const first=!AC; audio(); if(first && $('menu').classList.contains('on')) startLoop(100,.45); },{capture:true});

go('menu');
