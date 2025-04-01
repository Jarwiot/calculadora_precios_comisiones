document.getElementById('quoteForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Obtener valores del formulario
    const basePriceInput = document.getElementById('basePrice').value;
    const type = document.getElementById('type').value;
    const detail = document.getElementById('detail').value;
    const characters = parseInt(document.getElementById('characters').value);
    const background = document.getElementById('background').value;
    const rights = document.getElementById('rights').value;
    const urgency = document.getElementById('urgency').value === 'true';
  
    // Si el usuario no ingresa un precio base, calcularlo automáticamente
    let basePrice = parseFloat(basePriceInput) || 0;
  
    if (basePrice === 0) {
      // Calcular precio base automáticamente
      if (type === 'retrato') basePrice = 500;
      if (type === 'personaje') basePrice = 800;
      if (type === 'fondo') basePrice = 600;
      if (type === 'concept_art') basePrice = 1000;
    }
  
    // Ajustar por detalle
    if (detail === 'medio') basePrice *= 1.5;
    if (detail === 'complejo') basePrice *= 2;
  
    // Ajustar por número de personajes
    basePrice += (characters - 1) * 200;
  
    // Ajustar por fondo
    if (background === 'detallado') basePrice += 300;
  
    // Ajustar por derechos de uso
    if (rights === 'false') {
      basePrice *= 0.9; // 10% de descuento
    } else if (rights === 'comercial') {
      basePrice *= 1.2;
    } else if (rights === 'exclusivo') {
      basePrice *= 1.5;
    }
  
    // Ajustar por urgencia
    if (urgency) basePrice *= 1.3;
  
    // Mostrar resultado con animación
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('show');
    setTimeout(() => {
      resultDiv.textContent = `Precio estimado: $${basePrice.toFixed(2)} MXN`;
      resultDiv.classList.add('show');
    }, 100);
  });
  