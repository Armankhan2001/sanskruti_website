// Admin functionality for Sanskruti Travels
let allPackages = [];
let currentEditId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadPackages();
    initializeGitHubInstructions();
});

async function loadPackages() {
    try {
        const response = await fetch('data/packages.json');
        const data = await response.json();
        allPackages = data.packages || [];
        displayPackagesTable();
    } catch (error) {
        console.error('Error loading packages:', error);
        // Initialize with empty array if file doesn't exist
        allPackages = [];
        displayPackagesTable();
    }
}

function displayPackagesTable() {
    const tbody = document.getElementById('packagesTableBody');
    tbody.innerHTML = '';

    allPackages.forEach(package => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${package.name}</strong><br>
                <small class="text-muted">${package.id}</small>
            </td>
            <td><span class="badge bg-primary">${package.category}</span></td>
            <td>${package.location}</td>
            <td>
                ${package.originalPrice ? `<span class="text-decoration-line-through text-muted">₹${package.originalPrice.toLocaleString()}</span><br>` : ''}
                <strong>₹${package.price.toLocaleString()}</strong>
            </td>
            <td>${package.duration}</td>
            <td>
                <div class="text-warning">${generateStarRating(package.rating)}</div>
                <small>${package.rating}/5</small>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editPackage('${package.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="sharePackage('${package.id}')">
                    <i class="fas fa-share"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deletePackage('${package.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
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

function showAddPackageModal() {
    currentEditId = null;
    document.getElementById('packageModalTitle').textContent = 'Add New Package';
    document.getElementById('packageForm').reset();
    document.getElementById('packageId').value = '';
    const modal = new bootstrap.Modal(document.getElementById('packageModal'));
    modal.show();
}

function editPackage(id) {
    const package = allPackages.find(p => p.id === id);
    if (!package) return;

    currentEditId = id;
    document.getElementById('packageModalTitle').textContent = 'Edit Package';
    
    // Fill form with package data
    document.getElementById('packageId').value = package.id;
    document.getElementById('packageName').value = package.name;
    document.getElementById('packageCategory').value = package.category;
    document.getElementById('packageLocation').value = package.location;
    document.getElementById('packageDestinations').value = package.destinations || '';
    document.getElementById('packagePrice').value = package.price;
    document.getElementById('packageOriginalPrice').value = package.originalPrice || '';
    document.getElementById('packageDuration').value = package.duration;
    document.getElementById('packageGroupSize').value = package.groupSize || '';
    document.getElementById('packageRating').value = package.rating;
    document.getElementById('packageDescription').value = package.description;
    document.getElementById('packageImages').value = package.images ? package.images.join('\n') : '';
    document.getElementById('packageInclusions').value = package.inclusions ? package.inclusions.join('\n') : '';
    document.getElementById('packageExclusions').value = package.exclusions ? package.exclusions.join('\n') : '';
    document.getElementById('packageItineraryJson').value = package.itinerary ? JSON.stringify(package.itinerary, null, 2) : '';

    const modal = new bootstrap.Modal(document.getElementById('packageModal'));
    modal.show();
}

function savePackage() {
    const form = document.getElementById('packageForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = {
        id: document.getElementById('packageId').value || generatePackageId(),
        name: document.getElementById('packageName').value,
        category: document.getElementById('packageCategory').value,
        location: document.getElementById('packageLocation').value,
        destinations: document.getElementById('packageDestinations').value,
        price: parseInt(document.getElementById('packagePrice').value),
        originalPrice: document.getElementById('packageOriginalPrice').value ? parseInt(document.getElementById('packageOriginalPrice').value) : null,
        duration: document.getElementById('packageDuration').value,
        groupSize: document.getElementById('packageGroupSize').value,
        rating: parseFloat(document.getElementById('packageRating').value) || 4.5,
        description: document.getElementById('packageDescription').value,
        images: document.getElementById('packageImages').value.split('\n').filter(img => img.trim()),
        inclusions: document.getElementById('packageInclusions').value.split('\n').filter(inc => inc.trim()),
        exclusions: document.getElementById('packageExclusions').value.split('\n').filter(exc => exc.trim()),
        itinerary: parseItinerary(document.getElementById('packageItineraryJson').value),
        notes: document.getElementById('packageNotes')?.value.split('\n').filter(note => note.trim()) || [],

    };

    if (currentEditId) {
        // Update existing package
        const index = allPackages.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            allPackages[index] = formData;
        }
    } else {
        // Add new package
        allPackages.push(formData);
    }

    displayPackagesTable();
    bootstrap.Modal.getInstance(document.getElementById('packageModal')).hide();
    showAlert('Package saved successfully! Remember to export and upload to GitHub for live deployment.', 'success');
}

function parseItinerary(jsonString) {
    try {
        const parsed = JSON.parse(jsonString);
        return parsed.map(day => ({
            title: day.title || `Day ${day.day}`,
            description: day.description || day.activities || ''
        }));
    } catch {
        return [];
    }
}

function deletePackage(id) {
    if (confirm('Are you sure you want to delete this package?')) {
        allPackages = allPackages.filter(p => p.id !== id);
        displayPackagesTable();
        showAlert('Package deleted successfully!', 'success');
    }
}

function sharePackage(id) {
    const package = allPackages.find(p => p.id === id);
    if (!package) return;

    const itinerary = generateItineraryText(package);
    const shareOptions = `
        <div class="d-grid gap-2">
            <button class="btn btn-success" onclick="shareViaWhatsApp('${id}')">
                <i class="fab fa-whatsapp me-2"></i>Share via WhatsApp
            </button>
            <button class="btn btn-primary" onclick="shareViaEmail('${id}')">
                <i class="fas fa-envelope me-2"></i>Share via Email
            </button>
            <button class="btn btn-secondary" onclick="downloadItinerary('${id}')">
                <i class="fas fa-download me-2"></i>Download PDF
            </button>
            <button class="btn btn-info" onclick="copyItinerary('${id}')">
                <i class="fas fa-copy me-2"></i>Copy to Clipboard
            </button>
        </div>
    `;

    showAlert(`
        <h6>Share ${package.name}</h6>
        ${shareOptions}
    `, 'info', 8000);
}

function generateItineraryText(package) {
    let text = `🌟 ${package.name.toUpperCase()} 🌟\n\n`;
    text += `📍 Location: ${package.location}\n`;
    text += `⏰ Duration: ${package.duration}\n`;
    text += `👥 Group Size: ${package.groupSize || 'Flexible'}\n`;
    text += `⭐ Rating: ${package.rating}/5\n`;
    text += `💰 Price: ₹${package.price.toLocaleString()} per person\n`;
    if (package.originalPrice) {
        text += `💸 Original Price: ₹${package.originalPrice.toLocaleString()} (Save ₹${(package.originalPrice - package.price).toLocaleString()}!)\n`;
    }
    text += `\n📝 Description:\n${package.description}\n\n`;
    
    if (package.inclusions && package.inclusions.length > 0) {
        text += `✅ INCLUSIONS:\n`;
        package.inclusions.forEach(inc => text += `• ${inc}\n`);
        text += '\n';
    }
    
    if (package.exclusions && package.exclusions.length > 0) {
        text += `❌ EXCLUSIONS:\n`;
        package.exclusions.forEach(exc => text += `• ${exc}\n`);
        text += '\n';
    }
    
    text += `📞 Book now: +91 98209 79944\n`;
    text += `🌐 Website: sanskrutitravels.in\n\n`;
    text += `#SanskrutiTravels #TravelPackage #${package.category.charAt(0).toUpperCase() + package.category.slice(1)}Tour`;
    
    return text;
}

function shareViaWhatsApp(id) {
    const package = allPackages.find(p => p.id === id);
    const itinerary = generateItineraryText(package);
    const encodedText = encodeURIComponent(itinerary);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
}

function shareViaEmail(id) {
    const package = allPackages.find(p => p.id === id);
    const itinerary = generateItineraryText(package);
    const subject = encodeURIComponent(`${package.name} - Travel Package Details`);
    const body = encodeURIComponent(itinerary);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

function downloadItinerary(id) {
    const package = allPackages.find(p => p.id === id);
    const itinerary = generateItineraryText(package);
    
    // Create a simple HTML document for PDF
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
                .inclusions, .exclusions { margin-left: 20px; }
                .contact { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${package.name}</h1>
                <p>📞 +91 98209 79944 | 🌐 sanskrutitravels.in</p>
            </div>
            ${itinerary.split('\n').map(line => `<p>${line}</p>`).join('')}
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

function copyItinerary(id) {
    const package = allPackages.find(p => p.id === id);
    const itinerary = generateItineraryText(package);
    
    navigator.clipboard.writeText(itinerary).then(() => {
        showAlert('Itinerary copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = itinerary;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showAlert('Itinerary copied to clipboard!', 'success');
    });
}

function exportPackages() {
    const packagesData = {
        packages: allPackages,
        lastUpdated: new Date().toISOString(),
        totalPackages: allPackages.length
    };
    
    const dataStr = JSON.stringify(packagesData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'packages.json';
    a.click();
    
    URL.revokeObjectURL(url);
    showAlert('Packages exported successfully! Upload this file to your GitHub repository.', 'success');
}

function generatePackageId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `pkg_${timestamp}_${random}`;
}

function initializeGitHubInstructions() {
    // Show GitHub instructions on first visit
    if (!localStorage.getItem('githubInstructionsShown')) {
        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById('githubModal'));
            modal.show();
            localStorage.setItem('githubInstructionsShown', 'true');
        }, 2000);
    }
}

function showAlert(message, type = 'info', duration = 4000) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = 'top: 80px; right: 20px; z-index: 9999; max-width: 400px;';
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, duration);
}