const API_URL = 'TU_URL_DE_RENDER'; // Esto lo cambiaremos cuando tengamos el backend desplegado

document.getElementById('vehicleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const vehicleData = {
        patente: document.getElementById('patente').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value
    };

    try {
        const response = await fetch(`${API_URL}/api/vehiculos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vehicleData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.mensaje || 'Error al guardar el vehículo');
        }

        alert('Vehículo guardado exitosamente!');
        this.reset();
    } catch (error) {
        alert('Error: ' + error.message);
        console.error('Error:', error);
    }
});