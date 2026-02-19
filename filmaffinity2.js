// Elementos del DOM
const inputBusqueda = document.getElementById('busqueda');
const btnBuscar = document.getElementById('btnBuscar');
const divResultado = document.getElementById('resultado');
const divResultadoLista = document.getElementById('resultadoLista');
const divDebug = document.getElementById('debug');
const divHtmlCrudo = document.getElementById('htmlCrudo');

// Event listeners
btnBuscar.addEventListener('click', buscar);
inputBusqueda.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscar();
});

async function buscar() {
    const termino = inputBusqueda.value.trim();

    if (!termino) {
        divResultado.style.display = 'none';
        divDebug.style.display = 'none';
        return;
    }

    // Mostrar loading
    divResultadoLista.innerHTML = '<p>Cargando...</p>';
    divResultado.style.display = 'block';
    divDebug.style.display = 'none';

    try {
        const res = await fetch(`/api/filmaffinity-search?stext=${encodeURIComponent(termino)}`);
        const data = await res.json();

        if (data.error) {
            divResultadoLista.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
            divDebug.style.display = 'block';
            divHtmlCrudo.textContent = data.htmlCrudo || 'Sin HTML disponible';
            return;
        }

        // Mostrar resultados depurados
        if (data.resultados && data.resultados.length > 0) {
            divResultadoLista.innerHTML = data.resultados.map((r, i) => `
                <div class="resultado-item">
                    <strong>${i + 1}. ${r.titulo}</strong>
                    ${r.ano ? `<p>Año: ${r.ano}</p>` : ''}
                    ${r.nota ? `<p>Nota: ${r.nota}</p>` : ''}
                    ${r.url ? `<p><a href="${r.url}" target="_blank">Ver en FilmAffinity</a></p>` : ''}
                </div>
            `).join('');
        } else {
            divResultadoLista.innerHTML = '<p>No se encontraron resultados.</p>';
        }

        // Mostrar debug
        divDebug.style.display = 'block';
        divHtmlCrudo.textContent = data.htmlCrudo ? data.htmlCrudo.substring(0, 5000) : 'Sin HTML disponible';

    } catch (e) {
        divResultadoLista.innerHTML = `<p style="color: red;">Error de red: ${e.message}</p>`;
        divDebug.style.display = 'block';
    }
}
