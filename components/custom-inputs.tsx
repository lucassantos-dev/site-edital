/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

import { ChangeEvent } from 'react'
import { normalizeCEP, normalizeCNPJ, normalizePhoneNumber } from "@/mask/mask"


interface CustomInputProps {
  labelText: string
  control: Control<any>
  registerName: string
  textlabel?: string
  placeholder?: string
  type: string
  maskName?: 'contact_phone' | 'cnpj' | 'cep'
  defaultValue?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void; 
}

export const CustomInput = ({ onChange,defaultValue, labelText, registerName, textlabel, control, placeholder, type, maskName }: CustomInputProps) => {

  const { setValue } = useFormContext()

  const mask = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    let newValue = value

    // Aplique a máscara conforme o tipo
    if (maskName === 'cnpj') {
      newValue = normalizeCNPJ(value)
    } else if (maskName === 'contact_phone') {
      newValue = normalizePhoneNumber(value)
    } else if (maskName === 'cep') {
      // Se a máscara for de CEP, você pode aplicar o normalizeCEP aqui
      newValue = normalizeCEP(value)
      if (onChange) onChange(event)  // Chama o onChange, se fornecido
    }
    setValue(name, newValue)  // Atualiza o valor no form
  }

  return (
    <FormField
      control={control}
      name={registerName}
      render={({ field, fieldState }) => (
        <FormItem className="group space-y-0">
          <div className="flex flex-col space-x-2">
            <FormLabel className="">{labelText}</FormLabel>
            <FormLabel htmlFor={registerName} className="text-sky-500 text-sm font-normal p-1 transition-opacity duration-300 opacity-0 group-focus-within:opacity-100 select-none">
              {textlabel}
            </FormLabel>
          </div>
          <div className="flex items-center relative">
            {/* <div className="text-slate-100 absolute ml-2">
              <Icon className="size-5 stroke-1" />
            </div> */}
            <FormControl onChange={mask}>
              <Input
                defaultValue={defaultValue}
                id={registerName}
                data-mask={maskName}
                placeholder={placeholder}
                {...field}
                type={type}
                autoComplete="off"
                onChange={mask}
              />
            </FormControl>
          </div>
          {fieldState?.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  )
}