const barcodeLinks = {
    "7591002000011": "https://dataprecio.com/?q=harina+pan+1+kg",
    "7591082000048": "https://dataprecio.com/?q=soda+puig",
    "7591082010047": "https://dataprecio.com/?q=soda+puig",
    
    // Agrega más códigos de barras y enlaces aquí
};

let isScanning = false; // Controla el estado de escaneo

function startScanning() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#interactive'),
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader"],
            multiple: false // Asegura que no se detecten múltiples códigos a la vez
        }
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        if (isScanning) return; // Si ya se está escaneando, no hacer nada
        isScanning = true; // Cambiar estado de escaneo

        const codigo = data.codeResult.code;

        // Comprobar si el código es válido
        if (barcodeLinks[codigo]) {
            const link = barcodeLinks[codigo];
            document.getElementById('barcode').value = codigo;
            document.getElementById('result-iframe').src = link; // Actualizar el src del iframe
            document.getElementById('result-container').style.display = 'block'; // Mostrar el contenedor del iframe
        } else {
            // Manejo de errores si el código no es reconocido
            alert("Código no reconocido. Intenta de nuevo.");
        }

        // Detener el escáner y permitir un nuevo escaneo después de un breve retraso
        setTimeout(() => {
            Quagga.stop();
            isScanning = false; // Restablecer el estado de escaneo
            document.getElementById('retry-btn').style.display = 'inline-block'; // Mostrar botón de reintentar
        }, 1500); // Tiempo de espera antes de reiniciar el escáner
    });
}

// Iniciar el escáner al cargar la página
document.addEventListener('DOMContentLoaded', startScanning);

document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('barcode').value = ''; // Limpiar campo
    document.getElementById('result-container').style.display = 'none'; // Ocultar el iframe
    startScanning(); // Iniciar nuevo escaneo
});
