const express = require('express');     // importando a biblioteca express
const { v4: uuidv4 } = require('uuid');   // importando o método v4 (e passando um alias pra ele -> uuidv4) lib uuid (biblioteca para gerar id's...)

const app = express();      // criando uma instância do express

// aqui estou dizendo para o express que ele vai trabalhar com json:
app.use(express.json());      // configurar para o app reconhecer o padrão Json..

const projects = [];     // Esse array vai simular uma API.. Porém como não tenho banco de dados, a cada reload do projeto os dados serão perdidos

// vou criar um middleware que dispara no console o nome de cada rota que é acessada na minha aplicação..
function logRoutes(req, res, next) {
    const { method, url } = req;    // de tudo que eu tenho na request eu estou desestruturando os objetos: 'method' e 'url'
    const route = `[${method.toUpperCase()}] ${url}`;

    console.log(route);

    // Para esse middleware ir para a próxima rota eu chamo o next que eu recebo como parâmetro:
    return next();
}

// Para aplicar o middleware em todas as minhas rotas:
app.use(logRoutes);
// se eu quisesse executar um middleware em apenas uma rota eu faria assim:
// app.get('/', logRoutes, (req, res) => {
//     return res.json({
//         message: 'Minha ApiRestful Node.js'
//     })
// });
// e teria que comentar o app.use(logRoutes) acima...
// documentação do middleware: 'https://expressjs.com/en/guide/using-middleware.html'

// get na rota padrão
app.get('/', (req, res) => {
    return res.json({
        message: 'Minha ApiRestful Node.js'
    })
});

// get (listar) na rota projects
app.get('/projects', (req, res) => {
    return res.json(projects);
});

// post (inserir) na rota projects
app.post('/projects', (req, res) => {
    const { name, owner } = req.body;      // body é o que eu recebo como parâmetro quando eu vou inserir ou atualizar dados..

    // se o usuário não informou esses campos, ou seja, se eles forem vazios..
    if (!name || !owner) {
        return res.status(400).json({ error: 'Name and owner are required' });
    }


    const project = {
        id: uuidv4(),       // gera um id aleatório...
        name: name,        // o name e o owner vem do body da requisição
        owner: owner
    }

    projects.push(project);

    // retorno o status 201 (created) -> usado na rota post, normalmente 
    return res.status(201).json(project);
});

// put (atualizar) na rota projects
app.put('/projects/:id', (req, res) => {
    const { id } = req.params;          // dessa forma '{ id }' eu pego o atributo 'id' que está dentro do objeto que é retornado do 'req.params', se eu fizesse 'const id = req.params;', eu pegaria o objeto inteiro e não direto o atributo 'id' que é o que eu quero
    const { name, owner } = req.body;

    console.log('id: ', id);
    console.log('name: ', name);
    console.log('owner: ', owner);

    const projectIndex = projects.findIndex(p => p.id === id);      // se retornar -1 ele não encontrou esse id no array
    console.log('indice: ', projectIndex);

    if (projectIndex < 0) {         // se o indice for menor que zero quer dizer que ele não existe no meu array de projects..
        return res.status(404).json({ error: 'Project not found' });
    }

    // se o usuário não informou esses campos, ou seja, se eles forem vazios..
    if (!name || !owner) {
        return res.status(400).json({ error: 'Name and owner are required' });
    }

    // se passou pelas validações quer dizer que eu posso salvar os dados no "banco" (nesse caso eu não tenho banco de dados)
    const project = {
        id: id,
        name: name,
        owner: owner
    }

    projects[projectIndex] = project;       // salvando no "banco" (no array...)

    return res.json(project);   // retorno o objeto que foi modificado

});

// deletar (por id) na rota projects
app.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
    console.log('id: ', id);

    const projectIndex = projects.findIndex(p => p.id === id);
    console.log('indice: ', projectIndex);

    if (projectIndex < 0) {
        return res.status(404).json({ error: 'Project not found' });
    } else {    // se o indice existe eu posso deletar, então:
        projects.splice(projectIndex, 1);       // removo a partir desse indice ('projectIndex'), um elemento (segundo parâmetro)...
        
        return res.status(204).send();  // status 204: diz que funcionou, mas não possui conteúdo de retorno...
    }
});

// Query Params:
app.get('/query', (req, res) => {
    // é dessa forma que pegamos os query params:
    const query = req.query;    // no 'query', eu tenho acesso a todos os meu query params...
    console.log(query);

    return res.json(
        { message: 'Query Params' }
    );
});

// Route Params:
// Posso receber mais de um parâmetro na rota, ex.: '/path/:id/:name'
app.get('/path/:id', (req, res) => {
    const params = req.params;  // dessa forma eu tenho acesso aos parâmetros de rota..
    console.log(params);

    return res.json(
        { message: 'Path Params' }
    );
});

// roda o app na porta 3000
app.listen(3000, () => {
    console.log('Aplicação rodando na porta 3000!');
});