# Distribuição de Leads

Este projeto é uma aplicação Node.js que distribui leads entre escritórios de forma aleatória e organizada, classificando os leads em diferentes perfis com base em suas características. A aplicação permite listar todos os leads e verificar os leads distribuídos para um escritório específico.

**Estrutura do Projeto**
/Desafio-Tec
│
├── models/
│   └── Lead.js           # Modelo de dados do Lead
│
├── controllers/
│   └── leadController.js  # Controlador principal para gerenciar leads
│
├── routes/
│   └── leadRoutes.js      # Rotas da API para leads
│
├── .env                   # Configurações do ambiente
├── package.json           # Dependências do projeto
└── server.js              # Arquivo de entrada da aplicação


## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemon

## Pré-requisitos

Antes de começar, você precisará ter:

- [Node.js](https://nodejs.org/pt)-> versão 14 ou superior 
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Configuração do Projeto

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/luccaWeber/Desafio-Tec.git
   cd Desafio-Tec

2. **Instalações e configurações do Projeto**
Instale as dependências:
- `npm install express mongoose dotenv`
- `npm install nodemon --save-dev`


Configure a conexão com MongoDB Atlas, no seu arquivo .env adicione as seguintes informações:

MONGO_URI=mongodb+srv://luccaws:Desafiotec@cluster0.8or2mmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000 

3. **Inicie a aplicação**:

`npm run dev`

4. **Adicione os dados a serem distibuídos**

Usando MongoDB Compass:

Abra o MongoDB Compass e conecte-se ao cluster.(MONGO_URI=mongodb+srv://luccaws:Desafiotec@cluster0.8or2mmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0)

Selecione o banco de dados onde você deseja inserir os LEADS.(DB name = test)

Clique na coleção em que você deseja adicionar os LEADS (collection name = leads).

Clique em "import Data" e depois selecione o arquivo em formato JSON ou CSV contendo a carga de dados dos Leads.

- Após isso, você ja terá disponível o conteúdo dos Leads prontos para serem distribuídos. O conteúdo deve ser semelhante a:

[
    {
        "name": "erik vinicius",
        "monthlyIncome": 1800,
        "applications": 120000,
        "projectDate": "2024-10-01T18:28:20.665Z",
        "status": "A distribuir"
    },
    ...
]


# Endpoints da API

**Distribuir Leads**
- Método: POST
- Descrição: Distribui os leads com status "A distribuir" entre os escritórios definidos e o numero de leads por lote. O escritório líder é escolhido aleatoriamente para o primeiro lote, e a distribuição alterna entre os escritórios nos lotes subsequentes.
- Endpoint: /api/leads/distribuir
- Corpo da Requisição:
{
  "loteSize": 5,
  "offices": ["X", "Y"]
}

**Listar Leads**
- Método: GET
- Endpoint: /api/leads
- Parametro (opcional): 
  - status = ("Adistribuir" ou "Finalizado")
- Descrição: Retorna os leads cadastrados na base de dados, caso utilize o parâmetro de status, separa as informações de acordo com o status da distribuição.

**Listar Leads por Escritório**
- Método: GET
- Endpoint: /api/leads/office/
- Parâmetros (obrigatório):
  - office = ("nome do escritório")
- Descrição: Retorna todos os leads atribuídos ao escritório especificado.
