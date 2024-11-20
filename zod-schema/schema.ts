import { z } from 'zod'

// Regex to validate the phone number in the format (XX) XXXXX or (XX) XXXXX-YYYY
const phoneRegex = /^\(\d{2}\) \d{5}(?:-\d{4})?$/

// Interface for the form that includes the phone field
export interface PhoneFormSchema {
  contact_phone: string
}

// Schema for phone number validation
const phoneSchema = z
  .string()
  .min(15, 'This field is required')
  .length(15, `Must have 15 characters`)
  .regex(phoneRegex, 'The phone number must be valid')


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
const cvSchema = z.custom<FileList>((value) => {
  if (!(value instanceof FileList) || value.length === 0) {
    return false;
  }
  const file = value[0];
  const isValidSize = file.size <= MAX_FILE_SIZE;
  const isValidFormat = SUPPORTED_FORMATS.includes(file.type);
  return isValidSize && isValidFormat;
}, "O currículo é obrigatório e deve ser um arquivo válido (PDF ou Word, máx. 5MB).");
// Ignora a validação no servidor

const crmSchema = z.custom<FileList>((value) => {
  if (!(value instanceof FileList) || value.length === 0) {
    return false;
  }
  const file = value[0];
  const isValidSize = file.size <= MAX_FILE_SIZE;
  const isValidFormat = SUPPORTED_FORMATS.includes(file.type);
  return isValidSize && isValidFormat;
}, "O crm é obrigatório e deve ser um arquivo válido (PDF ou Word, máx. 5MB).");
// Ignora a validação no servidor
// Example of how to use the phone schema in an object
export const zodPhoneSchema = z.object({
  contact_phone: phoneSchema
})

// Function to validate the phone number format
export const invalidPhoneNumberFormat = (number: string) => {
  return phoneRegex.test(number)
}

export const formSchema = z.object({
  nome: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  idade: z.union([
    z.string().min(1).optional(), // Permite o valor vazio
    z.number().min(18, {
      message: 'Você deve ter pelo menos 18 anos.',
    }).int(), // Garante que o valor seja um número inteiro
  ]), cnpj: z.string().min(1, {
    message: 'O CNPJ é obrigatório',
  })
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
      message: 'CNPJ inválido.',
    }),
  telefone: z
    .string().min(1, {
      message: 'O campo telefone é obrigatório.',
    })
    .regex(/^\(\d{2}\) \d{5}(?:-\d{4})?$/, {
      message: 'Telefone inválido.',
    }),
  sexo: z.string().min(2, {
    message: "Selecione o sexo"
  }),
  especializacao: z.string(),
  experiencia: z.string(),
  experienciaHomeCare: z.string(),
  cargo: z.string().min(2, {
    message: "Selecione um cargo"
  }),
  valor: z.union([
    z.string().min(1).optional(), // Permite o valor vazio
    z.number().min(1, {
      message: 'Digite um valor',
    })
  ]),
  cep: z.string(),
  cidade: z.string(),
  estado: z.string(),
  cv: cvSchema,
  crm: crmSchema
})