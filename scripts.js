// Arquivo json para cadastro de livros
const BASE_URL =
  'https://be11f58a-fdf1-4bfc-8cb4-feed1c1495af-00-9fh59pkh1764.picard.replit.dev'

let books = JSON.parse(localStorage.getItem('biblioteca_livros')) || [
  {
    id: 1,
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    cover: "https://m.media-amazon.com/images/I/81hCVEC0ExL._SL1500_.jpg",
    isAvailable: true,
    description: "Uma jornada épica para destruir o Um Anel e derrotar Sauron.",
    price: 79.90
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    isAvailable: true,
    description: "Uma distopia sobre vigilância total e perda da liberdade.",
    price: 39.90
  },
  {
    id: 3,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    cover: "https://m.media-amazon.com/images/I/61Z2bMhGicL._SL1360_.jpg",
    isAvailable: false,
    description: "Bentinho narra suas memórias e suas dúvidas sobre Capitu.",
    price: 29.90
  },
  {
    id: 4,
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    cover: "https://m.media-amazon.com/images/I/71IiouhdpAL._SL1500_.jpg",
    isAvailable: true,
    description: "Uma história sensível sobre amizade e descobertas.",
    price: 24.90
  },
  {
    id: 5,
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    cover: "https://covers.openlibrary.org/b/id/7984916-L.jpg",
    isAvailable: true,
    description: "O início das aventuras do jovem bruxo Harry Potter.",
    price: 59.90
  },
  {
    id: 6,
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    cover: "https://m.media-amazon.com/images/I/91BsZhxCRjL._SL1500_.jpg",
    isAvailable: false,
    description: "Animais tomam uma fazenda para instaurar sua própria ordem.",
    price: 34.90
  },
  {
    id: 7,
    title: "A Menina que Roubava Livros",
    author: "Markus Zusak",
    cover: "https://m.media-amazon.com/images/I/61L+4OBhm-L._SL1000_.jpg",
    isAvailable: true,
    description: "A vida de uma garota alemã durante a Segunda Guerra Mundial.",
    price: 42.50
  },
  {
    id: 8,
    title: "O Código Da Vinci",
    author: "Dan Brown",
    cover: "https://m.media-amazon.com/images/I/710DjekSUkL._SL1500_.jpg",
    isAvailable: true,
    description: "Um thriller envolvendo segredos religiosos e simbologia.",
    price: 49.90
  }
]

  

let users = JSON.parse(localStorage.getItem('biblioteca_usuarios')) || [
  {
    id: 1,
    username: 'admin',
    password: 'admin'
  }
]

function createUser(event) {
  event.preventDefault()
  const username = document.getElementById('usernameSignUp').value
  const password = document.getElementById('passwordSignUp').value

  const newUser = {
    // id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    nome: username,
    email: password
  }

  fetch(BASE_URL + '/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Usuário criado com sucesso:', data)
      users.push(newUser)
      localStorage.setItem('biblioteca_usuario_logado', JSON.stringify(newUser))
      localStorage.setItem('biblioteca_usuarios', JSON.stringify(users))
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    })
    .catch(error => {
      console.error('Erro ao criar o usuário:', error)
    })
}

function authenticateUser(event) {
  event.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  const user = users.find(u => u.nome === username && u.email === password)
  if (user) {
    localStorage.setItem('biblioteca_usuario_logado', JSON.stringify(user))
    showToast(`Login efetuado com sucesso!`, 'success')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    return
  }

  showToast('Usuário ou senha inválidos.', 'danger')
}

function logoutUser() {
  localStorage.removeItem('biblioteca_usuario_logado')
  window.location.reload()
}

document.addEventListener('DOMContentLoaded', function () {
  loginButtons = document.getElementById('loginButtons')
  const loggedUser = JSON.parse(
    localStorage.getItem('biblioteca_usuario_logado')
  )
  if (loggedUser) {
    loginButtons.innerHTML = `
            <button class="btn primary">${loggedUser.nome.toUpperCase()}</button>
            <button class="btn btn-outline-danger" onclick="logoutUser()">Sair</button>
            `
  }

  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'))
  const registerModal = new bootstrap.Modal(
    document.getElementById('registerModal')
  )

  // Quando clicar em "Registre-se agora"
  document
    .getElementById('showRegister')
    .addEventListener('click', function (e) {
      e.preventDefault()
      loginModal.hide()
      setTimeout(() => {
        registerModal.show()
      }, 300) // Dá um pequeno delay pra evitar conflito de transições
    })

  // Quando clicar em "Faça login"
  document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault()
    registerModal.hide()
    setTimeout(() => {
      loginModal.show()
    }, 300)
  })
})

let cart = JSON.parse(localStorage.getItem('biblioteca_carrinho')) || []

// Funções de persistência
function saveBooks() {
  localStorage.setItem('biblioteca_livros', JSON.stringify(books))
}

function saveCart() {
  localStorage.setItem('biblioteca_carrinho', JSON.stringify(cart))
}

// Função para renderizar livros na tela inicial
function renderBooks() {
  const booksContainer = document.getElementById('booksContainer')
  booksContainer.innerHTML = ''

  if (books.length === 0) {
    booksContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4 class="text-muted">Nenhum livro cadastrado ainda</h4>
                <button class="btn btn-link" onclick="document.getElementById('showFormLink').click()">
                    Cadastre seu primeiro livro
                </button>
            </div>
        `
    return
  }

  books.forEach(book => {
    const bookCard = `
            <div class="col mb-5" data-book-id="${book.id}">
                <div class="card h-100">
                    ${
                      !book.isAvailable
                        ? '<div class="badge bg-danger text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Indisponível</div>'
                        : ''
                    }
                    <img class="card-img-top" src="${
                      book.cover ||
                      'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'
                    }" alt="${book.title}" loading="lazy">
                    <div class="card-body p-4">
                        <div class="text-center">
                            <h5 class="fw-bolder">${book.title}</h5>
                            <p class="text-muted">${book.author}</p>
                          <p class="text-muted small">${book.category}</p>
                            <span class="fw-bold">R$ ${book.price.toFixed(
                              2
                            )}</span>
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">
                            <button class="btn btn-outline-dark mt-auto"
        onclick="abrirModalReserva('${book.title}', '${book.cover}')"
        ${!book.isAvailable ? 'disabled' : ''}>
  ${book.isAvailable ? 'Reservar' : 'Esgotado'}
</button>

                            <button class="btn btn-outline-dark mt-auto" onclick="showBookDetails(${
                              book.id
                            })">
                                Detalhes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    booksContainer.innerHTML += bookCard
  })
}

// Funções do carrinho
function addToCart(bookId) {
  const book = books.find(b => b.id === bookId)
  if (book && book.isAvailable) {
    cart.push(book)
    saveCart()
    updateCartCounter()
    showToast(`"${book.title}" adicionado às reservas`)
  } else {
    showToast('Este livro não está disponível', 'danger')
  }
}

function updateCartCounter() {
  document.getElementById('cartCounter').textContent = cart.length
}

// Função de cadastro de livros
function registerBook(event) {
  event.preventDefault()
  const newBook = {
    id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    cover:
      document.getElementById('cover').value ||
      'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value,
    category: document.getElementById('category').value, // Novo campo
    isAvailable: document.getElementById('isAvailable').checked
  }

  books.push(newBook)
  saveBooks()

  document.getElementById('bookForm').reset()
  document.getElementById('bookFormContainer').classList.add('d-none')

  renderBooks()
  showToast(`"${newBook.title}" cadastrado com sucesso!`, 'success')
}

// Função para mostrar detalhes do livro
function showBookDetails(bookId) {
  const book = books.find(b => b.id === bookId)
  if (!book) return

  const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">${book.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <img src="${
                      book.cover ||
                      'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'
                    }" class="img-fluid rounded" alt="${book.title}">
                </div>
                <div class="col-md-8">
                    <p><strong>Autor:</strong> ${book.author}</p>
                    <p><strong>Categoria:</strong> ${book.category}</p>
                    <p><strong>Preço:</strong> R$ ${book.price.toFixed(2)}</p>
                    <p><strong>Descrição:</strong> ${
                      book.description || 'Sem descrição.'
                    }</p>
                    <p><strong>Status:</strong> ${
                      book.isAvailable ? 'Disponível' : 'Indisponível'
                    }</p>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline-danger me-auto" onclick="deleteBook(${
              book.id
            })">Excluir</button>
            <button class="btn btn-dark" onclick="editBook(${
              book.id
            })">Editar</button>
            <button class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        </div>
    `
  document.querySelector('#bookModal .modal-content').innerHTML = modalContent
  const modal = new bootstrap.Modal(document.getElementById('bookModal'))
  modal.show()
}

// Função para mostrar notificações (toast)
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer')
  const toastId = 'toast-' + Date.now()

  const toastElement = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" tabindex="999">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `

  toastContainer.insertAdjacentHTML('beforeend', toastElement)
  const toast = new bootstrap.Toast(document.getElementById(toastId))
  toast.show()

  // Remove o toast após alguns segundos
  setTimeout(() => {
    document.getElementById(toastId).remove()
  }, 5000)
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('biblioteca_livros') || JSON.parse(localStorage.getItem('biblioteca_livros')).length === 0) {
    localStorage.setItem('biblioteca_livros', JSON.stringify(books))
  }
  // Renderiza os livros e atualiza o carrinho
  renderBooks()
  updateCartCounter()

  // Configura o formulário de cadastro
  document.getElementById('showFormLink').addEventListener('click', e => {
    e.preventDefault()
    document.getElementById('bookFormContainer').classList.remove('d-none')
    window.scrollTo({
      top: document.getElementById('bookFormContainer').offsetTop,
      behavior: 'smooth'
    })
  })

  document.getElementById('cancelForm').addEventListener('click', () => {
    document.getElementById('bookFormContainer').classList.add('d-none')
  })

  document.getElementById('bookForm').addEventListener('submit', registerBook)
  document
    .getElementById('formSignIn')
    .addEventListener('submit', authenticateUser)
  document.getElementById('formSignUp').addEventListener('submit', createUser)

  // Adiciona o container de toasts dinamicamente se não existir
  if (!document.getElementById('toastContainer')) {
    const toastContainer = document.createElement('div')
    toastContainer.id = 'toastContainer'
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3'
    toastContainer.style.zIndex = '11'
    document.body.appendChild(toastContainer)
  }
})

function deleteBook(bookId) {
  const book = books.find(b => b.id === bookId)
  if (!book) return

  if (confirm(`Tem certeza que deseja excluir o livro "${book.title}"?`)) {
    books = books.filter(b => b.id !== bookId)
    saveBooks()
    renderBooks()
    bootstrap.Modal.getInstance(document.getElementById('bookModal')).hide()
    showToast(`"${book.title}" foi excluído com sucesso.`, 'danger')
  }
}

function editBook(bookId) {
  const book = books.find(b => b.id === bookId)
  if (!book) return

  // Preenche o formulário com os dados do livro
  document.getElementById('title').value = book.title
  document.getElementById('author').value = book.author
  document.getElementById('cover').value = book.cover
  document.getElementById('price').value = book.price
  document.getElementById('description').value = book.description
  document.getElementById('category').value = book.category
  document.getElementById('isAvailable').checked = book.isAvailable

  // Remove o livro atual da lista temporariamente
  books = books.filter(b => b.id !== bookId)
  saveBooks()

  // Abre o formulário para edição
  document.getElementById('bookFormContainer').classList.remove('d-none')
  bootstrap.Modal.getInstance(document.getElementById('bookModal')).hide()
  showToast(
    `Edite os dados de "${book.title}" e clique em "Cadastrar Livro" para salvar.`,
    'info'
  )
}

// Inicializar contador ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarContadorReservas)


