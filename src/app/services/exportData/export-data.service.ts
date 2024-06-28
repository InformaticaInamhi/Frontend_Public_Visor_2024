import { Injectable } from "@angular/core";
import csvDownload from "json-to-csv-export";
@Injectable({
  providedIn: "root",
})
export class ExportDataService {
  constructor() {}

  exportCsvData(records: Record[]) {
    const resultMap = new Map<string, any>();

    records.forEach((record) => {
      const metricName = record.name.replace(/\s+/g, "_");
      record.data.forEach((dataPoint) => {
        if (!resultMap.has(dataPoint.fecha)) {
          resultMap.set(dataPoint.fecha, { fecha: dataPoint.fecha });
        }
        const entry = resultMap.get(dataPoint.fecha);
        entry[metricName] = dataPoint.valor;
      });
    });

    const allMetrics = records.map((record) =>
      record.name.replace(/\s+/g, "_")
    );
    resultMap.forEach((value) => {
      allMetrics.forEach((metric) => {
        if (value[metric] === undefined) {
          value[metric] = "";
        }
      });
    });
    this.exportToCsv(Array.from(resultMap.values()));
  }

  exportToCsv(data: any[]) {
    const options = {
      data: data,
      filename: "data_export",
      includeHeaders: true,
    };

    csvDownload(options);
  }
}

interface DataPoint {
  fecha: string;
  valor: number;
}

interface Record {
  name: string;
  data: DataPoint[];
  color: string;
}
