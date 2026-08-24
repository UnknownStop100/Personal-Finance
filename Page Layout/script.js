export function createPageLayout() {
  const layout = document.createElement('div');
  layout.classList.add('page-layout');
  layout.innerHTML = `
    <div class="top-section-layout">
      <aside class="side-ad ad-box">ADVERTISEMENT</aside>
      <section class="main-content" id="maincontent"></section>
      <aside></aside>
    </div>
    <div class="bottom-section-layout">
      <aside class="side-ad ad-box">ADVERTISEMENT</aside>
      <section class="main-article" id="mainarticle"></section>
      <aside></aside>
    </div>
  `;
  return layout;
  /*const mainContent = layout.querySelector('.main-content');*/
  /*return { layout, mainContent };*/
}

export function createAdBox(className = 'ad-box') {
  const box = document.createElement('div');
  box.className = className;
  box.textContent = 'ADVERTISEMENT';
  return box;
}