document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();

    const form = document.getElementById('adicionar-filme-form');
    if (form) {
        form.addEventListener('submit', adicionarFilme);
    }
});

async function carregarFilmes() {
    try {
        const response = await fetch('http://localhost:5000/api/filmes');
        if (!response.ok) {
            throw new Error(`Erro ao carregar filmes: ${response.statusText}`);
        }
        const filmes = await response.json();
        const lista = document.getElementById('filme-lista');
        lista.innerHTML = '';
        filmes.forEach(filme => {
            const filmeDiv = document.createElement('div');
            filmeDiv.classList.add('filme');
            filmeDiv.innerHTML = `
                <h2>${filme.titulo} (${filme.ano})</h2>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p>${filme.descricao}</p>
                ${filme.imagem ? `<img src="http://localhost:5000/static/uploads/${filme.imagem}" alt="${filme.titulo}">` : ''}
            `;
            lista.appendChild(filmeDiv);
        });
    } catch (error) {
        console.error(error);
    }
}

async function adicionarFilme(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Checa se a imagem está presente
    const imagemFile = formData.get('imagem');
    let imagemName = null;
    if (imagemFile && imagemFile.size > 0) {
        imagemName = imagemFile.name;
    }

    // Monta o objeto de dados
    const data = {
        titulo: formData.get('titulo'),
        ano: formData.get('ano'),
        genero: formData.get('genero'),
        descricao: formData.get('descricao'),
        imagem: imagemName
    };

    // Condicional para enviar FormData ou JSON
    let response;
    if (imagemName) {
        // Se houver uma imagem, usa FormData
        response = await fetch('/api/filmes', {
            method: 'POST',
            body: formData
        });
    } else {
        // Se não houver imagem, envia como JSON
        response = await fetch('/api/filmes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
        carregarFilmes();
        form.reset();
    }
}
