// Packages page functionality for Sanskruti Travels

let allPackages = [];
let filteredPackages = [];
let currentFilters = {
    category: '',
    budget: '',
    duration: '',
    search: '',
    sort: 'name'
};

// Initialize packages page
document.addEventListener('DOMContentLoaded', function() {
    initializePackagesPage();
});

async function initializePackagesPage() {
    try {
        // Show loading
        document.getElementById('loading').classList.remove('d-none');
        
        // Load packages data
        const response = await fetch('data/packages.json');
        if (!response.ok) {
            throw new Error('Failed to load packages data');
        }
        
        const data = await response.json();
        allPackages = data.packages;
        filteredPackages = [...allPackages];
        
        // Initialize filters and tabs
        initializeFilters();
        initializeTabs();
        
        // Apply URL filters if any
        applyUrlFilters();
        
        // Display packages
        displayPackages();
        
        // Hide loading
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('packagesContainer').classList.remove('d-none');
        
    } catch (error) {
        console.error('Error loading packages:', error);
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('noResults').classList.remove('d-none');
        document.getElementById('noResults').innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4>Failed to Load Packages</h4>
                <p class="text-muted">Unable to load travel packages. Please check your connection and try again.</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

function initializeFilters() {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', function() {
        currentFilters.category = this.value;
        applyFilters();
    });
    
    // Budget filter
    const budgetFilter = document.getElementById('budgetFilter');
    budgetFilter.addEventListener('change', function() {
        currentFilters.budget = this.value;
        applyFilters();
    });
    
    // Duration filter
    const durationFilter = document.getElementById('durationFilter');
    durationFilter.addEventListener('change', function() {
        currentFilters.duration = this.value;
        applyFilters();
    });
    
    // Search filter
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        currentFilters.search = this.value.toLowerCase();
        applyFilters();
    });
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    sortFilter.addEventListener('change', function() {
        currentFilters.sort = this.value;
        applyFilters();
    });
}

function initializeTabs() {
    const tabs = document.querySelectorAll('#packageTabs .nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Apply category filter
            const category = this.getAttribute('data-category');
            currentFilters.category = category === 'all' ? '' : category;
            
            // Update category select
            const categoryFilter = document.getElementById('categoryFilter');
            categoryFilter.value = currentFilters.category;
            
            applyFilters();
        });
    });
}

function applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Apply filters from URL
    const category = urlParams.get('category');
    const budget = urlParams.get('budget');
    const duration = urlParams.get('duration');
    const destination = urlParams.get('destination');
    
    if (category) {
        currentFilters.category = category;
        document.getElementById('categoryFilter').value = category;
        
        // Update active tab
        const categoryTab = document.querySelector(`[data-category="${category}"]`);
        if (categoryTab) {
            document.querySelectorAll('#packageTabs .nav-link').forEach(t => t.classList.remove('active'));
            categoryTab.classList.add('active');
        }
    }
    
    if (budget) {
        currentFilters.budget = budget;
        document.getElementById('budgetFilter').value = budget;
    }
    
    if (duration) {
        currentFilters.duration = duration;
        document.getElementById('durationFilter').value = duration;
    }
    
    if (destination) {
        currentFilters.search = destination.toLowerCase();
        document.getElementById('searchInput').value = destination;
    }
}

function applyFilters() {
    filteredPackages = allPackages.filter(package => {
        // Category filter
        if (currentFilters.category && package.category !== currentFilters.category) {
            return false;
        }
        
        // Budget filter
        if (currentFilters.budget) {
            const price = package.price;
            switch (currentFilters.budget) {
                case 'budget':
                    if (price >= 30000) return false;
                    break;
                case 'mid':
                    if (price < 30000 || price > 100000) return false;
                    break;
                case 'premium':
                    if (price < 100000 || price > 200000) return false;
                    break;
                case 'luxury':
                    if (price <= 200000) return false;
                    break;
            }
        }
        
        // Duration filter
        if (currentFilters.duration) {
            const durationNum = parseInt(package.duration.match(/\d+/)?.[0] || 0);
            switch (currentFilters.duration) {
                case 'short':
                    if (durationNum > 3) return false;
                    break;
                case 'medium':
                    if (durationNum < 4 || durationNum > 7) return false;
                    break;
                case 'long':
                    if (durationNum < 8) return false;
                    break;
            }
        }
        
        // Search filter
        if (currentFilters.search) {
            const searchText = currentFilters.search;
            return package.name.toLowerCase().includes(searchText) ||
                   package.location.toLowerCase().includes(searchText) ||
                   package.description.toLowerCase().includes(searchText) ||
                   (package.destinations && package.destinations.toLowerCase().includes(searchText));
        }
        
        return true;
    });
    
    // Sort packages
    sortPackages();
    
    // Display filtered packages
    displayPackages();
}

function sortPackages() {
    switch (currentFilters.sort) {
        case 'price-low':
            filteredPackages.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredPackages.sort((a, b) => b.price - a.price);
            break;
        case 'duration':
            filteredPackages.sort((a, b) => {
                const aDays = parseInt(a.duration.match(/\d+/)?.[0] || 0);
                const bDays = parseInt(b.duration.match(/\d+/)?.[0] || 0);
                return aDays - bDays;
            });
            break;
        case 'name':
        default:
            filteredPackages.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
}

function displayPackages() {
    const container = document.getElementById('packagesContainer');
    const noResults = document.getElementById('noResults');
    const packageCount = document.getElementById('packageCount');
    
    // Update package count
    packageCount.textContent = filteredPackages.length;
    
    if (filteredPackages.length === 0) {
        container.classList.add('d-none');
        noResults.classList.remove('d-none');
        return;
    }
    
    noResults.classList.add('d-none');
    container.classList.remove('d-none');
    
    // Generate package cards
    const packagesHTML = filteredPackages.map(package => {
        return window.SanskrutiTravels.createPackageCard(package);
    }).join('');
    
    container.innerHTML = packagesHTML;
    
    // Add animation to cards
    const cards = container.querySelectorAll('.package-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Global filter functions
function applyFiltersGlobal() {
    // Update current filters object
    currentFilters.category = document.getElementById('categoryFilter').value;
    currentFilters.budget = document.getElementById('budgetFilter').value;
    currentFilters.duration = document.getElementById('durationFilter').value;
    currentFilters.search = document.getElementById('searchInput').value.toLowerCase();
    currentFilters.sort = document.getElementById('sortFilter').value;
    
    // Apply filters
    applyFilters();
}

function clearFilters() {
    // Reset all filters
    currentFilters = {
        category: '',
        budget: '',
        duration: '',
        search: '',
        sort: 'name'
    };
    
    // Reset form elements
    document.getElementById('categoryFilter').value = '';
    document.getElementById('budgetFilter').value = '';
    document.getElementById('durationFilter').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('sortFilter').value = 'name';
    
    // Reset active tab to "All Packages"
    document.querySelectorAll('#packageTabs .nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('[data-category="all"]').classList.add('active');
    
    // Apply filters (which will show all packages)
    applyFilters();
    
    // Update URL
    window.history.pushState({}, '', window.location.pathname);
}

// Featured packages for homepage
function getFeaturedPackages(count = 6) {
    if (!allPackages.length) return [];
    
    // Get packages with high ratings and diverse categories
    const featured = allPackages
        .filter(p => p.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, count);
    
    return featured;
}

// Get packages by category
function getPackagesByCategory(category, count = 4) {
    if (!allPackages.length) return [];
    
    return allPackages
        .filter(p => p.category === category)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, count);
}

// Search functionality
function searchPackages(query) {
    if (!query) return allPackages;
    
    const searchTerm = query.toLowerCase();
    return allPackages.filter(package => {
        return package.name.toLowerCase().includes(searchTerm) ||
               package.location.toLowerCase().includes(searchTerm) ||
               package.description.toLowerCase().includes(searchTerm) ||
               package.destinations.toLowerCase().includes(searchTerm) ||
               package.category.toLowerCase().includes(searchTerm);
    });
}

// Package recommendation based on preferences
function getRecommendedPackages(preferences) {
    let recommended = [...allPackages];
    
    // Filter by budget
    if (preferences.budget) {
        recommended = recommended.filter(p => {
            switch (preferences.budget) {
                case 'budget': return p.price < 30000;
                case 'mid': return p.price >= 30000 && p.price <= 100000;
                case 'premium': return p.price > 100000 && p.price <= 200000;
                case 'luxury': return p.price > 200000;
                default: return true;
            }
        });
    }
    
    // Filter by category
    if (preferences.category) {
        recommended = recommended.filter(p => p.category === preferences.category);
    }
    
    // Filter by duration
    if (preferences.duration) {
        recommended = recommended.filter(p => {
            const duration = parseInt(p.duration);
            switch (preferences.duration) {
                case 'short': return duration <= 3;
                case 'medium': return duration >= 4 && duration <= 7;
                case 'long': return duration >= 8;
                default: return true;
            }
        });
    }
    
    // Sort by rating
    recommended.sort((a, b) => b.rating - a.rating);
    
    return recommended.slice(0, 6);
}

// Export functions for use in other files
window.PackagesAPI = {
    getAllPackages: () => allPackages,
    getFilteredPackages: () => filteredPackages,
    getFeaturedPackages,
    getPackagesByCategory,
    searchPackages,
    getRecommendedPackages,
    getPackageById: (id) => allPackages.find(p => p.id === id)
};
