const barcodeLinks = {
    "7591002000011": "https://dataprecio.com/?q=harina+pan+1+kg",
    "7591082000048": "https://dataprecio.com/?q=soda+puig",
    // Puedes añadir más códigos de barras y sus respectivos enlaces aquí
    // "código_de_barras": "url",
};

function startScanning() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#interactive'),
            constraints: {
                facingMode: "environment" // Usar la cámara trasera del dispositivo
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader"]
        }
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        const codigo = data.codeResult.code;
        document.getElementById('barcode').value = codigo;
        console.log("Código escaneado:", codigo);

        // Redirigir según el código de barras
        if (barcodeLinks[codigo]) {
            window.location.href = barcodeLinks[codigo]; // Redirigir a la URL correspondiente
        } else {
            alert("Código no reconocido. Intenta de nuevo."); // Mensaje si no hay enlace
        }

        Quagga.stop();
        document.getElementById('retry-btn').style.display = 'inline-block'; // Mostrar botón de reintentar
    });
}

// Iniciar el escáner al cargar la página
document.addEventListener('DOMContentLoaded', startScanning);

document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('barcode').value = ''; // Limpiar campo
    startScanning(); // Iniciar nuevo escaneo
});
