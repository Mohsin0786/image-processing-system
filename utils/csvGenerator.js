const generateCSV = (processingRequest) => {
    const header = 'S. No.,Product Name,Input Image Urls,Output Image Urls\n';
    const rows = processingRequest.products.map((product, index) => {
      const inputUrls = product.inputImages.map(image => image.url).join(',');
      const outputUrls = product.outputImages.map(image => image.url).join(',');
      return `${index + 1},${product.productName},"${inputUrls}","${outputUrls}"`;
    }).join('\n');
  
    return header + rows;
  };

  module.exports = generateCSV