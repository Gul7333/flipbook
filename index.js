const mod = (n, m) => ((n % m) + m) % m; // Fix negative Modulo
const elBook = document.querySelector(".book");

const pdfUrl = "Deen-e-Ilahi-UR (1).pdf";


// // Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

let pdfDoc = null,
  // pageNumber = getPage(),
  scale = 1;

function getPage() {
  const ccc = elBook?.getAttribute("--c");
  console.log(ccc, "ccccc");
  return ccc;
}
let tot;
// Load the PDF document
pdfjsLib.getDocument(pdfUrl).promise.then((pdfDoc_) => {
  pdfDoc = pdfDoc_;
  // elBook?.textContent = ""
  tot = pdfDoc.numPages

  // document.getElementById('page-count').textContent = pdfDoc.numPages;
  // Method 1: Using a loop with innerHTML
  let repeatedContent = "";
  for (let i = 0; i < tot / 2; i++) {
    repeatedContent += `
      <div class="page">
        <div id="pdf-container" class="front">
          <canvas class="pdf-render"></canvas>
        </div>
        <div id="pdf-container" class="back">
          <canvas class="pdf-render"></canvas>
        </div>
      </div>
     `;
  }
  elBook.innerHTML = repeatedContent;
  for (let i = 0; i < tot; i++) {
    renderPage(i + 1);
  }

  main()
});


function main(){
  const elsPages = elBook.querySelectorAll(".page");

  
const tot = elsPages.length;

let c = 0; // Current page index

const openPage = (index) => {
  c = mod(index, tot + 1);
  if (c === tot || c === 0) {
    playSound("./sounds/end-flip.mp3");
  } else {
    playSound("./sounds/start-flip.mp3");
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
    // renderPage(c + 1);
  }
});

openPage(c);
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

function renderPage(num) {
  pdfDoc
    .getPage(num)
    .then((page) => {
      // const pageRect = elsPages(elBook)[0].getBoundingClientRect();
      let canvas = document.getElementsByClassName("pdf-render").item(num - 1);
      let ctx = canvas.getContext("2d");

      // Calculate the viewport scale based on both width and height
      const viewport = page.getViewport({ scale: 1 });
      // Set canvas dimensions to match the scaled viewport
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,

        viewport: viewport,
      };

      // Render the page to the canvas
      page.render(renderContext).promise.then(() => {
        console.log(`Rendered page ${num}`);
      });
    })
    .catch((error) => {
      console.error("Error rendering page:", error);
    });
}



