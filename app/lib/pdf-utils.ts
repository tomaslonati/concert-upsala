// Utilidad para generar un PDF del listado de butacas usando jsPDF
// Import dinámico para compatibilidad Next.js SSR/CSR
import type { Butaca } from "./butaca.types"

export async function generarPDFButacas(butacas: Butaca[]) {
  const { default: jsPDF } = await import('jspdf')
  // @ts-ignore
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text("Listado de Asignación de Butacas", 14, 18)

  const cabecera = [
    "ID", "Fila", "Sección", "Ocupada", "Asignado", "Notas"
  ];
  const filas = butacas.map(b => [
    b.id,
    b.fila,
    b.seccion,
    b.ocupada ? "Sí" : "No",
    b.asignado || "-",
    b.notas || "-"
  ]);

  if (typeof autoTable === "function") {
    autoTable(doc, {
      head: [cabecera],
      body: filas,
      startY: 24,
      styles: { fontSize: 10 },
    });
  } else {
    // Fallback simple
    let y = 30;
    filas.forEach((row: (string | number)[]) => {
      doc.text(row.map(String).join(" | "), 14, y);
      y += 8;
    });
  }

  doc.save("listado_butacas.pdf");
}


