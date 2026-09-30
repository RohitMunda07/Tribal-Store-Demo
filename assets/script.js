const K='jhHeritageCart';

const get=()=>{
  try {
    const data=JSON.parse(localStorage.getItem(K)||'[]');
    return Array.isArray(data)?data:[];
  } catch {
    return [];
  }
};

const save=(cart)=>{
  localStorage.setItem(K, JSON.stringify(cart));
  count();
};

const count=()=>{
  const total=get().reduce((sum,item)=>sum+(Number(item.qty)||0),0);
  document.querySelectorAll('.count').forEach(el=>{el.textContent=total;});
};

const formatINR=(value)=>'₹'+Number(value||0).toLocaleString('en-IN');

document.querySelector('.toggle')?.addEventListener('click',()=>{
  document.querySelector('.links')?.classList.toggle('open');
});

document.querySelectorAll('[data-add]').forEach((button)=>{
  button.onclick=()=>{
    const cart=get();
    const id=button.dataset.add;
    const price=Number(button.dataset.price)||0;
    const existing=cart.find(item=>item.id===id);

    if(existing){
      existing.qty = (Number(existing.qty)||0) + 1;
    } else {
      cart.push({
        id,
        name:button.dataset.name || 'Product',
        price,
        image:button.dataset.image || '',
        qty:1
      });
    }

    save(cart);
    button.textContent='Added ✓';
    setTimeout(()=>{button.textContent='Add to bag';},800);
  };
});

document.querySelectorAll('[data-filter]').forEach((button)=>{
  button.onclick=()=>{
    document.querySelectorAll('[data-filter]').forEach((el)=>el.classList.remove('active'));
    button.classList.add('active');
    const filter=button.dataset.filter;
    document.querySelectorAll('[data-cat]').forEach((card)=>{
      const show=filter==='all'||card.dataset.cat===filter;
      card.classList.toggle('hidden', !show);
    });
  };
});

function chg(id, change) {
  const cart=get();
  const item=cart.find(entry=>entry.id===id);

  if(!item) return;

  item.qty=(Number(item.qty)||0)+change;

  if(item.qty <= 0) {
    const next=cart.filter(entry=>entry.id!==id);
    save(next);
    render();
    return;
  }

  save(cart);
  render();
}

function render(){
  const list=document.querySelector('#cartItems');
  if(!list)return;

  const cart=get();
  const empty=document.querySelector('#empty');
  const summary=document.querySelector('#summary');

  if(!cart.length){
    list.innerHTML='';
    empty.hidden=false;
    summary.hidden=true;
    return;
  }

  empty.hidden=true;
  summary.hidden=false;

  list.innerHTML=cart.map((item)=>{
    const price=Number(item.price)||0;
    const qty=Number(item.qty)||0;
    const total=price*qty;

    return `<div class="item"><img src="${item.image||'assets/logo.jpeg'}"><div><b>${item.name}</b><small>${formatINR(price)}</small><div class="qty"><button data-m="${item.id}">−</button> ${qty} <button data-p="${item.id}">+</button></div><button data-r="${item.id}">Remove</button></div><strong>${formatINR(total)}</strong></div>`;
  }).join('');

  const subtotal=cart.reduce((sum,item)=>sum+((Number(item.price)||0)*(Number(item.qty)||0)),0);
  const shipping=subtotal>0 && subtotal<999 ? 99 : 0;

  const subEl=document.querySelector('#sub');
  const shipEl=document.querySelector('#ship');
  const totalEl=document.querySelector('#tot');

  if(subEl) subEl.textContent=formatINR(subtotal);
  if(shipEl) shipEl.textContent=shipping ? formatINR(shipping) : 'FREE';
  if(totalEl) totalEl.textContent=formatINR(subtotal + shipping);

  list.querySelectorAll('[data-p]').forEach((button)=>{
    button.onclick=()=>chg(button.dataset.p, 1);
  });

  list.querySelectorAll('[data-m]').forEach((button)=>{
    button.onclick=()=>chg(button.dataset.m, -1);
  });

  list.querySelectorAll('[data-r]').forEach((button)=>{
    button.onclick=()=>{
      const next=get().filter(item=>item.id!==button.dataset.r);
      save(next);
      render();
    };
  });
}

document.querySelector('#checkout')?.addEventListener('click',()=>{
  document.querySelector('#notice').hidden=false;
});

document.querySelector('#contactForm')?.addEventListener('submit',(event)=>{
  event.preventDefault();
  document.querySelector('#formNotice').hidden=false;
  event.target.reset();
});

count();
render();