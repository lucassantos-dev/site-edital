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
  idade: z.string().min(18, {
    message: 'Você deve ter pelo menos 18 anos.',
  }),
  cnpj: z.string().min(1,{
    message: 'O CNPJ é obrigatório',
  })
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ inválido.',
  }),
  telefone: z
    .string().min(1,{
      message: 'O campo telefone é obrigatório.',
    })
    .regex(/^\(\d{2}\) \d{5}(?:-\d{4})?$/, {
      message: 'Telefone inválido.',
    }),
    sexo: z.string().min(2, {
      message:"Selecione o sexo"
    }),
    especializacao: z.string(),
    experiencia: z.string(),
    experienciaHomeCare: z.string(),
    cargo:z.string().min(2, {
      message:"Selecione um cargo"
    }),
    valor:z.string().min(1, {
      message: 'Digite um valor',
    }),
    cep: z.string(),
    cidade: z.string(),
    estado: z.string(),
})