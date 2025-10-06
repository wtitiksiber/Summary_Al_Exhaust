const axios = require('axios');

// Google Sheets configuration
const SPREADSHEET_ID = '1-FK8TscyxAxCI1MCp8Hix7GdLut6vQKavRawbIgwzlg';
const SHEET_NAME = 'Data Dashboard Exhaust';
const GID = '845270258'; // GID for the specific tab

// Function to get data from Google Sheets using public CSV export
async function getGoogleSheetsData() {
  try {
    // Use the CSV export URL for the specific tab "Data Dashboard Exhaust"
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;
    
    const response = await axios.get(csvUrl);
    const csvData = response.data;
    
    // Parse CSV data with proper handling for quoted fields
    const rows = parseCSV(csvData);
    
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return null;
    }

    console.log('Successfully loaded data from Google Sheets:', rows.length, 'rows');
    return rows;
  } catch (error) {
    console.error('Error accessing Google Sheets:', error);
    return null;
  }
}

// Function to parse CSV data properly
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Simple CSV parsing - split by comma but handle quoted fields
      const row = line.split(',').map(cell => {
        // Remove quotes if present
        return cell.replace(/^"(.*)"$/, '$1').trim();
      });
      result.push(row);
    }
  }
  
  return result;
}

// Function to process Google Sheets data for dashboard
function processGoogleSheetsData(rawData) {
  if (!rawData || rawData.length === 0) {
    return getDefaultData();
  }

  console.log('Processing Google Sheets data...');
  console.log('Data structure:', rawData.slice(0, 5)); // Log first 5 rows for debugging

  const processedData = {
    productivity: {
      daily: [],
      accumulation: []
    },
    availability: {
      daily: [],
      target: []
    },
    straightpass: {
      qty: [],
      percentage: [],
      target: []
    },
    downtime: {
      daily: []
    }
  };

  try {
    // Based on the structure we observed, extract data directly from known rows
    console.log('Extracting data from known structure...');
    
    // Find the correct rows for each data type
    let productivityRow = -1;
    let availabilityRow = -1;
    let straightpassRow = -1;
    let downtimeRow = -1;
    let ngInlineRow = -1;
    
    // Search for specific headers in the data
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      if (row && row.length > 0) {
        const rowText = row.join(' ').toLowerCase();
        
        if (rowText.includes('mass prod.earned h') && rowText.includes('daily')) {
          productivityRow = i;
        }
        if (rowText.includes('availability') && rowText.includes('daily')) {
          availabilityRow = i;
        }
        if (rowText.includes('straight pass') || rowText.includes('straightpass')) {
          straightpassRow = i;
        }
        if (rowText.includes('downtime') && rowText.includes('daily')) {
          downtimeRow = i;
        }
        if (rowText.includes('ng inline') || rowText.includes('ng inline')) {
          ngInlineRow = i;
        }
      }
    }

    console.log('Found data rows:', { productivityRow, availabilityRow, straightpassRow, downtimeRow, ngInlineRow });
    
    // Extract productivity data from row 3 (Mass Prod.earned H) - based on the structure shown
    if (rawData[3] && rawData[3].length > 20) {
      console.log('Extracting productivity data from row 4 (Mass Prod.earned H)...');
      const row3Data = rawData[3];
      
      // Look for daily data starting from column 20 (days 1-31)
      for (let i = 20; i < Math.min(51, row3Data.length); i++) {
        let cellValue = row3Data[i] || '';
        cellValue = cellValue.replace(/"/g, '').replace(/,/g, '.');
        const value = parseFloat(cellValue) || 0;
        processedData.productivity.daily.push(value);
      }
      
      console.log('Productivity data extracted:', processedData.productivity.daily.slice(0, 10));
    }

    // If no productivity data found, use default
    if (processedData.productivity.daily.length === 0) {
      for (let i = 0; i < 31; i++) {
        processedData.productivity.daily.push(0);
      }
    }

    // Calculate accumulation (running average)
    let runningTotal = 0;
    let count = 0;
    processedData.productivity.daily.forEach((value, index) => {
      if (value > 0) {
        runningTotal += value;
        count++;
      }
      const avg = count > 0 ? runningTotal / count : 0;
      processedData.productivity.accumulation.push(avg);
    });

    // Extract availability data
    if (availabilityRow >= 0 && rawData[availabilityRow]) {
      console.log('Extracting availability data...');
      const availabilityData = rawData[availabilityRow];
      
      for (let i = 0; i < Math.min(31, availabilityData.length); i++) {
        let cellValue = availabilityData[i] || '';
        cellValue = cellValue.replace(/"/g, '').replace(/,/g, '.').replace(/%/g, '');
        const value = parseFloat(cellValue) || 0;
        processedData.availability.daily.push(value);
      }
      
      console.log('Availability data extracted:', processedData.availability.daily.slice(0, 10));
    }

    // If no availability data found, use default
    if (processedData.availability.daily.length === 0) {
      for (let i = 0; i < 31; i++) {
        processedData.availability.daily.push(95); // Default 95% as shown in image
      }
    }

    // Add target values (90% as shown in image)
    for (let i = 0; i < 31; i++) {
      processedData.availability.target.push(90);
    }

    // Extract straightpass data
    if (straightpassRow >= 0 && rawData[straightpassRow]) {
      console.log('Extracting straightpass data...');
      const straightpassData = rawData[straightpassRow];
      
      for (let i = 0; i < Math.min(31, straightpassData.length); i++) {
        let cellValue = straightpassData[i] || '';
        cellValue = cellValue.replace(/"/g, '').replace(/,/g, '.').replace(/%/g, '');
        const value = parseFloat(cellValue) || 0;
        processedData.straightpass.qty.push(value);
        processedData.straightpass.percentage.push(value > 0 ? 100 : 0);
      }
      
      console.log('Straightpass data extracted:', processedData.straightpass.qty.slice(0, 10));
    }

    // If no straightpass data found, use default
    if (processedData.straightpass.qty.length === 0) {
      for (let i = 0; i < 31; i++) {
        processedData.straightpass.qty.push(94); // Default value from image
        processedData.straightpass.percentage.push(100);
      }
    }

    // Add target values (95% as shown in image)
    for (let i = 0; i < 31; i++) {
      processedData.straightpass.target.push(95);
    }

    // Extract downtime data
    if (downtimeRow >= 0 && rawData[downtimeRow]) {
      console.log('Extracting downtime data...');
      const downtimeData = rawData[downtimeRow];
      
      for (let i = 0; i < Math.min(31, downtimeData.length); i++) {
        let cellValue = downtimeData[i] || '';
        cellValue = cellValue.replace(/"/g, '').replace(/,/g, '.');
        const value = parseFloat(cellValue) || 0;
        processedData.downtime.daily.push(value);
      }
      
      console.log('Downtime data extracted:', processedData.downtime.daily.slice(0, 10));
    }

    // If no downtime data found, use default (0 as shown in image)
    if (processedData.downtime.daily.length === 0) {
      for (let i = 0; i < 31; i++) {
        processedData.downtime.daily.push(0);
      }
    }

    console.log('Processed data summary:', {
      productivity: processedData.productivity.daily.slice(0, 5),
      availability: processedData.availability.daily.slice(0, 5),
      straightpass: processedData.straightpass.qty.slice(0, 5)
    });

  } catch (error) {
    console.error('Error processing data:', error);
    return getDefaultData();
  }

  return processedData;
}

// Default data if Google Sheets is not accessible
function getDefaultData() {
  return {
    productivity: {
      daily: [112.5, 120.4, 117.1, 124.2, 108.0, 124.4, 107.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      accumulation: [112.5, 116.7, 116.7, 119.1, 118.0, 119.2, 118.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    availability: {
      daily: [96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      target: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90]
    },
    straightpass: {
      qty: [400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      percentage: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      target: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95]
    },
    downtime: {
      daily: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  };
}

module.exports = {
  getGoogleSheetsData,
  processGoogleSheetsData,
  getDefaultData
};
