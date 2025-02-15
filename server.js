const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static('public'));
app.use('/data', express.static('data'));

// Endpoint para obtener la lista de imágenes de un campamento
app.get('/api/campamento-imagenes/:id', async (req, res) => {
  try {
    const campId = String(req.params.id).padStart(3, '0');
    const dirPath = path.join(__dirname, 'data', 'fotos_stl', `id_${campId}`);
    
    // Verificar si el directorio existe
    if (!await fs.pathExists(dirPath)) {
      return res.json({ images: [] });
    }

    // Obtener lista de archivos
    const files = await fs.readdir(dirPath);
    
    // Filtrar solo archivos de imagen
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    // Construir URLs completas
    const images = imageFiles.map(file => 
      `data/fotos_stl/id_${campId}/${file}`
    );

    res.json({ images });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ error: 'Error al obtener las imágenes' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 