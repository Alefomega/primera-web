// app.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. Inicializar Supabase
export const supabase = createClient(
    'https://wmrxcnnehjjslyqtcogq.supabase.co',
    'sb_publishable_rbrk7RzRx6Z-1i0f0IFrGQ_HW3Twqqn'
);

// 2. Función para agregar fila a la tabla
export async function agregarMensaje(texto) {
    if (!texto) return;

    const { data, error } = await supabase
        .from('Aprendiendo')
        .insert([{ text: texto }]);  // Inserta nueva fila

    if (error) console.error("Error agregando mensaje:", error);
    return data;
}

// 3. Función para obtener todas las filas
export async function obtenerMensajes() {
    const { data, error } = await supabase
        .from('Aprendiendo')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error al obtener mensajes:", error);
        return [];
    }

    return data;
}
