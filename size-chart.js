// Size Chart Application
const sizeChartApp = {
    // State
    currentProduct: null,
    selectedSize: null,
    measurementUnit: 'inches',
    quantity: 1,
    
    // Initialize
    init() {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('product')) || 1;
        
        // Set current product
        this.currentProduct = getProductById(productId);
        this.selectedSize = this.currentProduct.sizes[0];
        
        // Update page title
        document.title = `DEBBY HAUTE COUTURE - ${this.currentProduct.name} - Size Chart`;
    },
    
    // Select size
    selectSize(size) {
        this.selectedSize = size;
        
        // Smooth scroll to measurements section
        const measurementsSection = document.querySelector('[x-show="selectedSize"]');
        if (measurementsSection) {
            measurementsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },
    
    // Toggle measurement unit
    toggleMeasurementUnit() {
        this.measurementUnit = this.measurementUnit === 'inches' ? 'cm' : 'inches';
    },
    
    // Get measurement with unit
    getMeasurement(productId, size, measurement) {
        return getMeasurementValue(productId, size, measurement, this.measurementUnit);
    },
    
    // Get model height
    getModelHeight(size) {
        return getModelHeightForSize(size);
    },
    
    // Add to cart
    addToCart() {
        if (!this.selectedSize) {
            alert('Please select a size first');
            return;
        }
        
        // In a real application, you would add to cart here
        // For now, we'll redirect to main site with cart parameters
        const cartItem = {
            productId: this.currentProduct.id,
            size: this.selectedSize,
            quantity: this.quantity
        };
        
        // Store in localStorage for main site to pick up
        localStorage.setItem('pendingCartItem', JSON.stringify(cartItem));
        
        // Redirect to main site
        window.location.href = 'index.html#cart';
    },
    
    // WhatsApp order
    whatsappOrder() {
        if (!this.selectedSize) {
            alert('Please select a size first');
            return;
        }
        
        const message = `Hello DEBBY HAUTE COUTURE! I want to order:\n\n` +
                       `Product: ${this.currentProduct.name}\n` +
                       `Size: ${this.selectedSize}\n` +
                       `Quantity: ${this.quantity}\n` +
                       `Price: ₦${this.currentProduct.price.toLocaleString()}\n` +
                       `Total: ₦${(this.currentProduct.price * this.quantity).toLocaleString()}\n\n` +
                       `Please proceed with my order.`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = '2348066163249'; // Replace with your WhatsApp number
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    },
    
    // Increase quantity
    increaseQuantity() {
        this.quantity++;
    },
    
    // Decrease quantity
    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    sizeChartApp.init();
    
    // Make app available globally for Alpine.js
    window.sizeChartApp = sizeChartApp;
    
    // Set up Alpine.js data
    document.body.setAttribute('x-data', 'sizeChartApp');
});

// Utility function to open size chart from main site
function openSizeChart(productId) {
    // Store product in localStorage for size chart page
    localStorage.setItem('selectedProduct', productId);
    
    // Redirect to size chart page
    window.location.href = `size-chart.html?product=${productId}`;
}