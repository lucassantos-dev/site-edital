/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

import { ChangeEvent } from 'react'
import { normalizeCNPJ, normalizePhoneNumber } from "@/mask/mask"


interface CustomInputProps {
  labelText: string
  control: Control<any>
  registerName: string
  textlabel?: string
  icon: React.ComponentType<any>
  placeholder?: string
  type: string
  maskName?: 'contact_phone' | 'cnpj' | 'cep'
  defaultValue?: string
}

export const CustomInput = ({ defaultValue, labelText, registerName, icon: Icon, textlabel, control, placeholder, type, maskName }: CustomInputProps) => {

  const { setValue } = useFormContext()

  const mask = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const newValue = maskName === 'cnpj' ? normalizeCNPJ(value) : maskName === 'contact_phone' ? normalizePhoneNumber(value) : value
    setValue(name, newValue)
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
            <div className="text-slate-100 absolute ml-2">
              <Icon className="size-5 stroke-1" />
            </div>
            <FormControl onChange={mask}>
              <Input
                defaultValue={defaultValue}
                id={registerName}
                data-mask={maskName}
                placeholder={placeholder}
                {...field}
                type={type}
                autoComplete="off"

              />
            </FormControl>
          </div>
          {fieldState?.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  )
}