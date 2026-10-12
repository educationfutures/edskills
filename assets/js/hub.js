/* Progressive enhancement: the full collection and page content work without JS. */
(() => {
  const toggle = document.querySelector('.navbar__toggle');
  const drawer = document.querySelector('.navbar_mobile_sidebar');
  if (toggle && drawer) {
    drawer.id = 'hub-mobile-navigation';
    drawer.setAttribute('role','dialog');
    drawer.setAttribute('aria-label','Site navigation');
    toggle.setAttribute('aria-controls',drawer.id);
    const close = document.createElement('button');
    close.type='button';close.className='hub-menu-close';close.textContent='Close menu ×';
    close.addEventListener('click',()=>toggle.click());drawer.prepend(close);
    let wasOpen = false;
    const sync = () => {
      const open = !drawer.classList.contains('is-hidden');
      toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-haspopup','dialog');
      drawer.setAttribute('aria-modal',String(open));drawer.inert=!open;
      if(open && !wasOpen)close.focus();
      if(!open && wasOpen)toggle.focus();
      wasOpen=open;
    };
    new MutationObserver(sync).observe(drawer,{attributes:true,attributeFilter:['class']});sync();
    document.addEventListener('keydown',event=>{
      if(!wasOpen)return;
      if(event.key==='Escape'){event.preventDefault();toggle.click();return;}
      if(event.key==='Tab'){
        const controls=[...drawer.querySelectorAll('a[href],button:not([disabled])')];
        const first=controls[0],last=controls.at(-1);
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
        else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    });
  }
  const cards = [...document.querySelectorAll('.hub-tool-grid [data-group]')];
  const bar = document.querySelector('.hub-filterbar');
  if (cards.length && bar) {
    bar.hidden = false;
    const status = bar.querySelector('.hub-filter-status');
    const update = filter => {
      let count = 0;
      cards.forEach(card => {const visible = filter === 'all' || card.dataset.group === filter;card.hidden = !visible;if(visible)count++;});
      bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.filter === filter)));
      status.textContent = `${count} ${count === 1 ? 'tool' : 'tools'}`;
    };
    bar.addEventListener('click',event => {const b=event.target.closest('button[data-filter]');if(b)update(b.dataset.filter);});
    update('all');
  }
  const entry = document.querySelector('.content__entry');
  if (entry) {
    const headings = [...entry.querySelectorAll('h3')];
    if(headings.length >= 4) {
      const aside=document.createElement('aside');aside.className='hub-contents';aside.setAttribute('aria-label','On this page');
      const details=document.createElement('details');
      const summary=document.createElement('summary');summary.textContent='On this page';details.append(summary);
      const nav=document.createElement('nav');nav.setAttribute('aria-label','Page sections');
      const list=document.createElement('ul');
      headings.forEach((h,i)=>{if(!h.id)h.id=`section-${i+1}`;const li=document.createElement('li');const a=document.createElement('a');a.href=`#${h.id}`;a.textContent=h.textContent;li.append(a);list.append(li);});
      nav.append(list);details.append(nav);aside.append(details);entry.before(aside);
      const media=window.matchMedia('(min-width: 1100px)');const change=()=>{details.open=media.matches;};change();media.addEventListener('change',change);
      const layout=document.createElement('div');layout.className='hub-reading-layout';entry.parentNode.insertBefore(layout,aside);layout.append(aside,entry);
    }
  }
})();
