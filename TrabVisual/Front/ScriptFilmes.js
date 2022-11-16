var url = 'http://localhost:3000/'


function cadastrar() {
	if (!validaClassificacao('classificacao')) {
		return
	}

	if(!validaGenero('genero')){
		return
	}

	let body =
	{
		'Nome': document.getElementById('nome-do-filme').value,
		'Genero': document.getElementById('genero').value,
		'Classificacao': document.getElementById('classificacao').value,
		'Preco': document.getElementById('preco').value
	};

	// envio da requisicao usando a FETCH API

	// configuracao e realizacao do POST no endpoint "usuarios"
	fetch(url + "cadastrarF",
		{
			'method': 'POST',
			'redirect': 'follow',
			'headers':
			{
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			'body': JSON.stringify(body)
		})
		//checa se requisicao deu certo
		.then((response) => {
			if (response.ok) {
				return response.text()
			}
			else {
				return response.text().then((text) => {
					throw new Error(text)
				})
			}
		})
		//trata resposta
		.then((output) => {
			if (output == "Filme ja cadastrado") {
				return alert('Nao foi possivel efetuar o cadastro do filme pois esse filme ja foi cadastrado')
			}
			console.log(output)
			alert('Filme adicionado')
		})

		.catch((error) => {
			console.log(error)
			alert('Não foi possível efetuar o cadastro! ')
		})


}
function validaGenero(id){
	let divGenero = document.getElementById(id)
	let genero = divGenero.value

	if (genero == "Ação e aventura" ||genero == "Drama" || genero == "Comédia romântica"|| genero == "Ficção científica"|| genero == "Terror"){
		divGenero.style.border = 0
		return true
	}
	else{
		divGenero.style.border = 'solid 1px red'
		return false
	}
}





function validaClassificacao(id) { 
	let divClassificacao = document.getElementById(id)
	let classificacao = divClassificacao.value
	if (classificacao >= 10 && classificacao <= 18) 
	{ 
		divClassificacao.style.border = 0
		return true
	} 
	else 
	{ 
		divClassificacao.style.border = 'solid 1px red'
		return false 
	}
}


function listar() {
	//da um GET no endpoint "usuarios"
	fetch(url + 'filmes')
		.then(response => response.json())
		.then((filmes) => {
			//pega div que vai conter a lista de usuarios
			let listaFilmes = document.getElementById('lista-filmes')

			//limpa div
			while (listaFilmes.firstChild) {
				listaFilmes.removeChild(listaFilmes.firstChild)
			}

			//preenche div com usuarios recebidos do GET
			for (let filme of filmes) {
				//cria div para as informacoes de um usuario
				let divFilme = document.createElement('div')
				divFilme.setAttribute('class', 'form')

				//pega o nome do filme
				let divNome = document.createElement('input')
				divNome.placeholder = 'Nome do filme'
				divNome.value = filme.nome
				divFilme.appendChild(divNome)

				//pega gênero, classificação e o preco
				let divGenero = document.createElement('input')
				divGenero.placeholder = 'Gênero'
				divGenero.value = filme.genero
				divFilme.appendChild(divGenero)

				let divClassificacao = document.createElement('input')
				divClassificacao.placeholder = 'Classificação'
				divClassificacao.value = filme.classificacao
				divFilme.appendChild(divClassificacao)

				let divPreco = document.createElement('input')
				divPreco.placeholder = 'Preço'
				divPreco.value = filme.preco
				divFilme.appendChild(divPreco)

				//cria o botao para remover o usuario
				let btnRemover = document.createElement('button')
				btnRemover.innerHTML = 'Remover'
				btnRemover.onclick = u => remover(filme.id, divNome, divGenero, divClassificacao, divPreco)
				btnRemover.style.marginRight = '5px'

				//cria o botao para atualizar o usuario
				let btnAtualizar = document.createElement('button')
				btnAtualizar.innerHTML = 'Atualizar'
				btnAtualizar.onclick = u => atualizar(filme.id, divNome, divGenero, divClassificacao, divPreco)
				btnAtualizar.style.marginLeft = '5px'

				//cria a div com os dois botoes
				let divBotoes = document.createElement('div')
				divBotoes.style.display = 'flex'
				divBotoes.appendChild(btnRemover)
				divBotoes.appendChild(btnAtualizar)
				divFilme.appendChild(divBotoes)

				//insere a div do usuario na div com a lista de usuarios
				listaFilmes.appendChild(divFilme)
			}
		})
}

function atualizar(id, divNome, divGenero, divClassificacao, divPreco) {
	let body =
	{
		'id': id,
		'Nome': divNome.value,
		'Genero': divGenero.value,
		'Classificacao': divClassificacao.value,
		'Preco': divPreco.value
	}

	fetch(url + "atualizarF/" + id,
		{
			'method': 'POST',
			'redirect': 'follow',
			'headers':
			{
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			'body': JSON.stringify(body)
		})
		.then((response) => {
			if (response.ok) {
				return response.text()
			}
			else {
				return response.text().then((text) => {
					throw new Error(text)
				})
			}
		})
		.then((output) => {
			listar()
			console.log(output)
			alert('Filme atualizado com sucesso!!')
		})
		.catch((error) => {
			console.log(error)
			alert('Não foi possível atualizar os dados do filme')
		})
}

function remover(id, divNome, divGenero, divClassificacao, divPreco) {
	let body =
	{
		'id': id,
		'Nome': divNome.value,
		'Genero': divGenero.value,
		'Classificacao': divClassificacao.value,
		'Preco': divPreco.value
	}

	fetch(url + "deletarF/" + id,
		{
			'method': 'POST',
			'redirect': 'follow',
			'headers':
			{
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			'body': JSON.stringify(body)
		})
		.then((response) => {
			if (response.ok) {
				return response.text()
				console.log(response)
			}
			else {
				return response.text().then((text) => {
					throw new Error(text)
					console.log(response)
				})
			}
		})
		.then((output) => {
			listar()
			console.log(output)
			alert('Filme removido com sucesso')
		})
		.catch((error) => {
			console.log(error)
			alert('Não foi possível remover este filme')
		})
}
