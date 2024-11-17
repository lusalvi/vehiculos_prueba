const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Supabase
const supabaseUrl = 'https://zzrwbmjibthoglzdqsbt.supabase.co';
const supabaseKey =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cndibWppYnRob2dsemRxc2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3OTg0OTcsImV4cCI6MjA0NzM3NDQ5N30.adTAcVy-63gaXhlFl3UkktOisTNHflnxP2x-Bczk_o8';
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
