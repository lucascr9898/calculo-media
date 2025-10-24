// Importa as bibliotecas necessárias
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Inicializa o Express
const app = express();
const port = 3000; // Porta do servidor

// Configura o body-parser para lidar com dados de formulário (x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Configura o Express para servir arquivos estáticos da pasta 'public'
// Isso permite que o 'index.html' seja acessado diretamente na raiz
app.use(express.static(path.join(__dirname, 'public')));

// Rota POST para receber e processar os dados do formulário
app.post('/calcular', (req, res) => {
    // 1. Receber os dados do formulário
    const nome = req.body.nome;
    // Converte as notas para números (importante para o cálculo)
    const nota1 = parseFloat(req.body.nota1);
    const nota2 = parseFloat(req.body.nota2);

    // 2. Regra de Negócio: Calcular a Média
    const media = (nota1 + nota2) / 2;

    // 3. Regra de Negócio: Definir a Situação
    let situacao = '';
    let classeSituacao = ''; // Para aplicar cor/estilo no HTML

    if (media >= 6) {
        situacao = 'Aprovado';
        classeSituacao = 'aprovado';
    } else if (media >= 2 && media < 6) {
        situacao = 'Exame Final';
        classeSituacao = 'exame';
    } else { // média < 2
        situacao = 'Reprovado';
        classeSituacao = 'reprovado';
    }

    // 4. Montar a resposta HTML
    const htmlResposta = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resultado do Cálculo</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .resultado { max-width: 400px; margin: 30px auto; padding: 20px; border: 1px solid #000; border-radius: 5px; background-color: #f9f9f9; }
                .aprovado { color: green; font-weight: bold; }
                .exame { color: orange; font-weight: bold; }
                .reprovado { color: red; font-weight: bold; }
                a { display: block; margin-top: 20px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="resultado">
                <h2>Resultado do Aluno</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>1º Bimestre:</strong> ${nota1.toFixed(1)}</p>
                <p><strong>2º Bimestre:</strong> ${nota2.toFixed(1)}</p>
                <hr>
                <p><strong>Média Final:</strong> ${media.toFixed(2)}</p>
                <p><strong>Situação:</strong> <span class="${classeSituacao}">${situacao}</span></p>
                <a href="/">Voltar ao Formulário</a>
            </div>
        </body>
        </html>
    `;

    // 5. Enviar a resposta de volta ao cliente
    res.send(htmlResposta);
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Acesse o formulário em http://localhost:${port}/index.html (ou apenas http://localhost:${port})`);
});
