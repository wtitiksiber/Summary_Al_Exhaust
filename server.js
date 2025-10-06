const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { getGoogleSheetsData, processGoogleSheetsData, getDefaultData } = require('./config/googleSheets');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configure static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed!'));
    }
  }
});

// Routes
app.get('/', async (req, res) => {
  try {
    // Try to get data from Google Sheets
    const rawData = await getGoogleSheetsData();
    const dashboardData = processGoogleSheetsData(rawData);
    
    res.render('index', { 
      title: 'Production Dashboard',
      dashboardData: dashboardData,
      dataSource: 'Google Sheets'
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    // Fallback to default data
    const dashboardData = getDefaultData();
    res.render('index', { 
      title: 'Production Dashboard',
      dashboardData: dashboardData,
      dataSource: 'Default Data'
    });
  }
});

app.post('/upload', upload.single('spreadsheet'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let data = [];
    
    if (fileExt === '.csv') {
      // Parse CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          res.render('diagram', { 
            title: 'Data Visualization',
            data: data,
            chartType: req.body.chartType || 'bar'
          });
        });
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      // Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
      
      res.render('diagram', { 
        title: 'Data Visualization',
        data: data,
        chartType: req.body.chartType || 'bar'
      });
    }
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// API endpoint to get data as JSON
app.get('/api/data', async (req, res) => {
  try {
    const rawData = await getGoogleSheetsData();
    const dashboardData = processGoogleSheetsData(rawData);
    res.json({
      success: true,
      data: dashboardData,
      source: 'Google Sheets'
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.json({
      success: false,
      data: getDefaultData(),
      source: 'Default Data',
      error: error.message
    });
  }
});

// API endpoint to refresh data from Google Sheets
app.get('/api/refresh', async (req, res) => {
  try {
    const rawData = await getGoogleSheetsData();
    const dashboardData = processGoogleSheetsData(rawData);
    res.json({
      success: true,
      data: dashboardData,
      source: 'Google Sheets',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing data:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      data: getDefaultData()
    });
  }
});

// API endpoint to process uploaded data and return dashboard data
app.post('/api/process-data', upload.single('spreadsheet'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let data = [];
    
    if (fileExt === '.csv') {
      // Parse CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          const processedData = processDataForDashboard(data);
          res.json(processedData);
        });
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      // Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
      
      const processedData = processDataForDashboard(data);
      res.json(processedData);
    }
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Function to process data for dashboard
function processDataForDashboard(data) {
  // This function would process the uploaded data and return
  // structured data for the dashboard charts
  
  // For now, return sample data structure
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

