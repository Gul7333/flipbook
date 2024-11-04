const mod = (n, m) => ((n % m) + m) % m; // Fix negative Modulo

const elBook = document.querySelector(".book");
const elsPages = elBook.querySelectorAll(".page");
const tot = elsPages.length;

console.log(tot);
let c = 0; // Current page index

const openPage = (index) => {
  c = mod(index, tot + 1);
  if(c === tot){
    playSound("./sounds/end-flip.mp3")

  }else{
    playSound("./sounds/start-flip.mp3")
  }

  elBook.style.setProperty("--c", c);
};

elsPages.forEach((page, i) => {
  page.style.setProperty("--i", i);
  page.addEventListener("click", (evt) => {
    c = !!evt.target.closest(".back") ? i : i + 1;
    openPage(c);
  });
});

function playSound(audioSrc) {
    const audio = new Audio(audioSrc);
    audio.play();
  }
addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowLeft" || evt.key === "ArrowRight") {
    evt.preventDefault();
    c += evt.key === "ArrowRight" ? +1 : -1;
    openPage(c);

  }
});

openPage(c);
console.log(!!true)