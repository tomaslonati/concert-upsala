"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { User, MapPin, Trash2, Music, Lightbulb } from "lucide-react"
import Image from "next/image"
import { generarPDFButacas } from "./lib/pdf-utils"

import type { Butaca, ExportData } from "./lib/butaca.types"

// Configuración exacta del teatro según la imagen
const CONFIGURACION_TEATRO = {
  secciones: {
    izquierda: {
      nombre: "Sección Izquierda",
      filas: [
        { fila: 1, butacas: [108, 107, 106, 105, 104, 103] },
        { fila: 2, butacas: [208, 207, 206, 205, 204, 203, 202] },
        { fila: 3, butacas: [308, 307, 306, 305, 304, 303, 302, 301] },
        { fila: 4, butacas: [408, 407, 406, 405, 404, 403, 402, 401, 400] },
        { fila: 5, butacas: [508, 507, 506, 505, 504, 503, 502, 501, 500] },
        { fila: 6, butacas: [608, 607, 606, 605, 604, 603, 602, 601, 600] },
        { fila: 7, butacas: [708, 707, 706, 705, 704, 703, 702, 701, 700] },
        { fila: 8, butacas: [808, 807, 806, 805, 804, 803, 802, 801, 800] },
        { fila: 9, butacas: [908, 907, 906, 905, 904, 903, 902, 901, 900] },
        { fila: 10, butacas: [1008, 1007, 1006, 1005, 1004, 1003, 1002, 1001, 1000] },
      ],
    },
    "centro-izq": {
      nombre: "Centro Izquierda",
      filas: [
        { fila: 1, butacas: [109, 110, 111, 112, 113, 114, 115, 116] },
        { fila: 2, butacas: [209, 210, 211, 212, 213, 214, 215, 216] },
        { fila: 3, butacas: [309, 310, 311, 312, 313, 314, 315, 316] },
        { fila: 4, butacas: [409, 410, 411, 412, 413, 414, 415, 416] },
        { fila: 5, butacas: [509, 510, 511, 512, 513, 514, 515, 516] },
        { fila: 6, butacas: [609, 610, 611, 612, 613, 614, 615, 616] },
        { fila: 7, butacas: [709, 710, 711, 712, 713, 714, 715, 716] },
        { fila: 8, butacas: [809, 810, 811, 812, 813, 814, 815, 816] },
        { fila: 9, butacas: [909, 910, 911, 912, 913, 914, 915, 916] },
        { fila: 10, butacas: [1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016] },
      ],
    },
    "centro-der": {
      nombre: "Centro Derecha",
      filas: [
        { fila: 1, butacas: [117, 118, 119, 120, 121, 122, 123, 124] },
        { fila: 2, butacas: [217, 218, 219, 220, 221, 222, 223, 224] },
        { fila: 3, butacas: [317, 318, 319, 320, 321, 322, 323, 324] },
        { fila: 4, butacas: [417, 418, 419, 420, 421, 422, 423, 424] },
        { fila: 5, butacas: [517, 518, 519, 520, 521, 522, 523, 524] },
        { fila: 6, butacas: [617, 618, 619, 620, 621, 622, 623, 624] },
        { fila: 7, butacas: [717, 718, 719, 720, 721, 722, 723, 724] },
        { fila: 8, butacas: [817, 818, 819, 820, 821, 822, 823, 824] },
        { fila: 9, butacas: [917, 918, 919, 920, 921, 922, 923, 924] },
        { fila: 10, butacas: [1017, 1018, 1019, 1020] },
      ],
    },
    derecha: {
      nombre: "Sección Derecha",
      filas: [
        { fila: 1, butacas: [125, 126, 127, 128, 129, 130] },
        { fila: 2, butacas: [225, 226, 227, 228, 229, 230, 231] },
        { fila: 3, butacas: [325, 326, 327, 328, 329, 330, 331, 332] },
        { fila: 4, butacas: [425, 426, 427, 428, 429, 430, 431, 432, 433] },
        { fila: 5, butacas: [525, 526, 527, 528, 529, 530, 531, 532, 533] },
        { fila: 6, butacas: [625, 626, 627, 628, 629, 630, 631, 632, 633] },
        { fila: 7, butacas: [725, 726, 727, 728, 729, 730, 731, 732, 733] },
        { fila: 8, butacas: [825, 826, 827, 828, 829, 830, 831, 832, 833] },
        { fila: 9, butacas: [925, 926, 927, 928, 929, 930, 931, 932, 933] },
        { fila: 10, butacas: [1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033] },
      ],
    },
  },
}

function VaciarTeatroConfirmacion({ onVaciar }: { onVaciar: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Vaciar Teatro
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Vaciar teatro?</DialogTitle>
          <DialogDescription>
            Esta acción eliminará todas las asignaciones de butacas. ¿Está seguro?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false)
              onVaciar()
            }}
          >
            Sí, vaciar teatro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function GestorButacasTeatro() {
  // Estado para la función seleccionada
  const TEATROS = [
    { key: "funcion1", label: "Función 1" },
    { key: "funcion2", label: "Función 2" },
    { key: "funcion3", label: "Función 3" },
  ];
  const [teatroSeleccionado, setTeatroSeleccionado] = useState<string>(TEATROS[0].key);

  // Estados para los 3 teatros
  const [butacasFuncion1, setButacasFuncion1] = useState<Butaca[]>([])
  const [butacasFuncion2, setButacasFuncion2] = useState<Butaca[]>([])
  const [butacasFuncion3, setButacasFuncion3] = useState<Butaca[]>([])

  // Función para obtener las butacas del teatro actual
  const obtenerButacasActuales = (): Butaca[] => {
    switch (teatroSeleccionado) {
      case "funcion1": return butacasFuncion1
      case "funcion2": return butacasFuncion2
      case "funcion3": return butacasFuncion3
      default: return butacasFuncion1
    }
  }

  // Función para actualizar las butacas del teatro actual
  const actualizarButacasActuales = (nuevasButacas: Butaca[]) => {
    switch (teatroSeleccionado) {
      case "funcion1":
        setButacasFuncion1(nuevasButacas)
        localStorage.setItem("butacas_funcion1", JSON.stringify(nuevasButacas))
        break
      case "funcion2":
        setButacasFuncion2(nuevasButacas)
        localStorage.setItem("butacas_funcion2", JSON.stringify(nuevasButacas))
        break
      case "funcion3":
        setButacasFuncion3(nuevasButacas)
        localStorage.setItem("butacas_funcion3", JSON.stringify(nuevasButacas))
        break
    }
  }

  const butacas = obtenerButacasActuales()
  const setButacas = actualizarButacasActuales

  // Descargar todas las funciones como JSON unificado
  function descargarJSON() {
    const datosUnificados: ExportData = {
      funcion1: butacasFuncion1,
      funcion2: butacasFuncion2,
      funcion3: butacasFuncion3,
      fechaExportacion: new Date().toISOString(),
      version: "1.0"
    }
    const data = JSON.stringify(datosUnificados, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'concert_upsala_2025.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Cargar un archivo JSON y restaurar el estado de todas las funciones
  function cargarJSON(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        
        // Verificar si es el nuevo formato unificado
        if (json.funcion1 && json.funcion2 && json.funcion3) {
          setButacasFuncion1(json.funcion1)
          setButacasFuncion2(json.funcion2)
          setButacasFuncion3(json.funcion3)
          
          localStorage.setItem("butacas_funcion1", JSON.stringify(json.funcion1))
          localStorage.setItem("butacas_funcion2", JSON.stringify(json.funcion2))
          localStorage.setItem("butacas_funcion3", JSON.stringify(json.funcion3))
          
          alert('Las 3 funciones del concierto se cargaron correctamente.')
        } else if (Array.isArray(json)) {
          // Formato anterior - cargar solo en la función actual
          actualizarButacasActuales(json)
          alert('Asignación cargada correctamente en la función actual del concierto.')
        } else {
          alert('El archivo no tiene el formato esperado.')
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.')
      }
    }
    reader.readAsText(file)
  }

  // Botón para reiniciar el teatro actual
  function handleReiniciarTeatro() {
    switch (teatroSeleccionado) {
      case "funcion1":
        localStorage.removeItem("butacas_funcion1")
        break
      case "funcion2":
        localStorage.removeItem("butacas_funcion2")
        break
      case "funcion3":
        localStorage.removeItem("butacas_funcion3")
        break
    }
    inicializarTeatro()
  }

  // Cargar butacas desde LocalStorage al montar
  useEffect(() => {
    const stored1 = localStorage.getItem("butacas_funcion1")
    const stored2 = localStorage.getItem("butacas_funcion2")
    const stored3 = localStorage.getItem("butacas_funcion3")
    
    if (stored1) {
      try {
        setButacasFuncion1(JSON.parse(stored1))
      } catch (e) {
        // Si hay error, se inicializará normalmente
      }
    }
    
    if (stored2) {
      try {
        setButacasFuncion2(JSON.parse(stored2))
      } catch (e) {
        // Si hay error, se inicializará normalmente
      }
    }
    
    if (stored3) {
      try {
        setButacasFuncion3(JSON.parse(stored3))
      } catch (e) {
        // Si hay error, se inicializará normalmente
      }
    }
  }, [])

  // Alerta antes de cerrar si hay datos sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hayButacasAsignadas = butacasFuncion1.some(b => b.ocupada) || 
                                  butacasFuncion2.some(b => b.ocupada) || 
                                  butacasFuncion3.some(b => b.ocupada)
      
      if (hayButacasAsignadas) {
        e.preventDefault()
        e.returnValue = '¿Estás seguro de que quieres salir? Te recomendamos descargar el JSON para guardar las asignaciones del concierto.'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [butacasFuncion1, butacasFuncion2, butacasFuncion3])

  // Verificar si al menos una función está inicializada
  const algunaFuncionInicializada = butacasFuncion1.length > 0 || butacasFuncion2.length > 0 || butacasFuncion3.length > 0
  const [butacaSeleccionada, setButacaSeleccionada] = useState<Butaca | null>(null)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [nombreAsistente, setNombreAsistente] = useState("")
  const [notasAsistente, setNotasAsistente] = useState("")
  const [butacasSeleccionadas, setButacasSeleccionadas] = useState<Butaca[]>([])
  const [modoSeleccionMultiple, setModoSeleccionMultiple] = useState(false)
  const [mostrarListado, setMostrarListado] = useState(false)
  const [busqueda, setBusqueda] = useState("")

  const inicializarTeatro = () => {
    const nuevasButacas: Butaca[] = []

    Object.entries(CONFIGURACION_TEATRO.secciones).forEach(([seccionKey, seccion]) => {
      seccion.filas.forEach((filaData) => {
        filaData.butacas.forEach((numeroButaca) => {
          nuevasButacas.push({
            id: numeroButaca,
            fila: filaData.fila,
            seccion: seccionKey as "izquierda" | "centro-izq" | "centro-der" | "derecha",
            ocupada: false,
          })
        })
      })
    })

    // Inicializar las 3 funciones con butacas vacías
    setButacasFuncion1(nuevasButacas)
    setButacasFuncion2(nuevasButacas)
    setButacasFuncion3(nuevasButacas)
    
    // Guardar en localStorage
    localStorage.setItem("butacas_funcion1", JSON.stringify(nuevasButacas))
    localStorage.setItem("butacas_funcion2", JSON.stringify(nuevasButacas))
    localStorage.setItem("butacas_funcion3", JSON.stringify(nuevasButacas))
  }

  const seleccionarButaca = (butaca: Butaca) => {
    if (modoSeleccionMultiple) {
      // Modo selección múltiple
      if (butaca.ocupada) return // No permitir seleccionar butacas ocupadas

      setButacasSeleccionadas((prev) => {
        const yaSeleccionada = prev.find((b) => b.id === butaca.id)
        if (yaSeleccionada) {
          // Deseleccionar si ya está seleccionada
          return prev.filter((b) => b.id !== butaca.id)
        } else {
          // Agregar a la selección
          return [...prev, butaca]
        }
      })
    } else {
      // Modo selección individual
      setButacaSeleccionada(butaca)
      if (butaca.ocupada) {
        setNombreAsistente(butaca.asignado || "")
        setNotasAsistente(butaca.notas || "")
      } else {
        setNombreAsistente("")
        setNotasAsistente("")
      }
      setDialogoAbierto(true)
    }
  }

  const asignarButaca = () => {
    if (!butacaSeleccionada || !nombreAsistente.trim()) return

    const nuevasButacas = butacas.map((butaca) =>
      butaca.id === butacaSeleccionada.id
        ? {
            ...butaca,
            ocupada: true,
            asignado: nombreAsistente.trim(),
            notas: notasAsistente.trim(),
          }
        : butaca,
    )

    setButacas(nuevasButacas)
    cerrarDialogo()
  }

  const asignarButacasGrupo = () => {
    if (butacasSeleccionadas.length === 0 || !nombreAsistente.trim()) return

    const nuevasButacas = butacas.map((butaca) => {
      const estaSeleccionada = butacasSeleccionadas.find((b) => b.id === butaca.id)
      if (estaSeleccionada) {
        return {
          ...butaca,
          ocupada: true,
          asignado: nombreAsistente.trim(),
          notas: notasAsistente.trim(),
        }
      }
      return butaca
    })

    setButacas(nuevasButacas)
    cerrarDialogoGrupo()
  }

  const liberarButaca = () => {
    if (!butacaSeleccionada) return

    const nuevasButacas = butacas.map((butaca) =>
      butaca.id === butacaSeleccionada.id
        ? {
            ...butaca,
            ocupada: false,
            asignado: undefined,
            notas: undefined,
          }
        : butaca,
    )

    setButacas(nuevasButacas)
    cerrarDialogo()
  }

  const cerrarDialogo = () => {
    setDialogoAbierto(false)
    setButacaSeleccionada(null)
    setNombreAsistente("")
    setNotasAsistente("")
  }

  const cerrarDialogoGrupo = () => {
    setButacasSeleccionadas([])
    setModoSeleccionMultiple(false)
    setNombreAsistente("")
    setNotasAsistente("")
    setDialogoAbierto(false)
  }

  const agruparButacasPorAsistente = () => {
    const butacasOcupadas = butacas.filter((b) => b.ocupada && b.asignado)
    const grupos: { [key: string]: Butaca[] } = {}

    butacasOcupadas.forEach((butaca) => {
      const nombre = butaca.asignado!
      if (!grupos[nombre]) {
        grupos[nombre] = []
      }
      grupos[nombre].push(butaca)
    })

    return grupos
  }

  const filtrarAsistentes = () => {
    const grupos = agruparButacasPorAsistente()

    if (!busqueda.trim()) {
      return grupos
    }

    const terminoBusqueda = busqueda.toLowerCase().trim()
    const gruposFiltrados: { [key: string]: Butaca[] } = {}

    Object.entries(grupos).forEach(([nombre, butacasAsistente]) => {
      // Buscar por nombre
      const coincideNombre = nombre.toLowerCase().includes(terminoBusqueda)

      // Buscar por número de butaca
      const coincideButaca = butacasAsistente.some((butaca) => butaca.id.toString().includes(terminoBusqueda))

      if (coincideNombre || coincideButaca) {
        gruposFiltrados[nombre] = butacasAsistente
      }
    })

    return gruposFiltrados
  }

  const liberarButacasAsistente = (nombreAsistente: string) => {
    const nuevasButacas = butacas.map((butaca) =>
      butaca.asignado === nombreAsistente
        ? { ...butaca, ocupada: false, asignado: undefined, notas: undefined }
        : butaca,
    )
    
    setButacas(nuevasButacas)
  }

  const abrirDialogoGrupo = () => {
    if (butacasSeleccionadas.length === 0) return
    setNombreAsistente("")
    setNotasAsistente("")
    setDialogoAbierto(true)
  }

  const butacasOcupadas = butacas.filter((b) => b.ocupada).length
  const butacasLibres = butacas.length - butacasOcupadas

  const renderSeccion = (seccionKey: string, seccion: any, className = "") => {
    return (
      <div key={seccionKey} className={`flex flex-col items-center space-y-1 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">{seccion.nombre}</h3>
        {seccion.filas.map((filaData: any) => (
          <div
            key={`${seccionKey}-fila-${filaData.fila}`}
            className={`flex items-center gap-1 ${
              seccionKey === "izquierda" ? "justify-end" : seccionKey === "derecha" ? "justify-start" : "justify-center"
            }`}
          >
            <span className="text-xs font-medium text-gray-500 w-8 text-center">{filaData.fila}</span>
            <div
              className={`flex gap-1 ${
                seccionKey === "izquierda" ? "flex-row-reverse" : seccionKey === "derecha" ? "flex-row" : "flex-row"
              }`}
            >
              {filaData.butacas.map((numeroButaca: number) => {
                const butaca = butacas.find((b) => b.id === numeroButaca)
                return (
                  <button
                    key={numeroButaca}
                    onClick={() => butaca && seleccionarButaca(butaca)}
                    className={`
                      w-6 h-6 text-[10px] font-medium rounded border transition-all hover:scale-110
                      ${
                        butacasSeleccionadas.find((b) => b.id === numeroButaca)
                          ? "bg-blue-200 border-blue-300 text-blue-800 hover:bg-blue-300"
                          : butaca?.ocupada
                            ? "bg-red-200 border-red-300 text-red-800 hover:bg-red-300"
                            : "bg-green-200 border-green-300 text-green-800 hover:bg-green-300"
                      }
                    `}
                    title={butaca?.ocupada ? `Ocupada por: ${butaca.asignado}` : `Butaca ${numeroButaca} libre`}
                  >
                    {numeroButaca}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-2">
          {seccionKey === "izquierda" && "84 asientos"}
          {seccionKey === "centro-izq" && "80 asientos"}
          {seccionKey === "centro-der" && "76 asientos"}
          {seccionKey === "derecha" && "84 asientos"}
        </div>
      </div>
    )
  }

  if (!algunaFuncionInicializada) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto mt-10">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <MapPin className="w-6 h-6" />
                Colegio Upsala - Concert 2025 (324 Asientos c/u)
              </CardTitle>
              <CardDescription>Sistema de gestión de butacas para el concierto anual del Colegio Upsala</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded ">
                    <div className="font-semibold">Sección Izquierda</div>
                    <div className="text-blue-600">84 asientos</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-semibold">Centro Izquierda</div>
                    <div className="text-green-600">80 asientos</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="font-semibold">Centro Derecha</div>
                    <div className="text-yellow-600">76 asientos</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="font-semibold">Sección Derecha</div>
                    <div className="text-purple-600">84 asientos</div>
                  </div>
                </div>

                <Button onClick={inicializarTeatro} size="lg" className="w-full max-w-md">
                  Inicializar Concert Upsala 2025
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header y controles principales */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Concert - {TEATROS.find(t => t.key === teatroSeleccionado)?.label}
            </h1>
            <div className="flex gap-4 items-center">
              {/* Menú desplegable de funciones */}
              <div className="flex flex-col items-center">
                <Label htmlFor="selector-funcion" className="text-xs text-gray-600 mb-1">
                  Cambiar función del concierto:
                </Label>
                <select
                  id="selector-funcion"
                  className="border rounded px-2 py-1 text-sm"
                  value={teatroSeleccionado}
                  onChange={e => setTeatroSeleccionado(e.target.value)}
                >
                  {TEATROS.map(t => (
                    <option key={t.key} value={t.key}>{t.label}</option>
                  ))}
                </select>
              </div>
              <VaciarTeatroConfirmacion onVaciar={handleReiniciarTeatro} />
              <Button
                variant={mostrarListado ? "default" : "outline"}
                onClick={() => setMostrarListado(!mostrarListado)}
              >
                {mostrarListado ? "Ocultar Listado" : "Ver Asistentes"}
              </Button>
              <Button variant="outline" onClick={descargarJSON}>
                Descargar JSON
              </Button>
              <Button variant="outline" onClick={() => generarPDFButacas(butacas)}>
                Descargar PDF
              </Button>
              <label className="inline-block">
                <span className="sr-only">Cargar JSON</span>
                <input type="file" accept="application/json" className="hidden" onChange={cargarJSON} />
                <Button variant="outline" asChild>
                  <span>Cargar JSON</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex gap-4 mb-4">
            <Badge variant="secondary" className="px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              324 butacas totales
            </Badge>
            <Badge variant="default" className="px-4 py-2 bg-green-500">
              Libres: {butacasLibres}
            </Badge>
            <Badge variant="default" className="px-4 py-2 bg-red-500">
              Ocupadas: {butacasOcupadas}
            </Badge>
          </div>

          {/* Indicadores de estado de las 3 funciones */}
          <div className="flex gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600 mr-2">Estado del concierto:</span>
            {TEATROS.map(teatro => {
              const butacasTeatro = teatro.key === "funcion1" ? butacasFuncion1 : 
                                   teatro.key === "funcion2" ? butacasFuncion2 : butacasFuncion3
              const ocupadas = butacasTeatro.filter(b => b.ocupada).length
              const total = butacasTeatro.length
              return (
                <Badge 
                  key={teatro.key} 
                  variant={teatro.key === teatroSeleccionado ? "default" : "secondary"}
                  className="px-2 py-1 text-xs"
                >
                  {teatro.label}: {ocupadas}/{total}
                </Badge>
              )
            })}
          </div>

          {/* Controles de selección múltiple */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={modoSeleccionMultiple ? "default" : "outline"}
              onClick={() => {
                setModoSeleccionMultiple(!modoSeleccionMultiple)
                setButacasSeleccionadas([])
              }}
            >
              {modoSeleccionMultiple ? "Cancelar Selección" : "Selección Múltiple"}
            </Button>

            {modoSeleccionMultiple && butacasSeleccionadas.length > 0 && (
              <>
                <Badge variant="secondary" className="px-3 py-1">
                  {butacasSeleccionadas.length} butacas seleccionadas
                </Badge>
                <Button onClick={abrirDialogoGrupo} size="sm">
                  Asignar Grupo
                </Button>
                <Button variant="outline" size="sm" onClick={() => setButacasSeleccionadas([])}>
                  Limpiar Selección
                </Button>
              </>
            )}
          </div>

          {/* Leyenda */}
          <div className="flex gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
              <span>Libre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
              <span>Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
              <span>Seleccionada</span>
            </div>
          </div>
        </div>

        {/* Área del Escenario */}
        <div className="mb-6">
          <div className="bg-gray-800 text-white text-center py-3 rounded-lg flex items-center justify-center gap-2 w-[30%] mx-auto">
            <Music className="w-5 h-5" />
            <span className="font-semibold">ESCENARIO - CONCERT UPSALA</span>
          </div>
        </div>

        {/* Renderizado condicional según función seleccionada */}
        {(
          mostrarListado ? (
            <div className="mt-8">
              {/* Listado de Asistentes */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Asistentes al Concert Upsala 2025
                  </CardTitle>
                  <CardDescription>Lista de invitados y sus butacas asignadas para el concierto</CardDescription>
                  <div className="mt-4">
                    <Label htmlFor="busqueda" className="text-sm font-medium">
                      Buscar por nombre o número de butaca
                    </Label>
                    <Input
                      id="busqueda"
                      type="text"
                      placeholder="Ej: Juan Pérez o 105"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="mt-1"
                    />
                    {busqueda && (
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">
                          {Object.keys(filtrarAsistentes()).length} resultado(s) encontrado(s)
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setBusqueda("")}>
                          Limpiar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {Object.keys(filtrarAsistentes()).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      {busqueda ? (
                        <div>
                          <p className="mb-2">No se encontraron resultados para "{busqueda}"</p>
                          <Button variant="outline" size="sm" onClick={() => setBusqueda("")}>
                            Ver todos los asistentes
                          </Button>
                        </div>
                      ) : (
                        <p>No hay butacas asignadas para esta función del concierto</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(filtrarAsistentes()).map(([nombre, butacasAsistente]) => (
                        <div key={nombre} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {busqueda ? (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: nombre.replace(
                                        new RegExp(`(${busqueda})`, "gi"),
                                        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>',
                                      ),
                                    }}
                                  />
                                ) : (
                                  nombre
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {butacasAsistente.length} butaca{butacasAsistente.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => liberarButacasAsistente(nombre)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Liberar Todas
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 mb-2">Butacas:</h4>
                              <div className="flex flex-wrap gap-1">
                                {butacasAsistente
                                  .sort((a, b) => a.id - b.id)
                                  .map((butaca) => (
                                    <Badge
                                      key={butaca.id}
                                      variant="secondary"
                                      className={`text-xs ${
                                        busqueda && butaca.id.toString().includes(busqueda.toLowerCase())
                                          ? "bg-yellow-200 border-yellow-300"
                                          : ""
                                      }`}
                                    >
                                      #{butaca.id} (F{butaca.fila})
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                            {butacasAsistente[0]?.notas && (
                              <div>
                                <h4 className="font-medium text-sm text-gray-700 mb-2">Notas:</h4>
                                <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                                  {butacasAsistente[0].notas}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            Secciones:{" "}
                            {[
                              ...new Set(butacasAsistente.map((b) => CONFIGURACION_TEATRO.secciones[b.seccion].nombre)),
                            ].join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Layout del Teatro */}
              <div className="relative bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-center mb-6">Distribución de Butacas - Concert Upsala 2025</h2>
                
                {/* Grid con las 4 secciones */}
                <div className="grid grid-cols-4 gap-8 justify-items-center">
                  {renderSeccion("izquierda", CONFIGURACION_TEATRO.secciones.izquierda)}
                  {renderSeccion("centro-izq", CONFIGURACION_TEATRO.secciones["centro-izq"])}
                  {renderSeccion("centro-der", CONFIGURACION_TEATRO.secciones["centro-der"])}
                  {renderSeccion("derecha", CONFIGURACION_TEATRO.secciones.derecha)}
                </div>
              </div>
            </div>
          )
        )}

        {/* Dialog para asignar/editar butaca */}
        <Dialog
          open={dialogoAbierto}
          onOpenChange={(open) => {
            if (!open) {
              if (butacasSeleccionadas.length > 0) {
                cerrarDialogoGrupo()
              } else {
                cerrarDialogo()
              }
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {butacasSeleccionadas.length > 0
                  ? `Asignar ${butacasSeleccionadas.length} butacas`
                  : `Butaca #${butacaSeleccionada?.id} - Fila ${butacaSeleccionada?.fila}`}
              </DialogTitle>
              <DialogDescription>
                {butacasSeleccionadas.length > 0 ? (
                  <>
                    Asignar las siguientes butacas a un asistente:
                    <span className="mt-2 text-sm">{butacasSeleccionadas.map((b) => `#${b.id}`).join(", ")}</span>
                  </>
                ) : (
                  <>
                    {butacaSeleccionada?.ocupada
                      ? "Editar o liberar esta butaca del concierto"
                      : "Asignar esta butaca para el concierto"}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Sección: {CONFIGURACION_TEATRO.secciones[butacaSeleccionada?.seccion || "izquierda"].nombre}
                    </span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del invitado al concierto</Label>
                <Input
                  id="nombre"
                  value={nombreAsistente}
                  onChange={(e) => setNombreAsistente(e.target.value)}
                  placeholder="Ingresa el nombre completo del invitado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notas"
                  value={notasAsistente}
                  onChange={(e) => setNotasAsistente(e.target.value)}
                  placeholder="Grado, relación con el colegio, contacto, etc."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              {butacasSeleccionadas.length > 0 ? (
                <>
                  <Button variant="outline" onClick={cerrarDialogoGrupo}>
                    Cancelar
                  </Button>
                  <Button onClick={asignarButacasGrupo} disabled={!nombreAsistente.trim()}>
                  Asignar {butacasSeleccionadas.length} Butacas
                </Button>
                </>
              ) : (
                <>
                  {butacaSeleccionada?.ocupada && (
                    <Button variant="destructive" onClick={liberarButaca}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Liberar
                    </Button>
                  )}
                  <Button variant="outline" onClick={cerrarDialogo}>
                    Cancelar
                  </Button>
                  <Button onClick={asignarButaca} disabled={!nombreAsistente.trim()}>
                    {butacaSeleccionada?.ocupada ? "Actualizar" : "Asignar"}
                  </Button>
                </>
              )}
            
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Créditos del desarrollador */}
      <footer className="text-center py-4 mt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Sistema desarrollado por Tomás Lonati para el Concert Upsala 2025
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Colegio Upsala - Gestión de Invitaciones
        </p>
      </footer>
    </div>
  )
}