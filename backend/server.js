const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rutas
app.get('/api/vehiculos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('vehiculos')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (error) {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
