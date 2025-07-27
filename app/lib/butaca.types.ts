export interface Butaca {
  id: number
  fila: number
  seccion: "izquierda" | "centro-izq" | "centro-der" | "derecha"
  ocupada: boolean
  asignado?: string
  notas?: string
}

export interface ExportData {
  funcion1: Butaca[]
  funcion2: Butaca[]
  funcion3: Butaca[]
  fechaExportacion: string
  version: string
}
