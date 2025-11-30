import React from 'react';

const GlobalStyles: React.FC = () => (
  <style>{`
    :root {
      --bg-color: #0b0c10;
      --gradient-start: #663399;
      --gradient-end: #00bcd4;
      --glow-color: #ff2a6d;
    }

    @keyframes gradientMove { 
      0% { background-position: 0% 50%; } 
      100% { background-position: 100% 50%; } 
    }
    
    @keyframes subtleTilt { 
      0%, 100% { transform: perspective(1000px) rotateY(0deg) scale(1); } 
      50% { transform: perspective(1000px) rotateY(1deg) scale(1.01); } 
    }
    
    @keyframes colorShift { 
      0% { filter: hue-rotate(0deg); } 
      100% { filter: hue-rotate(360deg); } 
    }

    .animate-gradient-move {
      background-size: 200% 200%;
      animation: gradientMove 30s infinite linear;
    }

    .animate-subtle-tilt {
      animation: subtleTilt 10s infinite ease-in-out;
    }

    .animate-color-shift {
      animation: colorShift 5s infinite alternate;
    }
    
    /* Custom Scrollbar for nicer look */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
    ::-webkit-scrollbar-thumb { background: rgba(0, 188, 212, 0.5); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0, 188, 212, 0.8); }

    /* For table stickiness */
    .sticky-header th {
       position: sticky; top: 0; z-index: 10;
    }

    /* --- PRINT FIXES --- */
    @media print {
      /* Reset basic page settings */
      @page {
        margin: 0.5cm;
        size: A4;
      }

      /* Force background and text colors */
      body {
        background-color: white !important;
        background: white !important;
        color: black !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Reset Layout Constraints */
      html, body, #root {
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        display: block !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Hide elements meant to be hidden */
      .no-print, 
      button, 
      .action-buttons-footer,
      .back-btn,
      .print-btn,
      nav,
      header,
      footer {
        display: none !important;
      }

      /* Ensure the main panel takes up full width and removes styling meant for screen */
      .main-panel {
        position: static !important;
        transform: none !important;
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: none !important;
        background: white !important;
        color: black !important;
        display: block !important;
      }

      /* Allow tables to flow naturally */
      .overflow-x-auto, .data-table-container {
        overflow: visible !important;
        max-height: none !important;
        height: auto !important;
      }

      table {
        width: 100% !important;
        table-layout: auto !important;
        border-collapse: collapse !important;
        font-size: 10pt !important;
      }

      th, td {
        border: 1px solid #000 !important;
        color: black !important;
        padding: 4px !important;
        white-space: normal !important; /* Allow text wrapping */
      }

      /* Ensure headers are visible but not weirdly colored if not needed */
      th {
        background-color: #f0f0f0 !important;
        font-weight: bold !important;
      }
      
      /* Specific override for scrollbars */
      ::-webkit-scrollbar {
        display: none !important;
      }
    }
  `}</style>
);

export default GlobalStyles;