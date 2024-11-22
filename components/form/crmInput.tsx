/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Control } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


interface CustomInputProps {
  control: Control<any>
}
export default function CRMUploadForm({ control }: CustomInputProps) {
  const [fileCrmName, setFileCrmName] = useState<string | null>(null);

  return (
    <FormField
      control={control}
      name="crm" // Certifique-se de que o nome seja o mesmo usado no schema
      render={({ field: { onChange }, fieldState }) => (
        <FormItem>
          <FormLabel className="text-lg text-[#4a79ad] font-semibold">CRM</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const fileList = e.target.files;
                  if (fileList && fileList.length > 0) {
                    setFileCrmName(fileList[0].name);
                    onChange(fileList); // Passa o FileList para o formulário
                  } else {
                    setFileCrmName(null);
                    onChange(null); // Limpa o valor se nenhum arquivo for selecionado
                  }
                }}
                className="hidden"
                id="crm-upload"
              />
              <label
                htmlFor="crm-upload"
                className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm 
                font-medium ring-offset-background transition-colors focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                disabled:pointer-events-none disabled:opacity-50 bg-[#4a79ad] hover:bg-[#67a4eb] 
                text-primary-foreground h-10 px-4 py-2"
              >
                Selecionar arquivo
              </label>
              {fileCrmName && <span className="text-sm text-muted-foreground">{fileCrmName}</span>}
            </div>
          </FormControl>
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          <FormDescription>
            Faça upload do seu CRM
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
