/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/cadastrar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Importando sua configuração do Prisma
import fs from 'fs';
import path from 'path';
import formidable, { File } from 'formidable';

// Função para salvar arquivos no sistema de arquivos local
const saveFile = (file: File) => {
  const uploadDir = path.join(process.cwd(), 'uploads'); // Diretório onde os arquivos serão salvos

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Cria o diretório caso não exista
  }

  const filePath = path.join(uploadDir, file.originalFilename || 'file');
  fs.renameSync(file.filepath, filePath);

  return filePath;
};

// Função para lidar com o cadastro e o upload
export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'uploads'), // Diretório onde os arquivos temporários serão salvos
    keepExtensions: true, // Mantém a extensão do arquivo
    maxFileSize: 10 * 1024 * 1024, // Limita o tamanho do arquivo para 10MB (opcional)
  });

  return new Promise<NextResponse>((resolve, reject) => {
    form.parse(req.body as any, async (err, fields, files) => {
      if (err) {
        return reject(new NextResponse('Erro ao processar os dados', { status: 500 }));
      }

      try {
        // Extrair dados do formulário com verificação de tipo
        const nome = Array.isArray(fields.nome) ? fields.nome[0] : fields.nome;
        const cnpj = Array.isArray(fields.cnpj) ? fields.cnpj[0] : fields.cnpj;
        const idade = Number(Array.isArray(fields.idade) ? fields.idade[0] : fields.idade);
        const telefone = Array.isArray(fields.telefone) ? fields.telefone[0] : fields.telefone;
        const sexo = Array.isArray(fields.sexo) ? fields.sexo[0] : fields.sexo;
        const especializacao = Array.isArray(fields.especializacao) ? fields.especializacao[0] : fields.especializacao;
        const experiencia = Array.isArray(fields.experiencia) ? fields.experiencia[0] : fields.experiencia;
        const experienciaHomeCare = Array.isArray(fields.experienciaHomeCare) ? fields.experienciaHomeCare[0] : fields.experienciaHomeCare;
        const cargo = Array.isArray(fields.cargo) ? fields.cargo[0] : fields.cargo;
        const valor = Number(Array.isArray(fields.valor) ? fields.valor[0] : fields.valor);
        const cep = Array.isArray(fields.cep) ? fields.cep[0] : fields.cep;
        const cidade = Array.isArray(fields.cidade) ? fields.cidade[0] : fields.cidade;
        const estado = Array.isArray(fields.estado) ? fields.estado[0] : fields.estado;

        // Salvar dados no banco de dados
        const candidato = await prisma.candidato.create({
          data: {
            nome: nome as string,
            cnpj: cnpj as string,
            idade: idade,
            telefone: telefone as string,
            sexo: sexo as string,
            especializacao: especializacao as string,
            experiencia: experiencia as string,
            experienciaHomeCare: experienciaHomeCare as string,
            cargo: cargo as string,
            valor: valor,
            cep: cep as string,
            cidade: cidade as string,
            estado: estado as string,
          },
        });

        // Verificar se o arquivo cv existe e salvar o arquivo
        const cvFile = files.cv ? (Array.isArray(files.cv) ? files.cv[0] : files.cv) : undefined;
        const crmFile = files.crm ? (Array.isArray(files.crm) ? files.crm[0] : files.crm) : undefined;

        // Verifique se cvFile foi encontrado e salve o arquivo
        if (cvFile) {
          const savedCvFile = saveFile(cvFile as File);
          await prisma.arquivo.create({
            data: {
              candidatoId: candidato.id,
              tipoArquivo: 'CV', // Tipo de arquivo como CV
              nomeArquivo: cvFile?.originalFilename || 'cv', // Nome do arquivo
              caminhoArquivo: savedCvFile, // Caminho onde o arquivo foi salvo
            },
          });
        }

        // Verifique se crmFile foi encontrado e salve o arquivo
        if (crmFile) {
          const savedCrmFile = saveFile(crmFile as File);
          await prisma.arquivo.create({
            data: {
              candidatoId: candidato.id,
              tipoArquivo: 'CRM', // Tipo de arquivo como CRM
              nomeArquivo: crmFile?.originalFilename || 'crm', // Nome do arquivo
              caminhoArquivo: savedCrmFile, // Caminho onde o arquivo foi salvo
            },
          });
        }

        return resolve(new NextResponse('Cadastro realizado com sucesso!', { status: 200 }));
      } catch (error) {
        console.error(error);
        return reject(new NextResponse('Erro ao realizar o cadastro.', { status: 500 }));
      }
    });
  });
}
