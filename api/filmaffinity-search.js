// api/filmaffinity-search.js
export default async function handler(req, res) {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Falta el parámetro q' });
    }

    try {
        const url = `https://www.filmaffinity.com/es/search.php?stype=title&stext=${encodeURIComponent(q)}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Filmaffinity respondió con error ${response.status}` });
        }

        const html = await response.text();

        // Extraer bloques de cada resultado
        const bloques = html.match(/<div[^>]*class="[^"]*se-it[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];

        const resultados = bloques.slice(0, 10).map(bloque => {
            const titulo = extraer(bloque, /<div[^>]*class="[^"]*mc-title[^"]*"[^>]*>.*?<a[^>]*>(.*?)<\/a>/s);
            const anio = extraer(bloque, /<div[^>]*class="[^"]*ye-w[^"]*"[^>]*>(.*?)<\/div>/s);
            const director = extraer(bloque, /<div[^>]*class="[^"]*mc-director[^"]*"[^>]*>.*?<span[^>]*>(.*?)<\/span>/s);

            return {
                titulo: limpiar(titulo),
                anio: limpiar(anio),
                director: limpiar(director),
            };
        }).filter(r => r.titulo); // filtrar resultados vacíos

        return res.status(200).json({ resultados });

    } catch (error) {
        return res.status(500).json({ error: 'Error al hacer fetch a filmaffinity', detalle: error.message });
    }
}

function extraer(html, regex) {
    const match = html.match(regex);
    return match ? match[1] : null;
}

function limpiar(texto) {
    if (!texto) return null;
    return texto.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}