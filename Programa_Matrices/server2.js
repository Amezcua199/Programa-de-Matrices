const express = require('express');
const cors = require('cors');
const math = require('mathjs');
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Función para calcular la matriz de cofactores
function cofactorMatrix(matrix) {
    const size = matrix.length;
    const cofactors = [];

    for (let i = 0; i < size; i++) {
        cofactors[i] = [];
        for (let j = 0; j < size; j++) {
            const submatrix = matrix.filter((row, rowIndex) => rowIndex !== i).map(row => row.filter((_, colIndex) => colIndex !== j));
            const cofactor = Math.pow(-1, i + j) * math.det(submatrix);
            cofactors[i][j] = cofactor;
        }
    }

    return cofactors;
}

// Ruta para resolver sistemas de ecuaciones
app.post('/api/solve-equations', (req, res) => {
    const { coefficients, constants } = req.body;

    // Verifica que los datos sean válidos
    if (!coefficients || !constants || coefficients.length !== constants.length) {
        return res.status(400).json({ error: 'Datos no válidos para resolver el sistema.' });
    }

    try {
        const A = math.matrix(coefficients);
        const b = math.matrix(constants);
        const A_inv = math.inv(A);
        const solution = math.multiply(A_inv, b);
        const roundedSolution = solution.toArray().map(value => math.round(value, 2));
        res.json({ solution: roundedSolution });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo resolver el sistema. Verifica que la matriz sea invertible.' });
    }
});

// Ruta para calcular el determinante
app.post('/api/determinant', (req, res) => {
    const { matrix } = req.body;

    // Verifica que la matriz sea cuadrada
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0 || !matrix.every(row => Array.isArray(row) && row.length === matrix.length)) {
        return res.status(400).json({ error: 'La matriz debe ser cuadrada (NxN).' });
    }

    try {
        const determinant = math.det(matrix);
        res.json({ determinant });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo calcular el determinante. Verifica que la matriz sea válida.' });
    }
});

// Ruta para calcular la matriz de cofactores
app.post('/api/cofactors', (req, res) => {
    const { matrix } = req.body;

    // Verifica que la matriz sea cuadrada
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0 || !matrix.every(row => Array.isArray(row) && row.length === matrix.length)) {
        return res.status(400).json({ error: 'La matriz debe ser cuadrada (NxN).' });
    }

    try {
        const cofactors = cofactorMatrix(matrix);
        res.json({ cofactors });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo calcular la matriz de cofactores. Verifica que la matriz sea válida.' });
    }
});

// Ruta para calcular la matriz adjunta
app.post('/api/adjoint', (req, res) => {
    const { matrix } = req.body;

    // Verifica que la matriz sea cuadrada
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0 || !matrix.every(row => Array.isArray(row) && row.length === matrix.length)) {
        return res.status(400).json({ error: 'La matriz debe ser cuadrada (NxN).' });
    }

    try {
        const cofactors = cofactorMatrix(matrix);
        const adjoint = math.transpose(cofactors);
        res.json({ adjoint });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo calcular la matriz adjunta. Verifica que la matriz sea válida.' });
    }
});

// Ruta para generar la matriz de identidad
app.post('/api/identity', (req, res) => {
    const { size } = req.body;

    // Verifica que el tamaño sea válido
    if (!size || typeof size !== 'number' || size <= 0) {
        return res.status(400).json({ error: 'El tamaño debe ser un número positivo.' });
    }

    try {
        const identityMatrix = math.identity(size);
        res.json({ identityMatrix });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo generar la matriz de identidad.' });
    }
});

// Ruta para calcular la matriz inversa
app.post('/api/inverse', (req, res) => {
    const { matrix } = req.body;

    // Verifica que la matriz sea cuadrada
    if (!matrix || !Array.isArray(matrix) || matrix.length === 0 || !matrix.every(row => Array.isArray(row) && row.length === matrix.length)) {
        return res.status(400).json({ error: 'La matriz debe ser cuadrada (NxN).' });
    }

    try {
        const inverse = math.inv(matrix);
        res.json({ inverse });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo calcular la matriz inversa. Verifica que la matriz sea invertible.' });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});