import { Knex } from 'knex';

const productsData = [
    {
        nombre: 'iPhone 17 Pro Max',
        descripcion: 'El futuro de la telefonía móvil con el chip A19 Pro, pantalla de 6.9 pulgadas de bordes ultra finos, diseño exclusivo de triple cámara y marco de titanio pulido.',
        precio: 1499.99,
        imagen_url: 'iphone17promax.png',
        stock: 10,
        categoria: 'Celulares'
    },
    {
        nombre: 'iPhone 16 Pro Max',
        descripcion: 'Excelente rendimiento de cámara y batería con el chip A18 Pro, botón capacitivo de Control de Cámara y un zoom óptico mejorado.',
        precio: 1199.99,
        imagen_url: 'iphone16promax.png',
        stock: 15,
        categoria: 'Celulares'
    },
    {
        nombre: 'iPhone 15',
        descripcion: 'Con Isla Dinámica integrada, procesador A16 Bionic, cámara principal de 48 MP y un elegante acabado trasero de vidrio tintado en color rosa.',
        precio: 799.99,
        imagen_url: 'iphone15.png',
        stock: 20,
        categoria: 'Celulares'
    }
];

export async function seed(knex: Knex): Promise<void> {
    const TABLE_NAME = 'products';
    // Borra TODOS los registros existentes antes de insertar
    await knex(TABLE_NAME).del();
    // Inserta los nuevos datos
    await knex(TABLE_NAME).insert(productsData);
    console.log(`🚀 ${productsData.length} productos insertados en la tabla '${TABLE_NAME}'.`);
}
