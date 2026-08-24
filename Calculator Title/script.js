export function titleGenerator(category,name,description){
    let title = document.createElement("section");
    title.classList.add("page-hero");
    title.innerHTML=`
    <div class="hero-inner">
        <p class="eyebrow">${category}</p>
        <h1>${name}</h1>
        <p>${description}</p>
    </div>
    `;
    return title;
}