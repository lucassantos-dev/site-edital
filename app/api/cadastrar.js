import { IncomingForm } from 'formidable';
import { db } from '../../lib/db';  // Importa a conexão com o banco de dados
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Desabilita o bodyParser padrão do Next.js para permitir o envio de arquivos
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.uploadDir = './uploads'; // Defina o diretório onde os arquivos serão armazenados
    form.keepExtensions = true; // Mantém as extensões originais dos arquivos
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erro ao processar arquivo:', err);
        return res.status(500).json({ error: 'Erro ao processar arquivo.' });
      }

      const { nome, idade, cnpj, telefone, sexo, especializacao, experiencia, experienciaHomeCare, cargo, valor, cep, cidade, estado, cv, crm } = fields;

      // Acessa os arquivos enviados
      const cvArquivo = files.cv ? files.cv[0] : null; // 'cv' é o nome do campo do formulário para o CV
      const crmArquivo = files.crm ? files.crm[0] : null; // 'crm' é o nome do campo do formulário para o CRM

      // Verifica se os arquivos foram carregados corretamente
      if (!cvArquivo || !crmArquivo) {
        return res.status(400).json({ error: 'Ambos os arquivos CV e CRM devem ser enviados.' });
      }

      // Defina os caminhos dos arquivos (diretórios onde serão armazenados no servidor)
      const cvFilePath = path.join(form.uploadDir, cvArquivo.newFilename);
      const crmFilePath = path.join(form.uploadDir, crmArquivo.newFilename);

      try {
        // Inserir dados do usuário no banco de dados
        const query = `
          INSERT INTO usuarios (
            nome, idade, cnpj, telefone, sexo, especializacao,
            experiencia, experienciaHomeCare, cargo, valor,
            cep, cidade, estado, cv, crm
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          nome, idade, cnpj, telefone, sexo, especializacao === 'sim',
          experiencia === 'sim', experienciaHomeCare === 'sim',
          cargo, valor, cep, cidade, estado, JSON.stringify(cv),
          JSON.stringify(crm),
        ];

        const [result] = await db.execute(query, values);

        // Após inserir os dados do usuário, armazene as informações dos arquivos na tabela de arquivos
        const queryFile = `
          INSERT INTO arquivos (
            nome, caminho, tipo, tamanho, usuario_id
          ) VALUES (?, ?, ?, ?, ?)
        `;

        // Armazenar o arquivo CV no banco
        const cvFileValues = [
          cvArquivo.originalFilename,
          cvFilePath,
          cvArquivo.mimetype,
          cvArquivo.size,
          result.insertId,
        ];
        await db.execute(queryFile, cvFileValues);

        // Armazenar o arquivo CRM no banco
        const crmFileValues = [
          crmArquivo.originalFilename,
          crmFilePath,
          crmArquivo.mimetype,
          crmArquivo.size,
          result.insertId,
        ];
        await db.execute(queryFile, crmFileValues);

        // Retornar sucesso
        res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
      } catch (error) {
        console.error('Erro ao inserir no banco:', error);
        res.status(500).json({ error: 'Erro ao salvar dados no banco.' });
      }
    });
  } else {
    res.status(405).json({ error: 'Método não permitido.' });
  }
}
