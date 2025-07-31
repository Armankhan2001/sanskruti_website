// Main JavaScript functionality for Sanskruti Travels

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSearchForm();
    initializeScrollEffects();
    initializeTooltips();
    
    // Check for URL parameters
    handleUrlParameters();
});

// Navigation functionality
function initializeNavigation() {
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile menu close on link click
    const mobileLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
}

// Search form functionality
function initializeSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSearch();
        });
    }
}

function handleSearch() {
    const destination = document.getElementById('destination')?.value;
    const budget = document.getElementById('budget')?.value;
    const duration = document.getElementById('duration')?.value;
    const month = document.getElementById('month')?.value;

    // Build query parameters
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (budget) params.append('budget', budget);
    if (duration) params.append('duration', duration);
    if (month) params.append('month', month);

    // Redirect to packages page with filters
    window.location.href = `packages.html?${params.toString()}`;
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fade in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .feature-box, .destination-card');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Handle URL parameters
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // If on packages page, apply filters from URL
    if (window.location.pathname.includes('packages.html')) {
        applyUrlFilters(urlParams);
    }
}

function applyUrlFilters(params) {
    // Apply category filter
    const category = params.get('category');
    if (category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
        }
        
        // Update active tab
        const categoryTab = document.querySelector(`[data-category="${category}"]`);
        if (categoryTab) {
            updateActiveTab(categoryTab);
        }
    }

    // Apply other filters
    const budget = params.get('budget');
    const duration = params.get('duration');
    const destination = params.get('destination');

    if (budget) {
        const budgetFilter = document.getElementById('budgetFilter');
        if (budgetFilter) budgetFilter.value = budget;
    }

    if (duration) {
        const durationFilter = document.getElementById('durationFilter');
        if (durationFilter) durationFilter.value = duration;
    }

    if (destination) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = destination;
    }
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price).replace('₹', '₹');
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function generateWhatsAppUrl(message, phone = '919820979944') {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
}

// Package card creation
function createPackageCard(package) {
    const hasOffer = package.originalPrice && package.originalPrice > package.price;
    const discountPercent = hasOffer ? Math.round(((package.originalPrice - package.price) / package.originalPrice) * 100) : 0;

    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card package-card h-100">
                ${hasOffer ? `<div class="package-badge"><span class="badge bg-danger">${discountPercent}% OFF</span></div>` : ''}
                <img src="${package.images[0]}" class="card-img-top" alt="${package.name}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${package.category.charAt(0).toUpperCase() + package.category.slice(1)}</span>
                        <div class="text-end">
                            <div class="text-warning">
                                ${generateStarRating(package.rating)}
                            </div>
                            <small class="text-muted">${package.rating}/5</small>
                        </div>
                    </div>
                    <h5 class="card-title">${package.name}</h5>
                    <p class="text-muted mb-2">
                        <i class="fas fa-map-marker-alt me-1"></i>${package.location}
                    </p>
                    <p class="card-text flex-grow-1">${package.description}</p>
                    <div class="package-details mb-3">
                        <small class="text-muted d-block">
                            <i class="fas fa-clock me-1"></i>${package.duration}
                        </small>
                        <small class="text-muted d-block">
                            <i class="fas fa-users me-1"></i>${package.groupSize}
                        </small>
                    </div>
                    <div class="pricing-section">
                        ${hasOffer ? `<span class="package-original-price">₹${package.originalPrice.toLocaleString()}</span>` : ''}
                        <span class="package-price">₹${package.price.toLocaleString()}</span>
                        <small class="text-muted">per person</small>
                    </div>
                    <div class="mt-3">
                        <a href="package-detail.html?id=${package.id}" class="btn btn-primary btn-sm me-2">View Details</a>
                        <a href="${generateWhatsAppUrl(`Hi! I'm interested in the ${package.name} package. Can you provide more details?`)}" 
                           target="_blank" class="btn btn-outline-success btn-sm">
                            <i class="fab fa-whatsapp me-1"></i>Inquire
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Tab functionality
function updateActiveTab(clickedTab) {
    // Remove active class from all tabs
    document.querySelectorAll('.nav-pills .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    clickedTab.classList.add('active');
}

// Loading states
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading packages...</p>
            </div>
        `;
    }
}

function hideLoading(containerId) {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.add('d-none');
    }
}

// Error handling
function showError(containerId, message = 'Something went wrong. Please try again.') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4>Oops!</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add CSS for scrolled navbar
const style = document.createElement('style');
style.textContent = `
    .navbar.scrolled {
        background-color: rgba(0, 102, 204, 0.95) !important;
        backdrop-filter: blur(10px);
    }
`;
document.head.appendChild(style);

// Itinerary sharing functionality
function getCurrentPackage() {
    // Get current package from global variable or parse from page
    return window.currentPackage || null;
}

function generateItineraryText(packageData) {
    if (!packageData) return '';
    
    let text = `🌟 ${packageData.name.toUpperCase()} 🌟\n`;
    text += `${packageData.duration}\n`;
    text += `Highlights\n\n`;
    
    // Basic Info
    text += `📍 Location: ${packageData.location}\n`;
    text += `⏰ Duration: ${packageData.duration}\n`;
    text += `👥 Group Size: ${packageData.groupSize || 'Flexible'}\n`;
    text += `⭐ Rating: ${packageData.rating}/5\n`;
    text += `💰 Price: ₹${packageData.price.toLocaleString()} per person\n`;
    if (packageData.originalPrice) {
        const savings = packageData.originalPrice - packageData.price;
        text += `💸 Original Price: ₹${packageData.originalPrice.toLocaleString()} (Save ₹${savings.toLocaleString()}!)\n`;
    }
    text += `\n📝 ${packageData.description}\n\n`;

    // Detailed Itinerary
    if (packageData.itinerary && packageData.itinerary.length > 0) {
        text += `🗓️ DETAILED ITINERARY\n\n`;
        packageData.itinerary.forEach(day => {
            text += `📅 Day ${day.day || day.title}\n`;
            if (day.hotel && day.hotel !== 'N/A') {
                text += `🏨 Hotel: ${day.hotel}\n`;
            }
            if (day.meals) {
                text += `🍽️ Meals: ${day.meals}\n`;
            }
            if (day.activities) {
                text += `🎯 Activities: ${day.activities}\n`;
            }
            text += `📝 ${day.description}\n\n`;
        });
    }
    
    if (packageData.inclusions && packageData.inclusions.length > 0) {
        text += `✅ INCLUSIONS:\n`;
        packageData.inclusions.forEach(inc => text += `• ${inc}\n`);
        text += '\n';
    }
    
    if (packageData.exclusions && packageData.exclusions.length > 0) {
        text += `❌ EXCLUSIONS:\n`;
        packageData.exclusions.forEach(exc => text += `• ${exc}\n`);
        text += '\n';
    }
    
    text += `📞 Book now: +91 70213 60582\n`;
    text += `🌐 Website: sanskrutitravels.com\n\n`;
    text += `#SanskrutiTravels #TravelPackage #${packageData.category.charAt(0).toUpperCase() + packageData.category.slice(1)}Tour`;
    
    return text;
}

function shareViaWhatsApp() {
    const package = getCurrentPackage();
    if (!package) return;
    
    const itinerary = generateItineraryText(package);
    const encodedText = encodeURIComponent(itinerary);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}

function shareViaEmail() {
    const package = getCurrentPackage();
    if (!package) return;
    
    const itinerary = generateItineraryText(package);
    const subject = encodeURIComponent(`${package.name} - Travel Package Details`);
    const body = encodeURIComponent(itinerary);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

function downloadItinerary() {
    const package = getCurrentPackage();
    if (!package) return;
    
    const itinerary = generateItineraryText(package);
    
    // Create HTML content for download
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${package.name} - Itinerary</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                .header { text-align: center; color: #0066cc; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .price { font-size: 1.2em; font-weight: bold; color: #ff6600; }
                .contact { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${package.name}</h1>
                <p>📞 +91 70213 60582 | 🌐 sanskrutitravels.com</p>
            </div>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${itinerary}</pre>
        </body>
        </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${package.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.html`;
    a.click();
    URL.revokeObjectURL(url);
}

function copyItinerary() {
    const package = getCurrentPackage();
    if (!package) return;
    
    const itinerary = generateItineraryText(package);
    
    navigator.clipboard.writeText(itinerary).then(() => {
        showNotification('Itinerary copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = itinerary;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Itinerary copied to clipboard!', 'success');
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; max-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Export functions for use in other files
window.SanskrutiTravels = {
    formatPrice,
    formatDate,
    generateWhatsAppUrl,
    createPackageCard,
    generateStarRating,
    updateActiveTab,
    showLoading,
    hideLoading,
    showError
};
