const downloadFile = ({ data, defaultFileName, type, extension }) => {
  return new Promise(async (resolve) => {
    try {
      const url = window.URL.createObjectURL(new Blob([data]), { type });
      const link = document.createElement("a");

      const fileName = defaultFileName;
      link.href = url;
      link.setAttribute("download", `${fileName}.${extension}`);
      document.body.appendChild(link);

      link.click();
      link.remove();

      resolve({ success: true, fileName });
    } catch (error) {
      resolve({ success: false });
    }
  });
};

export default downloadFile;
