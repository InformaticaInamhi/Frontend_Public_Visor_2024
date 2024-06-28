declare const Plotly: any;
export const configGraphic = {
  editable: false,
  responsive: true,
  scrollZoom: true,
  toImageButtonOptions: {
    format: "png", // one of png, svg, jpeg, webp
    filename: "custom_image",
  },
  showLink: true,
  plotlyServerURL: "https://chart-studio.plotly.com",
  fileopt: "overwrite",

  
  modeBarButtonsToAdd: [
    {
      name: "solo linea",
      icon: Plotly.Icons["z-axis"],
      ascent: 100,
      transform: "matrix(1 0 0 -1 0 100)",
      click: function (gd: any) {
        Plotly.restyle(gd, "mode", "lines");
      },
    },
    {
      name: "linea+puntos",
      icon: Plotly.Icons["z-axis"],
      click: function (gd: any) {
        Plotly.restyle(gd, "mode", "lines+markers");
      },
    },
  ],
};
