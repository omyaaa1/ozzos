// Initial Mock Data
const initialMockData = [
  { id: 1, title: "Minimalist Workspace", author: "Studio Oeh", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Abstract Shapes", author: "Design Daily", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Typography Layout", author: "Type Wolf", url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Dark Interior", author: "Arch Digest", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Ceramic Textures", author: "Crafted", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "Neon Nights", author: "Cyber Punk", url: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Swiss Style Poster", author: "Grid Systems", url: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "Natural Light", author: "Sun Chaser", url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 9, title: "Modern Architecture", author: "Build It", url: "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 10, title: "Geometric Pattern", author: "Pattern Co", url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 11, title: "Concrete Jungle", author: "Urbanist", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 12, title: "Film Noir", author: "Cinema Club", url: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

const grid = document.getElementById('masonry-grid');
const modal = document.getElementById('modal-overlay');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author-name');
const modalClose = document.getElementById('modal-close');
const sentinel = document.getElementById('sentinel');

// Upload Elements
const btnCreate = document.getElementById('btn-create-trigger');
const fileInput = document.getElementById('file-upload');

let msnry;
let itemCounter = 12;

// --- Mock Data Generator for Infinite Scroll ---
function generateMoreItems(count) {
  const newItems = [];
  for (let i = 0; i < count; i++) {
    itemCounter++;
    // Reuse images from initial set for demo purposes, randomly
    const randomTemplate = initialMockData[Math.floor(Math.random() * initialMockData.length)];
    newItems.push({
      id: itemCounter,
      title: `${randomTemplate.title} ${itemCounter}`,
      author: randomTemplate.author,
      url: randomTemplate.url
    });
  }
  return newItems;
}

// --- Render Logic ---

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'grid-item';
  card.innerHTML = `
      <img src="${item.url}" alt="${item.title}" loading="lazy">
      <div class="card-overlay">
        <div class="overlay-actions">
          <button class="btn-save-mini" onclick="event.stopPropagation(); alert('Saved!')">Save</button>
          <div style="display:flex; gap:8px;">
            <button class="nav-icon-btn" style="background:rgba(255,255,255,0.2); color:white; width:32px; height:32px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  card.addEventListener('click', () => openModal(item));
  return card;
}

function showSkeletons(count) {
  const skeletons = [];
  for (let i = 0; i < count; i++) {
    const skel = document.createElement('div');
    skel.className = 'grid-item skeleton skeleton-card';
    grid.appendChild(skel);
    skeletons.push(skel);
  }
  if (msnry) msnry.appended(skeletons);
  return skeletons;
}

function removeSkeletons(skeletons) {
  skeletons.forEach(skel => {
    if (msnry) msnry.remove(skel);
    else skel.remove();
  });
  if (msnry) msnry.layout();
}

function appendItems(items) {
  const elems = items.map(createCard);
  const frag = document.createDocumentFragment();
  elems.forEach(el => frag.appendChild(el));
  grid.appendChild(frag);

  // Initialize or append to Masonry
  imagesLoaded(grid, function () {
    if (!msnry) {
      msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        gutter: 20,
        percentPosition: true,
        transitionDuration: '0.2s'
      });
    } else {
      msnry.appended(elems);
      msnry.layout();
    }
  });
}

function prependItem(item) {
  const card = createCard(item);
  grid.insertBefore(card, grid.firstChild);

  imagesLoaded(grid, function () {
    if (!msnry) {
      msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        gutter: 20,
        percentPosition: true,
        transitionDuration: '0.2s'
      });
    } else {
      msnry.prepended(card);
      msnry.layout();
    }
  });
}

// --- Upload & Persistence Logic ---

function loadSavedImages() {
  const saved = localStorage.getItem('ozzos_uploads');
  return saved ? JSON.parse(saved) : [];
}

function saveImageToStorage(item) {
  const current = loadSavedImages();
  current.unshift(item); // Add to beginning
  localStorage.setItem('ozzos_uploads', JSON.stringify(current));

  // Also keep in memory if we need it, but the UI is updated separately
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const imageUrl = event.target.result;

    // Create new item
    const newItem = {
      id: Date.now(),
      title: "My Upload",
      author: "Me",
      url: imageUrl
    };

    // Save and Display
    saveImageToStorage(newItem);
    prependItem(newItem);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  reader.readAsDataURL(file);

  // Reset input so same file can be selected again if needed
  e.target.value = '';
}

// --- Initialization ---

function init() {
  // Initial Load with Skeletons
  const skeletons = showSkeletons(8);

  // Load Saved Images immediately (no delay needed for local)
  const savedImages = loadSavedImages();

  // Simulate network delay for mock data
  setTimeout(() => {
    removeSkeletons(skeletons);

    // Combine saved images + initial mock data
    // Saved images come first
    const allInitialItems = [...savedImages, ...initialMockData];

    appendItems(allInitialItems);

    // Start observing for infinite scroll
    setupObserver();
  }, 1000);
}

// --- Infinite Scroll ---

function setupObserver() {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  }, { rootMargin: '200px' });

  if (sentinel) observer.observe(sentinel);
}

let isLoadingMore = false;
function loadMore() {
  if (isLoadingMore) return;
  isLoadingMore = true;

  setTimeout(() => {
    const newItems = generateMoreItems(8);
    appendItems(newItems);
    isLoadingMore = false;
  }, 500);
}


// --- Modal Logic ---

function openModal(item) {
  modalImage.src = item.url;
  modalTitle.textContent = item.title;
  modalAuthor.textContent = item.author;
  modal.classList.remove('hidden');

  // Force reflow for animation
  void modal.offsetWidth;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 300);
}

// Event Listeners
if (btnCreate) {
  btnCreate.addEventListener('click', () => {
    fileInput.click();
  });
}

if (fileInput) {
  fileInput.addEventListener('change', handleFileUpload);
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// Run
init();