import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvExportService {
  exportCSV(
    combinedSeries: any[],
    selectedParams: any[],
    idEstacion: number
  ): void {
    if (!combinedSeries.length) {
      console.warn('⚠ No hay datos para exportar.');
      return;
    }

    // 1. Diccionario nemonico -> unidad
    const nemonicoUnidad: Record<string, string> = {};
    selectedParams.forEach((param: any) => {
      (param.params || []).forEach((p: any) => {
        nemonicoUnidad[p.nemonico] = p.simbolo_unidad || '';
      });
    });

    // 2. Recolectar todas las fechas
    const fechasSet = new Set<string>();
    combinedSeries.forEach((serie) => {
      serie.data.forEach((p: any) => fechasSet.add(p.fecha_toma_dato));
    });
    const fechas = Array.from(fechasSet).sort();

    // 3. Recolectar nemónicos
    const nemonicos = combinedSeries.map((s) => s.nemonico);

    // 4. Cabecera con unidades
    const header = [
      'fecha_toma_dato',
      ...nemonicos.map(
        (n) => `${n}${nemonicoUnidad[n] ? `(${nemonicoUnidad[n]})` : ''}`
      ),
    ];
    const rows: string[] = [];
    rows.push(header.join(','));

    // 5. Crear mapa de valores
    const seriesMap: Record<string, Map<string, number>> = {};
    combinedSeries.forEach((serie) => {
      seriesMap[serie.nemonico] = new Map(
        serie.data.map((p: any) => [p.fecha_toma_dato, p.valor])
      );
    });

    // 6. Construir filas
    fechas.forEach((fecha) => {
      const valores = nemonicos.map((nem) => {
        const val = seriesMap[nem].get(fecha);
        return val !== undefined ? val : 'null';
      });
      rows.push([fecha, ...valores].join(','));
    });

    // 7. Crear archivo con BOM UTF-8
    const csvContent = '\uFEFF' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${idEstacion}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
