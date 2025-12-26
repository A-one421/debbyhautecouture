// Size Chart Data for all products
const sizeChartData = {
    // Product 1: Midnight Elegance Gown
    1: {
        XS: { bust: 32, waist: 24, hips: 35, length: 58, shoulder: 14 },
        S: { bust: 34, waist: 26, hips: 37, length: 59, shoulder: 14.5 },
        M: { bust: 36, waist: 28, hips: 39, length: 60, shoulder: 15 },
        L: { bust: 38, waist: 30, hips: 41, length: 61, shoulder: 15.5 },
        XL: { bust: 40, waist: 32, hips: 43, length: 62, shoulder: 16 }
    },
    // Product 2: Golden Hour Dress
    2: {
        XS: { bust: 31, waist: 23, hips: 34, length: 56, shoulder: 13.5 },
        S: { bust: 33, waist: 25, hips: 36, length: 57, shoulder: 14 },
        M: { bust: 35, waist: 27, hips: 38, length: 58, shoulder: 14.5 },
        L: { bust: 37, waist: 29, hips: 40, length: 59, shoulder: 15 }
    },
    // Product 3: Urban Chic Ensemble
    3: {
        S: { bust: 34, waist: 26, hips: 37, length: 45, shoulder: 14.5 },
        M: { bust: 36, waist: 28, hips: 39, length: 46, shoulder: 15 },
        L: { bust: 38, waist: 30, hips: 41, length: 47, shoulder: 15.5 },
        XL: { bust: 40, waist: 32, hips: 43, length: 48, shoulder: 16 }
    },
    // Product 4: Champagne Dreams Gown
    4: {
        XS: { bust: 32, waist: 24, hips: 35, length: 62, shoulder: 14 },
        S: { bust: 34, waist: 26, hips: 37, length: 63, shoulder: 14.5 },
        M: { bust: 36, waist: 28, hips: 39, length: 64, shoulder: 15 },
        L: { bust: 38, waist: 30, hips: 41, length: 65, shoulder: 15.5 }
    },
    // Product 5: Pearl White Couture
    5: {
        XS: { bust: 31, waist: 23, hips: 34, length: 52, shoulder: 13.5 },
        S: { bust: 33, waist: 25, hips: 36, length: 53, shoulder: 14 },
        M: { bust: 35, waist: 27, hips: 38, length: 54, shoulder: 14.5 },
        L: { bust: 37, waist: 29, hips: 40, length: 55, shoulder: 15 },
        XL: { bust: 39, waist: 31, hips: 42, length: 56, shoulder: 15.5 }
    },
    // Product 6: Executive Power Suit
    6: {
        S: { bust: 34, waist: 26, hips: 37, length: 42, shoulder: 14.5 },
        M: { bust: 36, waist: 28, hips: 39, length: 43, shoulder: 15 },
        L: { bust: 38, waist: 30, hips: 41, length: 44, shoulder: 15.5 },
        XL: { bust: 40, waist: 32, hips: 43, length: 45, shoulder: 16 }
    },
    // Product 7: Sunset Boulevard Dress
    7: {
        XS: { bust: 31, waist: 23, hips: 34, length: 54, shoulder: 13.5 },
        S: { bust: 33, waist: 25, hips: 36, length: 55, shoulder: 14 },
        M: { bust: 35, waist: 27, hips: 38, length: 56, shoulder: 14.5 },
        L: { bust: 37, waist: 29, hips: 40, length: 57, shoulder: 15 }
    },
    // Product 8: Royal Affair Gown
    8: {
        XS: { bust: 32, waist: 24, hips: 35, length: 64, shoulder: 14 },
        S: { bust: 34, waist: 26, hips: 37, length: 65, shoulder: 14.5 },
        M: { bust: 36, waist: 28, hips: 39, length: 66, shoulder: 15 },
        L: { bust: 38, waist: 30, hips: 41, length: 67, shoulder: 15.5 },
        XL: { bust: 40, waist: 32, hips: 43, length: 68, shoulder: 16 }
    }
};

// Product catalog
const products = [
    { id: 1, name: 'Midnight Elegance Gown', price: 48000, image: 'img6.jpg', category: 'evening', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 2, name: 'Golden Hour Dress', price: 39000, image: 'img1.jpg', category: 'evening', sizes: ['XS', 'S', 'M', 'L'] },
    { id: 3, name: 'Urban Chic Ensemble', price: 34000, image: 'img2.jpg', category: 'casual', sizes: ['S', 'M', 'L', 'XL'] },
    { id: 4, name: 'Champagne Dreams Gown', price: 55000, image: 'img5.jpg', category: 'evening', sizes: ['XS', 'S', 'M', 'L'] },
    { id: 5, name: 'Pearl White Couture', price: 37000, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', category: 'casual', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
    { id: 6, name: 'Executive Power Suit', price: 44000, image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800', category: 'corporate', sizes: ['S', 'M', 'L', 'XL'] },
    { id: 7, name: 'Sunset Boulevard Dress', price: 38000, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', category: 'casual', sizes: ['XS', 'S', 'M', 'L'] },
    { id: 8, name: 'Royal Affair Gown', price: 62000, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', category: 'evening', sizes: ['XS', 'S', 'M', 'L', 'XL'] }
];

// Get product by ID
function getProductById(productId) {
    return products.find(product => product.id === productId) || products[0];
}

// Get size chart for product
function getSizeChart(productId) {
    return sizeChartData[productId] || sizeChartData[1];
}

// Convert inches to cm
function inchesToCm(inches) {
    return Math.round(inches * 2.54 * 10) / 10;
}

// Get measurement value based on unit
function getMeasurementValue(productId, size, measurement, unit = 'inches') {
    const chart = getSizeChart(productId);
    const value = chart[size]?.[measurement];
    
    if (!value) return 'N/A';
    
    if (unit === 'cm') {
        return `${inchesToCm(value)} cm`;
    }
    
    return `${value} in`;
}

// Get model height for size
function getModelHeightForSize(size) {
    const heights = {
        'XS': '5\'2" - 5\'4"',
        'S': '5\'4" - 5\'6"',
        'M': '5\'6" - 5\'8"',
        'L': '5\'8" - 5\'10"',
        'XL': '5\'10" - 6\'0"'
    };
    return heights[size] || '5\'6" - 5\'8"';
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sizeChartData,
        products,
        getProductById,
        getSizeChart,
        inchesToCm,
        getMeasurementValue,
        getModelHeightForSize
    };
}