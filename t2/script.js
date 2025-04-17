const apiUrl = 'https://raw.githubusercontent.com/Armankhan2001/visaDatabase/refs/heads/main/visaDatabase.json';
let visaDatabase = [];

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    visaDatabase = data.visaDatabase;
    populateCountrySelect();
  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('visaInfo').innerHTML = "<p style='color:red'>Failed to load visa data.</p>";
  }
}

function populateCountrySelect() {
  const select = document.getElementById('countrySelect');
  visaDatabase.forEach(item => {
    const option = document.createElement('option');
    option.value = item.country;
    option.textContent = item.country;
    select.appendChild(option);
  });

  select.addEventListener('change', showVisaInfo);
}

function showVisaInfo() {
  const selectedCountry = document.getElementById('countrySelect').value;
  const infoDiv = document.getElementById('visaInfo');
  infoDiv.innerHTML = '';

  if (!selectedCountry) return;

  const countryData = visaDatabase.find(item => item.country === selectedCountry);
  if (!countryData) {
    infoDiv.innerHTML = "<p>No visa information found for this country.</p>";
    return;
  }

  countryData.visaTypes.forEach(visa => {
    const visaTypeDiv = document.createElement('div');
    visaTypeDiv.className = 'category';
    visaTypeDiv.innerHTML = `<h3>${visa.type}</h3>`;

    visa.categories.forEach(cat => {
      visaTypeDiv.innerHTML += `
        <p><strong>${cat.name}</strong><br>
        Max Stay: ${cat.maxStay}<br>
        Visa Validity: ${cat.visaValidity}<br>
        Processing Time: ${cat.processingTime}<br>
        Fees: ${cat.fees}</p>
      `;

      cat.documentsRequired.forEach(docCat => {
        let docList = `<h4>${docCat.category}</h4><ul>`;
        docCat.documents.forEach(doc => {
          docList += `<li><strong>${doc.name}</strong>: ${doc.description}</li>`;
        });
        docList += '</ul>';
        visaTypeDiv.innerHTML += docList;
      });
    });

    infoDiv.appendChild(visaTypeDiv);
  });
}

fetchData();
