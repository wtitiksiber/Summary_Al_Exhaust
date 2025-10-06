# Production Dashboard

A comprehensive production monitoring dashboard that displays real-time data from spreadsheet files using Node.js, Express.js, and EJS templating.

## Features

- 📊 **Production Metrics**: Productivity, Availability, Straightpass, and NG Inline monitoring
- 📁 **File Format Support**: CSV, XLSX, and XLS files
- 🎨 **Interactive Charts**: Powered by Chart.js for beautiful, responsive visualizations
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ⚡ **Real-time Processing**: Instant dashboard updates from uploaded data
- 🔧 **Downtime Analysis**: Comprehensive downtime tracking with 4M analysis
- 📈 **Weekly Reports**: Weekly breakdown of production metrics
- 📋 **Corrective Actions**: Track and manage corrective actions by line

## Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser** and go to `http://localhost:3000`

## Usage

1. **Upload Production Data**: Choose a CSV or Excel file containing your production data
2. **View Dashboard**: The dashboard will automatically display all production metrics
3. **Monitor Performance**: Track Productivity, Availability, Straightpass, and NG Inline metrics
4. **Analyze Downtime**: Review downtime patterns and corrective actions
5. **Weekly Analysis**: Monitor weekly performance breakdowns

## Supported File Formats

- **CSV files** (.csv)
- **Excel files** (.xlsx, .xls)

## Dashboard Sections

### Production Metrics
- **Productivity Chart**: Daily productivity with accumulation line
- **Availability Chart**: Daily availability with target line
- **NG Inline Chart**: Non-conforming products tracking
- **Straightpass Chart**: Quality metrics with quantity and percentage

### Downtime Analysis
- **Overall Downtime**: Daily downtime trends
- **4M Analysis**: Machine, Material, Method, Man breakdown
- **Supporting Analysis**: PE, MESIN, QC, PC-SUPP, PROD, PRESS
- **Line Analysis**: E-02 through E-07 line performance

### Weekly Reports
- **Week 1-4**: Weekly breakdown of all metrics
- **Corrective Actions**: Track problems and solutions by line

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── views/                 # EJS templates
│   ├── index.ejs         # Home page
│   └── diagram.ejs       # Chart display page
├── public/               # Static assets
│   └── css/
│       └── style.css     # Custom styles
└── uploads/              # Temporary file storage
```

## Dependencies

- **express**: Web framework
- **ejs**: Templating engine
- **multer**: File upload handling
- **csv-parser**: CSV file parsing
- **xlsx**: Excel file parsing
- **chart.js**: Chart generation
- **nodemon**: Development server (dev dependency)

## Customization

### Adding New Chart Types

1. Add new options to the chart type select in `views/index.ejs`
2. Update the chart creation logic in `views/diagram.ejs`
3. Add corresponding Chart.js configuration

### Styling

Modify `public/css/style.css` to customize the appearance:
- Colors and gradients
- Layout and spacing
- Responsive breakpoints
- Animations and transitions

### Data Processing

The application automatically detects numeric columns and uses them for chart data. You can modify the data processing logic in the `processData` function in `views/diagram.ejs`.

## Troubleshooting

### Common Issues

1. **File Upload Errors**: Ensure the uploads directory exists and has proper permissions
2. **Chart Not Displaying**: Check browser console for JavaScript errors
3. **Data Not Loading**: Verify your spreadsheet has numeric data in at least one column

### File Size Limits

The default file size limit is set by multer. For larger files, you may need to increase the limit in `server.js`.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.

