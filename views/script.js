document.addEventListener('DOMContentLoaded', function() {
    const fileSelect = document.getElementById('file-select');
    const fileName = document.getElementById('file-name');
    const codeForm = document.getElementById('code-form');
    const codeInput = document.getElementById('code-input');
    const cleanButton = document.getElementById('clean');
    const analyzedCode = document.getElementById('analyzed-code');
    const characters = document.getElementById('characters');
    const symbols = document.getElementById('symbols');
    const removeButton = document.getElementById('remove-file');

    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            removeButton.style.display = 'inline-flex';
        } else {
            fileName.textContent = 'Sin archivos seleccionados';
            removeButton.style.display = 'none';
        }
    });

    removeButton.addEventListener('click', function() {
        fileInput.value = '';
        fileName.textContent = 'Sin archivos seleccionados';
        removeButton.style.display = 'none';
    });

    codeForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
        const code = codeInput.value;
        analyzedCode.textContent = code;

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'code=' + encodeURIComponent(code)
        })
        .then(response => response.json())
        .then(data => {
            characters.innerHTML = '';
            symbols.innerHTML = '';
            data.tokens.forEach(token => {
                const characterEl = document.createElement('div');
                characterEl.textContent = token[0];
                characters.appendChild(characterEl);
                const symbolEl = document.createElement('div');
                symbolEl.textContent = token[1];
                symbols.appendChild(symbolEl);
            });
            if (data.tokens.length === 0) {
                characters.innerHTML = '<span class="no-tokens">No se han encontrado tokens</span>';
                symbols.innerHTML = '<span class="no-tokens">No se han encontrado tokens</span>';
            }
        })
        .catch(error => console.error(error));

        codeInput.value = '';
    });

    cleanButton.addEventListener('click', function() {
        codeInput.value = '';
        analyzedCode.textContent = 'No se ha ingresado código';
        characters.innerHTML = '<span class="no-tokens">No se han encontrado tokens</span>';
        symbols.innerHTML = '<span class="no-tokens">No se han encontrado tokens</span>';
        fileName.textContent = 'Sin archivos seleccionados';
        fileInput.value = '';
        removeButton.style.display = 'none';
    });
});