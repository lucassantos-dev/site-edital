'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CustomInput } from '@/components/form/custom-inputs'
import { formSchema } from '@/zod-schema/schema'
import { toast } from 'react-toastify'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import CVUploadForm from '@/components/form/cvInput'
import CRMUploadForm from '@/components/form/crmInput'


export default function CadastroForm() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      cnpj: '',
      telefone: '',
      especializacao: 'nao',
      experiencia: 'nao',
      experienciaHomeCare: 'nao',
      cargo: '',
      sexo: '',
      valor: '',
      idade: '',
      cep: '',
      cidade: '',
      estado: '',
    },
  })
  const [cepLoading, setCepLoading] = useState(false);
  const handleCepChange = async (cep: string) => {
    if (cep.length === 8) { // ViaCEP aceita apenas números sem traço
      setCepLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          console.log('CEP não encontrado.');
          form.setValue('cidade', '');
          form.setValue('estado', '');
        } else {
          // Atualiza os campos de cidade e estado
          form.setValue('cidade', data.localidade || '');
          form.setValue('estado', data.uf || '');
        }
      } catch (error) {
        console.log('Erro ao buscar o CEP. Tente novamente.' + error);
      } finally {
        setCepLoading(false);
      }
    } else {
      form.setValue('cidade', '');
      
      form.setValue('estado', '');
    }
  };

  const cargosValores = {
    enfermeiro: 30,
    medico: 50,
    auxiliar: 20,
    fisioterapeuta: 35,
    nutricionista: 25,
  } as const;

  type Cargo = keyof typeof cargosValores;

  const valorMaximo = (cargo: Cargo | ''): number => {
    return cargosValores[cargo as Cargo] || 0
  }
  // Validação customizada do campo 'valor' com base no cargo
  const valorValidator = (value: number, cargo: Cargo) => {
    const maxValue = valorMaximo(cargo)
    if (value >= maxValue) {
      if (maxValue === 0) {
        return 'Selecione um cargo'
      }
      return `Valor máximo que pagamos é de  ${maxValue}`
    }
    return true
  }
  useEffect(() => {
    const cargo = form.watch('cargo') as Cargo // Obter o cargo selecionado
    const valor = form.getValues('valor') // Obter o valor do campo 'valor'

    // Só valida o valor se o cargo foi selecionado
    if (cargo && valor !== undefined) {
      const errorMessage = valorValidator(Number(valor || 0), cargo) // Validar o valor com base no cargo

      if (errorMessage !== true) {
        form.setError("valor", { message: errorMessage }) // Setar erro se houver
      } else {
        form.clearErrors("valor") // Limpar erro se for válido
      }
    } else {
      // Limpa o erro se o cargo não for selecionado ainda
      form.clearErrors("valor")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('cargo')]) // A cada vez que o cargo mudar, o efeito será disparado

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast('Cadastro realizado com sucesso!')
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4a79ad] to-[#67a892] flex items-center justify-center p-8">
      <div className="relative bg-white rounded-lg shadow-xl p-10 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#4a79ad]">Cadastro</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <h2 className="text-xl font-bold mb-8  text-[#4a79ad]">Dados Pessoais</h2>
            <FormField
              control={form.control}
              name="nome"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="">Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} className="" />
                  </FormControl>
                  {fieldState?.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                </FormItem>
              )}
            />
            <CustomInput
              labelText='CNPJ'
              control={form.control}
              registerName='cnpj'
              textlabel='xx.xxx.xxx/xxxx-xx'
              placeholder='xx.xxx.xxx/xxxx-xx'
              type="text"
              maskName='cnpj'
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="idade"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="">Idade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Idade" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} className="" />
                    </FormControl>
                    {fieldState?.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <CustomInput
                labelText='Telefone'
                control={form.control}
                registerName='telefone'
                textlabel='(xx) xxxxx-xxxx'
                placeholder='(xx) xxxxx-xxxx'
                type="text"
                maskName='contact_phone'
              />
              <FormField
                control={form.control}
                name="sexo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Sexo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <h2 className="text-xl font-bold mb-8  text-[#4a79ad]">Dados Profissionais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="especializacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Possui especialização?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experiencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Possui experiencia no cargo?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experienciaHomeCare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Ja trabalhou em home care?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(cargosValores).map((cargo) => (
                          <SelectItem key={cargo} value={cargo}>
                            {cargo.charAt(0).toUpperCase() + cargo.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Valor por sessão/visita</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o valor"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          const valor = parseInt(e.target.value, 10)
                          const cargo = form.watch('cargo') as Cargo
                          const errorMessage = valorValidator(valor, cargo)
                          field.onChange(valor)
                          // Atualiza o erro de validação
                          if (errorMessage !== true) {
                            form.setError("valor", { message: errorMessage })
                          }
                        }}
                      />
                    </FormControl>
                    {fieldState?.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <CRMUploadForm control={form.control}/>
              </div>
            <h2 className="text-xl font-bold mb-8  text-[#4a79ad]">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
              <CustomInput
                labelText="CEP"
                control={form.control}
                registerName="cep"
                textlabel="XXXXX-XXX"
                placeholder="Digite o CEP"
                type="text"
                maskName="cep" // Aplique a máscara para o CEP
                onChange={(e) => {
                  const cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
                  form.setValue('cep', cep); // Atualiza o valor do campo de CEP
                  handleCepChange(cep); // Chama a função de busca do CEP
                }}
              />
              {cepLoading && <p className="text-sm mt-3 ml-1 text-gray-500">Buscando informações...</p>}
              </div>
              <FormField
                control={form.control}
                name="cidade"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Cidade"
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    {fieldState?.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Estado"
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    {fieldState?.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
            <div>
              <CVUploadForm control={form.control} />
            </div>
            <Button type="submit" className="w-full bg-[#67a892] hover:bg-[#4a79ad] h-12 text-lg">Cadastrar</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}