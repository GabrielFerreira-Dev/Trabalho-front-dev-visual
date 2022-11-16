var url = 'http://localhost:3000/'

function cadastrar()
{
	//validacao de alguns dos inputs
	
	if(!validaNome('nome-completo'))
	{
		return
	}
	
	if(!validaIdade('idade'))
	{
		return
	}
	
	if(!validaCpf('cpf'))
	{
		return
	}
	
	//construcao do json que vai no body da criacao de usuario	
	
	let body =
	{
		'Nome':        document.getElementById('nome-completo').value,
		'Cpf':         document.getElementById('cpf').value,
		'Endereco':    document.getElementById('endereco').value,
		'Idade':       document.getElementById('idade').value
	};
	
	// envio da requisicao usando a FETCH API
	
	// configuracao e realizacao do POST no endpoint "usuarios"
	fetch(url + "cadastrarC",
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
	.then((response) =>
	{
		if(response.ok)
		{
			return response.text()
		}
		else
		{
			return response.text().then((text) =>
			{
				throw new Error(text)
			})
		}
	})
	//trata resposta
	.then((output) =>
	{
		if(output == "Usuario ja cadastrado"){
			return alert('Nao foi possivel efetuar o cadastro pois esse cpf ja esta sendo utilizado')
		}
		console.log(output)
		alert('Cadastro efetuado!')
	})
	
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível efetuar o cadastro! ')
	})
	
	
}

function validaNome(id)
{
	let divNome = document.getElementById(id)
	if(divNome.value.trim().split(' ').length >= 2)
	{
		divNome.style.border = 0
		return true
	}
	else
	{
		divNome.style.border = 'solid 1px red'
		return false
	}
}

function validaIdade(id)
{
	let divIdade = document.getElementById(id)
	if(divIdade.value >= 10)
	{
		divIdade.style.border = 0
		return true
	}
	else
	{
		divIdade.style.border = 'solid 1px red'
		return false
	}
}

function validaCpf(id)
{
	let divCpf = document.getElementById(id)
	
	let cpf = divCpf.value
	
	let temTamanho  = cpf.length
	
	if(temTamanho == 11)
	{
		divCpf.style.border = 0
		return true
	}
	else
	{
		divCpf.style.border = 'solid 1px red'
		return false
	}
}

function listar()
{
	//da um GET no endpoint "usuarios"
	fetch(url + 'clientes')
	.then(response => response.json())
	.then((clientes) =>
	{
		//pega div que vai conter a lista de usuarios
		let listaClientes = document.getElementById('lista-usuarios')

		//limpa div
		while(listaClientes.firstChild)
		{
			listaClientes.removeChild(listaClientes.firstChild)
		}
		
		//preenche div com usuarios recebidos do GET
		for(let cliente of clientes)
		{
			//cria div para as informacoes de um usuario
			let divCliente = document.createElement('div')
			divCliente.setAttribute('class', 'form')
			
			//pega o nome do usuario
			let divNome = document.createElement('input')
			divNome.placeholder = 'Nome Completo'
			divNome.value = cliente.nome
			divCliente.appendChild(divNome)

			//pega o cpf do usuario
			let divCpf = document.createElement('input')
			divCpf.placeholder = 'CPF'
			divCpf.value = cliente.cpf
			divCliente.appendChild(divCpf)

            let divIdade = document.createElement('input')
			divIdade.placeholder = 'Idade'
			divIdade.value = cliente.idade
			divCliente.appendChild(divIdade)

            let divEndereco = document.createElement('input')
			divEndereco.placeholder = 'Endereco'
			divEndereco.value = cliente.endereco
			divCliente.appendChild(divEndereco)
			
			//cria o botao para remover o usuario
			let btnRemover = document.createElement('button')
			btnRemover.innerHTML = 'Remover'
			btnRemover.onclick = u => remover(cliente.id, cliente.nome, cliente.cpf, cliente.idade, cliente.endereco)
			btnRemover.style.marginRight = '5px'
			
			//cria o botao para atualizar o usuario
			let btnAtualizar = document.createElement('button')
			btnAtualizar.innerHTML = 'Atualizar'
			btnAtualizar.onclick = u => atualizar(cliente.id, divNome, divCpf, divIdade, divEndereco)
			btnAtualizar.style.marginLeft = '5px'
			
			//cria a div com os dois botoes
			let divBotoes = document.createElement('div')
			divBotoes.style.display = 'flex'
			divBotoes.appendChild(btnRemover)
			divBotoes.appendChild(btnAtualizar)
			divCliente.appendChild(divBotoes)
			
			//insere a div do usuario na div com a lista de usuarios
			listaClientes.appendChild(divCliente)
		}
	})
}

function atualizar(id, divNome, divCpf, divIdade, divEndereco)
{
	let body =
	{
		'id': id,
		'Nome': divNome.value,
		'Cpf': divCpf.value,
        'Idade': divIdade.value,
        'Endereco': divEndereco.value
	}
	
	fetch(url + "atualizarC/" + id,
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
	.then((response) =>
	{
		if(response.ok)
		{
			return response.text()
		}
		else
		{
			return response.text().then((text) =>
			{
				throw new Error(text)
			})
		}
	})
	.then((output) =>
	{
		listar()
		console.log(output)
		alert('Cliente atualizado com sucesso!!')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível atualizar os dados do cliente')
	})
}

function remover(id, divNome, divCpf, divIdade, divEndereco)
{
	let body =
	{
		'id': id,
		'Nome': divNome.value,
		'Cpf': divCpf.value,
        'Idade': divIdade.value,
        'Endereco': divEndereco.value
	}
	
	fetch(url + "deletarC/" + id,
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
	.then((response) =>
	{
		if(response.ok)
		{
			return response.text()
			console.log(response)
		}
		else
		{
			return response.text().then((text) =>
			{
				throw new Error(text)
				console.log(response)
			})
		}
	})
	.then((output) =>
	{
		listar()
		console.log(output) 
		alert('Cliente removido com sucesso')
	})
	.catch((error) =>
	{
		console.log(error)
		alert('Não foi possível remover este cliente')
	})
}
