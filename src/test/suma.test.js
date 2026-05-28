// Prueba real


const sum = require('./suma'); // Importamos la funcion que queremos probar

test("La funcion suma debe devolver suma correcta", () => { // Definimos una prueba con el nombre "La funcion suma debe devolver suma correcta"
    expect(sum(1, 2)).toBe(3); // Esperamos que la funcion sum(1, 2) retorne 3
});