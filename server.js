const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Supabase desde variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno para Supabase');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);


// Rutas
app.get('/api/vehiculos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('vehiculos')
            .select('*');

        if (error) {
            console.error('Error al conectar con Supabase:', error);
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error('Error detallado:', error.message);
        res.status(500).json({ mensaje: 'Error al obtener vehículos', error: error.message });
    }
});


app.post('/api/vehiculos', async (req, res) => {
    try {
        const { patente, marca, modelo } = req.body;

        // Verificar si la patente ya existe
        const { data: existente } = await supabase
            .from('vehiculos')
            .select('patente')
            .eq('patente', patente)
            .single();

        if (existente) {
            return res.status(400).json({ mensaje: 'La patente ya está registrada' });
        }

        const { data, error } = await supabase
            .from('vehiculos')
            .insert([{ patente, marca, modelo }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar vehículo', error: error.message });
    }
});

// Nueva ruta para eliminar vehículo por patente
app.delete('/api/vehiculos/:patente', async (req, res) => {
    try {
        const { patente } = req.params;

        const { error } = await supabase
            .from('vehiculos')
            .delete()
            .eq('patente', patente);

        if (error) throw error;

        res.json({ mensaje: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar vehículo', error: error.message });
    }
});

//Nueva ruta para actualizar vehículo por patente
app.put('/api/vehiculos/:patente', async (req, res) => {
    try {
        const { patente } = req.params;
        const { marca, modelo } = req.body;

        // Verificar si la patente existe
        const { data: existente } = await supabase
            .from('vehiculos')
            .select('patente')
            .eq('patente', patente)
            .single();

        if (!existente) {
            return res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }

        const { data, error } = await supabase
            .from('vehiculos')
            .update({ marca, modelo })
            .eq('patente', patente)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar vehículo', error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});