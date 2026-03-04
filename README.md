🔧 Sistema de Manutenção Preditiva com Inteligência Artificial

Este sistema utiliza Machine Learning para prever falhas em motores elétricos industriais com base em variáveis operacionais como temperatura, vibração, corrente elétrica, tensão e horas de operação.


📌 Problema

Motores elétricos industriais são essenciais em processos produtivos. Falhas inesperadas podem causar:

- Paradas não programadas  
- Altos custos de manutenção  
- Danos a equipamentos  
- Redução da vida útil dos ativos  

A manutenção tradicional (corretiva ou preventiva por tempo) não considera o estado real do motor.


💡 Solução

Foi desenvolvida uma aplicação Full Stack que:

- Recebe dados operacionais do motor  
- Aplica um modelo de Machine Learning  
- Calcula a probabilidade de falha  
- Classifica o risco (Baixo ou Alto)  
- Armazena histórico das predições  
- Exibe gráfico evolutivo  
- Permite limpar histórico  


🧠 Como a IA Funciona

O modelo foi treinado com dados históricos simulados contendo:

- Temperatura  
- Vibração  
- Corrente  
- Tensão  
- Horas de operação  
- Indicador de falha (0 ou 1)  

Algoritmo utilizado:

Random Forest Classifier (Scikit-Learn)

O modelo aprende padrões que indicam falha.  
Ao receber novos dados, ele retorna:

- Classificação (Alto ou Baixo risco)  
- Probabilidade percentual de falha  


 🏗 Arquitetura

Frontend:
- React  
- Bootstrap  
- Chart.js  

Backend:
- FastAPI  
- SQLAlchemy  
- SQLite  
- Pandas  
- Scikit-Learn  
- Joblib  

Fluxo da aplicação:

Usuário → React → FastAPI → Modelo IA → Banco SQLite → Resposta → Dashboard


⚙️ Pré-requisitos

Instalar:

- Python 3.10 ou superior  
- Node.js 18 ou superior  
- Git  

Verificar Python:

py --version


🚀 Como Executar o Projeto Completo

1️⃣ Clonar o repositório

git clone LINK_DO_REPOSITORIO
cd projeto_hackaton


🔹 Backend (API + IA)

2️⃣ Entrar na pasta backend

cd backend

3️⃣ Criar ambiente virtual

py -m venv venv

4️⃣ Ativar ambiente virtual (Windows)

venv\Scripts\activate

Se aparecer `(venv)` no início do terminal, está ativado.


⚠️ Caso apareça erro de política do PowerShell

Se aparecer erro como:

Execute este comando no PowerShell como Administrador:

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Depois tente novamente:

venv\Scripts\activate


5️⃣ Instalar dependências

pip install fastapi uvicorn pandas scikit-learn sqlalchemy joblib


6️⃣ Treinar o modelo

py train_model.py

Isso irá gerar o arquivo `model.pkl`.

7️⃣ Rodar a API

uvicorn main:app --reload

A API ficará disponível em:

http://127.0.0.1:8000


🔹 Frontend (Interface Web)

Abra outro terminal.

8️⃣ Entrar na pasta frontend

cd frontend


9️⃣ Instalar dependências

npm install

🔟 Iniciar aplicação

npm start


A aplicação abrirá em:

http://localhost:3000



📊 Funcionalidades

- Inserção de dados do motor  
- Predição em tempo real  
- Probabilidade percentual  
- Barra de progresso dinâmica  
- Histórico salvo em banco SQLite  
- Gráfico evolutivo das predições  
- Botão para limpar histórico  


📈 Possíveis Melhorias Futuras

- Integração com sensores IoT reais  
- Deploy em nuvem  
- Dashboard para múltiplos motores  
- Modelo treinado com dados industriais reais  
- Sistema automático de alertas  


👨🏻‍💻 Desenvolvedor

Arthur Carvalho Fontinele  
Engenharia Mecatrônica  

Projeto desenvolvido para o Hackathon InovSpin.
