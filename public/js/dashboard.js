// Dashboard JavaScript for Production Monitoring

// Data will be loaded from server
let dashboardData = null;

// Generate days array (1-31)
const days = Array.from({ length: 31 }, (_, i) => i + 1);

// Initialize all charts when page loads
document.addEventListener("DOMContentLoaded", async function () {
  await loadDashboardData();
  initializeProductivityChart();
  initializeAvailabilityChart();
  initializeNGInlineChart();
  initializeStraightpassChart();
  initializeDowntimeChart();
  initializeDowntimeCategoryCharts();
  initializeWeeklyCharts();
});

// Load dashboard data from server
async function loadDashboardData() {
  try {
    const response = await fetch("/api/data");
    const result = await response.json();
    dashboardData = result.data;
    console.log("Dashboard data loaded:", result.source);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Use default data if server fails
    dashboardData = getDefaultData();
  }
}

// Default data fallback
function getDefaultData() {
  return {
    productivity: {
      daily: [
        112.5, 120.4, 117.1, 124.2, 108.0, 124.4, 107.9, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      accumulation: [
        112.5, 116.7, 116.7, 119.1, 118.0, 119.2, 118.0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    availability: {
      daily: [
        96, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
      target: [
        90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
        90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90,
      ],
    },
    straightpass: {
      qty: [
        400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      percentage: [
        100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ],
      target: [
        95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95,
        95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95,
      ],
    },
    downtime: {
      daily: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
      ],
    },
  };
}

// Productivity Chart
function initializeProductivityChart() {
  const ctx = document.getElementById("productivityChart").getContext("2d");
  productivityChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Productivity",
          data: dashboardData?.productivity?.daily || [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Accumulasi",
          data: dashboardData?.productivity?.accumulation || [],
          type: "line",
          borderColor: "rgba(0, 0, 0, 1)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 130,
          ticks: {
            stepSize: 10,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });
  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });
}

// Availability Chart
function initializeAvailabilityChart() {
  const ctx = document.getElementById("availabilityChart").getContext("2d");
  availabilityChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Availability",
          data: dashboardData?.availability?.daily || [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Target",
          data: dashboardData?.availability?.target || [],
          type: "line",
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderDash: [5, 5],
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });

  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });
}

// NG Inline Chart
function initializeNGInlineChart() {
  const ctx = document.getElementById("ngInlineChart").getContext("2d");
  ngInlineChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "NG Inline",
          data: dashboardData?.downtime?.daily || [],
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });
}

// Straightpass Chart
function initializeStraightpassChart() {
  const ctx = document.getElementById("straightpassChart").getContext("2d");
  straightpassChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Qty",
          data: dashboardData?.straightpass?.qty || [],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "%",
          data: dashboardData?.straightpass?.percentage || [],
          type: "line",
          borderColor: "rgba(0, 0, 0, 1)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          fill: false,
          tension: 0.1,
          yAxisID: "y1",
        },
        {
          label: "Target",
          data: dashboardData?.straightpass?.target || [],
          type: "line",
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          borderDash: [5, 5],
          fill: false,
          tension: 0.1,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          beginAtZero: true,
          max: 500,
          ticks: {
            stepSize: 100,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          beginAtZero: true,
          max: 110,
          ticks: {
            stepSize: 10,
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });

  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });
}

// Downtime Chart
function initializeDowntimeChart() {
  const ctx = document.getElementById("downtimeChart").getContext("2d");
  downtimeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: days,
      datasets: [
        {
          label: "FY 2025",
          data: dashboardData?.downtime?.daily || [],
          borderColor: "rgba(0, 0, 0, 1)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 800,
          ticks: {
            stepSize: 200,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
    },
  });

  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });
}

// Downtime Category Charts
function initializeDowntimeCategoryCharts() {
  // 4M Chart
  const ctx4m = document.getElementById("downtime4mChart").getContext("2d");
  downtime4mChart = new Chart(ctx4m, {
    type: "bar",
    data: {
      labels: ["MACHINE", "MATERIAL", "METHODE", "MAN"],
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 800,
          ticks: {
            stepSize: 200,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });

  // Supporting Chart
  const ctxSupporting = document
    .getElementById("downtimeSupportingChart")
    .getContext("2d");
  downtimeSupportingChart = new Chart(ctxSupporting, {
    type: "bar",
    data: {
      labels: ["PE", "MESIN", "QC", "PC-SUPP", "PROD", "PRESS"],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 800,
          ticks: {
            stepSize: 200,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });

  // Line Chart
  const ctxLine = document.getElementById("downtimeLineChart").getContext("2d");
  downtimeLineChart = new Chart(ctxLine, {
    type: "bar",
    data: {
      labels: ["E-02", "E-03", "E-04", "E-05", "E-06", "E-07"],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 800,
          ticks: {
            stepSize: 200,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });
}

// Weekly Charts
function initializeWeeklyCharts() {
  const weeks = ["week1Chart", "week2Chart", "week3Chart", "week4Chart"];
  const weekLabels = ["E-02", "E-03", "E-04", "E-05", "E-06", "E-07", "Total"];

  weeks.forEach((weekId, index) => {
    const ctx = document.getElementById(weekId).getContext("2d");
    const chartVar = ["week1Chart", "week2Chart", "week3Chart", "week4Chart"][
      index
    ];
    window[chartVar] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: weekLabels,
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 4000,
            ticks: {
              stepSize: 1000,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  });

  window.addEventListener("resize", () => {
    if (window.productivityChart) window.productivityChart.resize();
    if (window.availabilityChart) window.availabilityChart.resize();
    // tambahkan chart lain sesuai ID
  });
}

window.addEventListener("resize", () => {
  if (currentChart) {
    currentChart.resize();
  }
});

// Refresh data from Google Sheets
async function refreshData() {
  const refreshBtn = document.querySelector('button[onclick="refreshData()"]');
  const originalText = refreshBtn.innerHTML;
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
  refreshBtn.disabled = true;

  try {
    const response = await fetch("/api/refresh");
    const result = await response.json();

    if (result.success) {
      dashboardData = result.data;
      updateChartsWithData(dashboardData);
      alert("Data refreshed successfully from Google Sheets!");
    } else {
      alert("Error refreshing data: " + result.error);
    }
  } catch (error) {
    console.error("Error refreshing data:", error);
    alert("Error refreshing data: " + error.message);
  } finally {
    refreshBtn.innerHTML = originalText;
    refreshBtn.disabled = false;
  }
}

// File upload functions
function uploadFile() {
  document.getElementById("fileInput").click();
}

function handleFileUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    console.log("File selected:", file.name);

    // Create FormData to send file to server
    const formData = new FormData();
    formData.append("spreadsheet", file);

    // Show loading indicator
    const uploadBtn = document.querySelector('button[onclick="uploadFile()"]');
    const originalText = uploadBtn.innerHTML;
    uploadBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';
    uploadBtn.disabled = true;

    // Send file to server
    fetch("/api/process-data", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data);
        updateChartsWithData(data);
        alert("Data processed successfully! Charts have been updated.");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error processing file: " + error.message);
      })
      .finally(() => {
        // Reset button
        uploadBtn.innerHTML = originalText;
        uploadBtn.disabled = false;
      });
  }
}

// Global variables to store chart instances
let productivityChart,
  availabilityChart,
  ngInlineChart,
  straightpassChart,
  downtimeChart;
let downtime4mChart, downtimeSupportingChart, downtimeLineChart;
let week1Chart, week2Chart, week3Chart, week4Chart;

// Function to update charts with new data
function updateChartsWithData(newData) {
  console.log("Updating charts with new data:", newData);

  // Update Productivity Chart
  if (productivityChart && newData.productivity) {
    productivityChart.data.datasets[0].data = newData.productivity.daily;
    productivityChart.data.datasets[1].data = newData.productivity.accumulation;
    productivityChart.update();
  }

  // Update Availability Chart
  if (availabilityChart && newData.availability) {
    availabilityChart.data.datasets[0].data = newData.availability.daily;
    availabilityChart.data.datasets[1].data = newData.availability.target;
    availabilityChart.update();
  }

  // Update NG Inline Chart
  if (ngInlineChart && newData.downtime) {
    ngInlineChart.data.datasets[0].data = newData.downtime.daily;
    ngInlineChart.update();
  }

  // Update Straightpass Chart
  if (straightpassChart && newData.straightpass) {
    straightpassChart.data.datasets[0].data = newData.straightpass.qty;
    straightpassChart.data.datasets[1].data = newData.straightpass.percentage;
    straightpassChart.data.datasets[2].data = newData.straightpass.target;
    straightpassChart.update();
  }

  // Update Downtime Chart
  if (downtimeChart && newData.downtime) {
    downtimeChart.data.datasets[0].data = newData.downtime.daily;
    downtimeChart.update();
  }
}
