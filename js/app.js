const SUPABASE_URL='https://vzsmqzovlgasnoynpjbr.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ2enNtcXpvbGdhc25veW5wamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1Njg2MzgsImV4cCI6MjEwNTE0NDYzOH0.Xk6vQppLeH52QQLeFEvhtx9C4ngpVmj4e77c6y3qpX4'.replace(/\s/g,'');
const supabaseClient=window.supabase?.createClient ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
let allProducts=[],cart=[];
const fallback=[
 {name:'Traditional Indian Pickle',category:'pickles',price:12,image_url:'https://vzsmqzovlgasnoynpjbr.supabase.co/storage/v1/object/public/products/1789585667.png'},
 {name:'Premium Turmeric',category:'spices',price:9,image_url:'https://vzsmqzovlgasnoynpjbr.supabase.co/storage/v1/object/public/products/1789585656.png'},
 {name:'Indian Pantry Essentials',category:'groceries',price:15,image_url:'https://vzsmqzovlgasnoynpjbr.supabase.co/storage/v1/object/public/products/1789585651.png'}
];
async function load(){
  if(!supabaseClient){allProducts=fallback;render(allProducts);return;}
  try{
    const {data,error}=await supabaseClient.from('products').select('*').eq('is_active',true);
    allProducts=(error||!data||!data.length)?fallback:data;
  }catch(e){allProducts=fallback;}
  render(allProducts);
}
function render(list){document.getElementById('products').innerHTML=list.map((p,i)=>`<article class="product"><span class="sale" style="${p.original_price?'':'display:none'}">SALE</span><button class="quick" onclick="add(${allProducts.indexOf(p)})"><i class="fa-regular fa-heart"></i></button><div class="p-img"><img src="${p.image_url||fallback[i%fallback.length].image_url}" alt="${esc(p.name)}"></div><div class="p-body"><div class="p-cat">${esc(p.category||'Indian favourites')}</div><div class="p-title">${esc(p.name)}</div><div class="rating">★★★★★ <span>4.8</span></div><div class="price"><div><strong>$${Number(p.price).toFixed(2)}</strong>${p.original_price?`<span class="old">$${Number(p.original_price).toFixed(2)}</span>`:''}</div><button class="add magnetic" onclick="add(${allProducts.indexOf(p)})">Add</button></div></div></article>`).join('')}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function add(i){const p=allProducts[i];if(!p)return;cart.push(p);updateCart();openCart()}
function updateCart(){document.getElementById('count').textContent=cart.length;const box=document.getElementById('cartItems');if(!cart.length){box.innerHTML='<p style="color:#776a61;padding-top:20px">Your bag is empty.</p>';document.getElementById('total').textContent='$0.00';return}box.innerHTML=cart.map(p=>`<div class="cart-item"><img src="${p.image_url||fallback[0].image_url}"><div><b>${esc(p.name)}</b><small>$${Number(p.price).toFixed(2)}</small></div></div>`).join('');document.getElementById('total').textContent='$'+cart.reduce((a,p)=>a+Number(p.price||0),0).toFixed(2)}
function openCart(){document.getElementById('drawer').classList.add('open')}
function closeCart(){document.getElementById('drawer').classList.remove('open')}
function filterProducts(cat,el){document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));el.classList.add('active');render(cat==='all'?allProducts:allProducts.filter(p=>String(p.category||'').toLowerCase().includes(cat)))}
function searchProducts(){const q=document.getElementById('search').value.toLowerCase().trim();render(q?allProducts.filter(p=>(p.name+' '+p.category).toLowerCase().includes(q)):allProducts);document.getElementById('shop').scrollIntoView({behavior:'smooth'})}
document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter')searchProducts()});
load().catch(()=>{allProducts=fallback;render(allProducts)});

(() => {
  'use strict';
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const lerp=(a,b,t)=>a+(b-a)*t;

  /* Hero entrance */
  const heroCopy=document.querySelector('.hero-copy');
  const heroProduct=document.querySelector('.hero-product');
  const rings=[...document.querySelectorAll('.hero-visual .ring')];
  const ingredients=[...document.querySelectorAll('.ingredient')];
  const heroSides=[...document.querySelectorAll('.hero-side')];

  [heroCopy,heroProduct,...rings,...ingredients,...heroSides].forEach((el,i)=>{
    if(!el)return;
    el.style.opacity='0';
    el.style.transform='translate3d(0,24px,0)';
    el.style.transition=`opacity .8s cubic-bezier(.2,.8,.2,1) ${Math.min(i*45,450)}ms, transform .9s cubic-bezier(.2,.8,.2,1) ${Math.min(i*45,450)}ms`;
  });

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    [heroCopy,heroProduct,...rings,...ingredients,...heroSides].forEach(el=>{
      if(!el)return;
      el.style.opacity='1';
      el.style.transform='translate3d(0,0,0)';
    });
  }));

  /* Scroll reveals */
  const revealItems=document.querySelectorAll('.reveal,.reveal-card,.reveal-image');
  revealItems.forEach(el=>el.classList.add('nri-reveal-ready'));

  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('nri-revealed');
      revealObserver.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});

  revealItems.forEach(el=>revealObserver.observe(el));

  /* Diagonal pickle journey — vertical scroll drives alternating diagonal card motion. */
  const journey=document.querySelector('.journey');
  const pin=document.querySelector('.journey-pin');
  const track=document.querySelector('.journey-track');
  const journeyCards=[...document.querySelectorAll('.journey .flavour-card')];

  function measureJourney(){
    if(!journey)return;
    journey.style.minHeight='';
    if(pin){pin.style.position='';pin.style.top='';}
    if(track)track.style.transform='';
  }

  let targetScroll=scrollY;
  let currentScroll=scrollY;
  let ticking=false;

  function requestMotion(){
    targetScroll=scrollY;
    if(!ticking){ticking=true;requestAnimationFrame(updateMotion);}
  }

  function updateMotion(){
    currentScroll=lerp(currentScroll,targetScroll,.14);
    const hero=document.querySelector('.hero');
    const progress=document.querySelector('.hero-progress span');
    if(hero){
      const rect=hero.getBoundingClientRect();
      const p=clamp(-rect.top/Math.max(1,rect.height),0,1);
      if(heroProduct) heroProduct.style.transform=`translate3d(0,${p*-170}px,0) scale(${1+p*.13}) rotate(${p*-4.5}deg)`;
      if(heroCopy){heroCopy.style.transform=`translate3d(0,${p*-90}px,0)`;heroCopy.style.opacity=String(1-p*.42);}
      rings.forEach((ring,i)=>{const rotation=i===1?p*78:-p*48;const scale=i===1?1+p*.16:1-p*.08;ring.style.transform=`rotate(${rotation}deg) scale(${scale})`;});
      ingredients.forEach((el,i)=>{const moves=[[30,-30],[-25,20],[-15,-18]][i]||[0,0];el.style.transform=`translate3d(${p*moves[0]}px,${p*moves[1]}px,0)`;});
      heroSides.forEach((el,i)=>{const dir=i===0?-1:1;const base=i===0?'rotate(-8deg)':'rotate(8deg)';el.style.transform=`${base} translate3d(${dir*p*78}px,${-p*82}px,0) scale(${1+p*.035})`;});
      if(progress)progress.style.transform=`scaleX(${1+p*6})`;
    }

    if(journey && innerWidth>700){
      const r=journey.getBoundingClientRect();
      const raw=clamp((innerHeight-r.top)/(innerHeight+r.height*.72),0,1);
      journeyCards.forEach((card,i)=>{
        const local=clamp(raw*1.55-i*.105,0,1);
        const dir=i%2===0?-1:1;
        const x=dir*(1-local)*115;
        const y=(1-local)*(90+i*8);
        const rot=dir*(1-local)*5.5;
        card.style.transform=`translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${.90+local*.10})`;
        card.style.opacity=String(.18+local*.82);
      });
      journey.style.setProperty('--journey-progress',String(Math.max(.12,raw)));
    } else {
      journeyCards.forEach(card=>{card.style.transform='';card.style.opacity='';});
    }

    ticking=false;
    if(Math.abs(currentScroll-targetScroll)>.2){ticking=true;requestAnimationFrame(updateMotion);}
  }

  addEventListener('scroll',requestMotion,{passive:true});

  const scrollExplore=document.getElementById('scrollExplore');
  if(scrollExplore) scrollExplore.addEventListener('click',()=>document.querySelector('.categories')?.scrollIntoView({behavior:'smooth',block:'start'}));

  /* World map depth */
  const worldMap=document.querySelector('.world-map');

  function updateMap(){
    if(!worldMap)return;
    const rect=worldMap.getBoundingClientRect();
    const p=clamp((innerHeight-rect.top)/(innerHeight+rect.height),0,1);
    worldMap.style.setProperty('--map-shift',`${(p-.5)*-18}px`);
  }

  addEventListener('scroll',updateMap,{passive:true});

  /* Restrained magnetic buttons */
  if(innerWidth>900){
    document.querySelectorAll('.magnetic').forEach(btn=>{
      btn.addEventListener('pointermove',e=>{
        const r=btn.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)*.12;
        const y=(e.clientY-r.top-r.height/2)*.12;
        btn.style.transform=`translate3d(${x}px,${y}px,0)`;
      });
      btn.addEventListener('pointerleave',()=>btn.style.transform='');
    });
  }

  /* Product entrance after Supabase renders products */
  const productGrid=document.querySelector('#products');

  function animateProducts(){
    if(!productGrid)return;

    productGrid.querySelectorAll('.product').forEach((card,i)=>{
      if(card.dataset.nriAnimated)return;

      card.dataset.nriAnimated='1';
      card.style.opacity='0';
      card.style.transform='translateY(22px)';

      requestAnimationFrame(()=>{
        setTimeout(()=>{
          card.style.transition='opacity .55s ease,transform .55s cubic-bezier(.2,.8,.2,1)';
          card.style.opacity='1';
          card.style.transform='translateY(0)';
        },Math.min(i*45,280));
      });
    });
  }

  if(productGrid){
    new MutationObserver(animateProducts).observe(productGrid,{childList:true});
    animateProducts();
  }

  function refreshMotion(){

    updateMap();
    requestMotion();
  }

  addEventListener('resize',refreshMotion,{passive:true});
  addEventListener('orientationchange',refreshMotion,{passive:true});
  addEventListener('load',refreshMotion,{once:true});

  if(document.fonts&&document.fonts.ready)
    document.fonts.ready.then(refreshMotion).catch(()=>{});

  document.querySelectorAll('img').forEach(img=>{
    if(!img.complete)img.addEventListener('load',refreshMotion,{once:true});
  });

  refreshMotion();
  setTimeout(refreshMotion,150);
  setTimeout(refreshMotion,700);
  setTimeout(refreshMotion,1400);
})();

(() => {
  const glow=document.querySelector('.cursor-glow'),dot=document.querySelector('.cursor-dot');
  if(!glow || matchMedia('(max-width:650px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let x=innerWidth/2,y=innerHeight/2,gx=x,gy=y;
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;document.documentElement.style.setProperty('--cx',(x/innerWidth*100)+'%');document.documentElement.style.setProperty('--cy',(y/innerHeight*100)+'%');dot.style.left=x+'px';dot.style.top=y+'px'});
  function tick(){gx+=(x-gx)*.055;gy+=(y-gy)*.055;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(tick)} tick();
})();

/* ---- module boundary ---- */

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.crafted-progress');

  const updateProgress = () => {
    if (!progress || reduced) return;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / max))})`;
  };
  addEventListener('scroll', updateProgress, {passive:true});
  addEventListener('resize', updateProgress, {passive:true});
  updateProgress();

  // Very restrained pointer depth on the main hero product only.
  const hero = document.querySelector('.hero');
  const product = document.querySelector('.hero-product');
  if (!reduced && hero && product && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width-.5);
      const y = ((e.clientY-r.top)/r.height-.5);
      product.style.transform =
        `perspective(1000px) translate3d(${x*10}px,${y*7}px,18px) rotateY(${x*3}deg) rotateX(${-y*2}deg)`;
    });
    hero.addEventListener('pointerleave', () => {
      product.style.transform = '';
    });
  }
})();

/* Semantic UI bindings kept separate from markup. */
(() => {
  const newsletter = document.getElementById('newsletterForm');
  newsletter?.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thanks for subscribing!');
    newsletter.reset();
  });

  const drawer = document.getElementById('drawer');
  document.getElementById('closeCartBtn')?.addEventListener('click', () => {
    if (typeof closeCart === 'function') closeCart();
  });
  drawer?.addEventListener('click', (event) => {
    if (event.target === drawer && typeof closeCart === 'function') closeCart();
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    alert('Checkout flow ready to connect.');
  });
})();
