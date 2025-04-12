// Armazenamento de dados
let books = JSON.parse(localStorage.getItem('biblioteca_livros')) || [
    {
        id: 1,
        title: "Dom Quixote",
        author: "Miguel de Cervantes",
        cover: "https://m.media-amazon.com/images/I/91VokXkn8hL._SY425_.jpg",
        price: 29.90,
        isAvailable: true,
        rating: 4,
        description: "Clássico da literatura espanhola sobre um cavaleiro sonhador."
    },
    {
        id: 2,
        title: "1984",
        author: "George Orwell",
        cover: "https://m.media-amazon.com/images/I/71kxa1-0mfL._SY425_.jpg",
        price: 34.90,
        isAvailable: true,
        rating: 5,
        description: "Distopia sobre vigilância e controle totalitário."
    }
];

let cart = JSON.parse(localStorage.getItem('biblioteca_carrinho')) || [];

// Funções de persistência
function saveBooks() {
    localStorage.setItem('biblioteca_livros', JSON.stringify(books));
}

function saveCart() {
    localStorage.setItem('biblioteca_carrinho', JSON.stringify(cart));
}

// Função para renderizar livros
function renderBooks() {
    const booksContainer = document.getElementById("booksContainer");
    booksContainer.innerHTML = "";

    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4 class="text-muted">Nenhum livro cadastrado ainda</h4>
                <button class="btn btn-link" onclick="document.getElementById('showFormLink').click()">
                    Cadastre seu primeiro livro
                </button>
            </div>
        `;
        return;
    }

    books.forEach(book => {
        const bookCard = `
            <div class="col mb-5" data-book-id="${book.id}">
                <div class="card h-100">
                    ${!book.isAvailable ? '<div class="badge bg-danger text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Indisponível</div>' : ''}
                    <img class="card-img-top" src="${book.cover || 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'}" alt="${book.title}" loading="lazy">
                    <div class="card-body p-4">
                        <div class="text-center">
                            <h5 class="fw-bolder">${book.title}</h5>
                            <p class="text-muted">${book.author}</p>
                          <p class="text-muted small">${book.category}</p>
                            <div class="d-flex justify-content-center small text-warning mb-2">
                                ${'<div class="bi-star-fill"></div>'.repeat(book.rating)}
                                ${'<div class="bi-star"></div>'.repeat(5 - book.rating)}
                            </div>
                            <span class="fw-bold">R$ ${book.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">
                            <button class="btn btn-outline-dark mt-auto" onclick="addToCart(${book.id})" ${!book.isAvailable ? 'disabled' : ''}>
                                ${book.isAvailable ? 'Reservar' : 'Esgotado'}
                            </button>
                            <button class="btn btn-sm btn-outline-secondary mt-2" onclick="showBookDetails(${book.id})">
                                Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        booksContainer.innerHTML += bookCard;
    });
}

// Funções do carrinho
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book && book.isAvailable) {
        cart.push(book);
        saveCart();
        updateCartCounter();
        showToast(`"${book.title}" adicionado às reservas`);
    } else {
        showToast("Este livro não está disponível", "danger");
    }
}

function updateCartCounter() {
    document.getElementById("cartCounter").textContent = cart.length;
}

// Função de cadastro de livros
function registerBook(event) {
    event.preventDefault();

    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        cover: document.getElementById("cover").value || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg",
        price: parseFloat(document.getElementById("price").value),
        description: document.getElementById("description").value,
        category: document.getElementById("category").value, // Novo campo
        isAvailable: document.getElementById("isAvailable").checked,
        rating: 0
    };

    books.push(newBook);
    saveBooks();
    
    document.getElementById("bookForm").reset();
    document.getElementById("bookFormContainer").classList.add("d-none");
    
    renderBooks();
    showToast(`"${newBook.title}" cadastrado com sucesso!`, "success");
}

// Função para mostrar detalhes do livro
function showBookDetails(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">${book.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <img src="${book.cover || 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'}" class="img-fluid rounded" alt="${book.title}">
                </div>
                <div class="col-md-8">
                    <p><strong>Autor:</strong> ${book.author}</p>
                    <p><strong>Preço:</strong> R$ ${book.price.toFixed(2)}</p>
                    <p><strong>Disponibilidade:</strong> ${book.isAvailable ? 'Disponível' : 'Indisponível'}</p>
                    <div class="mb-3">
                        <strong>Avaliação:</strong>
                        <div class="d-flex text-warning">
                            ${'<i class="bi bi-star-fill"></i>'.repeat(book.rating)}
                            ${'<i class="bi bi-star"></i>'.repeat(5 - book.rating)}
                        </div>
                    </div>
                    <p><strong>Descrição:</strong><br>${book.description || 'Nenhuma descrição disponível.'}</p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-primary" onclick="addToCart(${book.id})" ${!book.isAvailable ? 'disabled' : ''}>
                ${book.isAvailable ? 'Reservar Livro' : 'Indisponível'}
            </button>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('bookModal'));
    document.getElementById('bookModal').querySelector('.modal-content').innerHTML = modalContent;
    modal.show();
}

// Função para mostrar notificações (toast)
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    
    const toastElement = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastElement);
    const toast = new bootstrap.Toast(document.getElementById(toastId));
    toast.show();
    
    // Remove o toast após alguns segundos
    setTimeout(() => {
        document.getElementById(toastId).remove();
    }, 5000);
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    // Renderiza os livros e atualiza o carrinho
    renderBooks();
    updateCartCounter();

    // Configura o formulário de cadastro
    document.getElementById("showFormLink").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("bookFormContainer").classList.remove("d-none");
        window.scrollTo({ top: document.getElementById("bookFormContainer").offsetTop, behavior: "smooth" });
    });

    document.getElementById("cancelForm").addEventListener("click", () => {
        document.getElementById("bookFormContainer").classList.add("d-none");
    });

    document.getElementById("bookForm").addEventListener("submit", registerBook);

    // Adiciona o container de toasts dinamicamente se não existir
    if (!document.getElementById('toastContainer')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        document.body.appendChild(toastContainer);
    }
});