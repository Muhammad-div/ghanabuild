import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import constructionData from './ghana-construction-data.json';

// PDF Export Function
const generatePDFReport = (estimateData) => {
  // Create a new window for the PDF content
  const printWindow = window.open('', '_blank');
  
  const formatMoney = (n) =>
    typeof n === 'number' && !Number.isNaN(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 })
      : '-';

  const currentDate = new Date().toLocaleDateString();
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Construction Cost Estimate - Ghanabuild.AI</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
          margin: 40px; 
          color: #333; 
          line-height: 1.6;
        }
        .header { 
          border-bottom: 3px solid #0284c7; 
          padding-bottom: 20px; 
          margin-bottom: 30px; 
        }
        .header h1 { 
          color: #0284c7; 
          margin: 0; 
          font-size: 28px; 
        }
        .header p { 
          color: #666; 
          margin: 5px 0 0 0; 
        }
        .project-details { 
          background: #f8fafc; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 30px; 
        }
        .cost-section { 
          margin-bottom: 30px; 
        }
        .cost-section h3 { 
          color: #374151; 
          border-bottom: 2px solid #e5e7eb; 
          padding-bottom: 10px; 
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
        }
        th, td { 
          border: 1px solid #e5e7eb; 
          padding: 12px; 
          text-align: left; 
        }
        th { 
          background: #f3f4f6; 
          font-weight: 600; 
        }
        .total-row { 
          background: #eff6ff; 
          font-weight: bold; 
        }
        .grand-total { 
          background: #0284c7; 
          color: white; 
          font-size: 18px; 
        }
        .footer { 
          margin-top: 50px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          color: #666; 
          font-size: 12px; 
        }
        @media print {
          body { margin: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Ghanabuild.AI</h1>
        <p>Construction Cost Estimate Report</p>
        <p>Generated: ${currentDate}</p>
      </div>

      <div class="project-details">
        <h3>Project Details</h3>
        <table>
          <tr><td><strong>Region:</strong></td><td>${estimateData.regionData?.name || 'N/A'}</td></tr>
          <tr><td><strong>Project Type:</strong></td><td>${estimateData.projectDetails?.projectType || 'N/A'}</td></tr>
          <tr><td><strong>Floor Area:</strong></td><td>${estimateData.projectDetails?.totalFloorArea || 'N/A'} ${estimateData.projectDetails?.areaUnit || 'sqm'}</td></tr>
          <tr><td><strong>Number of Bathrooms:</strong></td><td>${estimateData.projectDetails?.numberOfBathrooms || 'N/A'}</td></tr>
          <tr><td><strong>Number of Floors:</strong></td><td>${estimateData.projectDetails?.numberOfFloors || 'N/A'}</td></tr>
          <tr><td><strong>Finish Quality:</strong></td><td>${estimateData.projectDetails?.finishQuality || 'N/A'}</td></tr>
        </table>
      </div>

      <div class="cost-section">
        <h3>Cost Breakdown</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount (GHS)</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Land Cost</td><td>${formatMoney(estimateData.landCost)}</td><td>${((estimateData.landCost / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr><td>Base Construction Cost</td><td>${formatMoney(estimateData.baseCost)}</td><td>${((estimateData.baseCost / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr><td>Bathroom Costs</td><td>${formatMoney(estimateData.bathroomCost)}</td><td>${((estimateData.bathroomCost / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            ${estimateData.externalWorks > 0 ? `<tr><td>External Works</td><td>${formatMoney(estimateData.externalWorks)}</td><td>${((estimateData.externalWorks / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>` : ''}
            <tr><td>Additional Fees</td><td>${formatMoney(estimateData.additionalFees)}</td><td>${((estimateData.additionalFees / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr><td>Markup (${Math.round((estimateData.markupRate || 0) * 100)}%)</td><td>${formatMoney(estimateData.markup)}</td><td>${((estimateData.markup / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr><td>Contingency (${Math.round((estimateData.contingencyRate || 0) * 100)}%)</td><td>${formatMoney(estimateData.contingency)}</td><td>${((estimateData.contingency / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr><td>Location Adjustment</td><td>${formatMoney(estimateData.locationAdjustment)}</td><td>${((estimateData.locationAdjustment / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr><td>Inflation Adjustment</td><td>${formatMoney(estimateData.inflationAdjustment)}</td><td>${((estimateData.inflationAdjustment / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr><td>Risk Premium</td><td>${formatMoney(estimateData.riskPremium)}</td><td>${((estimateData.riskPremium / estimateData.totalCost) * 100).toFixed(1)}%</td></tr>
            <tr class="grand-total"><td><strong>TOTAL ESTIMATED COST</strong></td><td><strong>${formatMoney(estimateData.totalCost)}</strong></td><td><strong>100.0%</strong></td></tr>
          </tbody>
        </table>
      </div>

      <div class="cost-section">
        <h3>Regional Information</h3>
        <table>
          <tr><td><strong>Region:</strong></td><td>${estimateData.regionData?.name || 'N/A'}</td></tr>
          <tr><td><strong>Land Cost per Plot:</strong></td><td>${formatMoney(estimateData.regionData?.landCost || 0)}</td></tr>
          <tr><td><strong>Construction Rate:</strong></td><td>${formatMoney(estimateData.regionData?.constructionCostPerSqm || 0)} per sqm</td></tr>
          <tr><td><strong>Labor Rate:</strong></td><td>${formatMoney(estimateData.regionData?.laborCostPerDay || 0)} per day</td></tr>
        </table>
      </div>

      <div class="footer">
        <p><strong>Disclaimer:</strong> This estimate is based on current market rates and regional data. Actual costs may vary based on specific project requirements, market conditions, and material availability. Please consult with local contractors for precise quotes.</p>
        <p><strong>Generated by:</strong> Ghanabuild.AI - Advanced Construction Cost Estimator for Ghana</p>
        <p><strong>Data Sources:</strong> Local market research and construction industry databases</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};

// Accessible ValidationModal with focus trap
function ValidationModal({ isOpen, onClose, message, details }) {
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      ref={modalRef}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Validation Error</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
          {details && details.length > 0 && (
            <ul className="list-disc pl-5 mt-2 text-gray-600">
              {details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectForm({ onFormSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    region: "",
    projectType: "residential",
    totalFloorArea: "",
    areaUnit: "sqm", // Default to square meters for Ghana
    numberOfBathrooms: "",
    numberOfFloors: "",
    preferredFinishQuality: "standard",
    includeExternalWorks: false,
    // Custom cost inputs
    customLandCost: "",
    useCustomLandCost: false,
    customMaterialCost: "",
    useCustomMaterialCost: false,
    customLaborCost: "",
    useCustomLaborCost: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalDetails, setModalDetails] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.region || !/^[a-zA-Z\s-]{2,}$/.test(formData.region)) {
      errors.push(
        "Region must be at least 2 characters long and contain only letters, spaces, or hyphens."
      );
    }
    
    const totalFloorArea = parseInt(formData.totalFloorArea, 10);
    const minArea = formData.areaUnit === 'sqm' ? 50 : 500; // 50 sqm minimum, 500 sqft minimum
    const maxArea = formData.areaUnit === 'sqm' ? 200000 : 10000; // 200,000 sqm max, 10000 sqft max
    const areaLabel = formData.areaUnit === 'sqm' ? 'sq m' : 'sq ft';
    
    if (
      isNaN(totalFloorArea) ||
      totalFloorArea < minArea ||
      totalFloorArea > maxArea ||
      totalFloorArea !== parseFloat(formData.totalFloorArea)
    ) {
      errors.push(
        `Total Floor Area must be an integer between ${minArea.toLocaleString()} and ${maxArea.toLocaleString()} ${areaLabel}.`
      );
    }
    
    const numberOfBathrooms = parseInt(formData.numberOfBathrooms, 10);
    if (
      isNaN(numberOfBathrooms) ||
      numberOfBathrooms < 1 ||
      numberOfBathrooms > 10 ||
      numberOfBathrooms !== parseFloat(formData.numberOfBathrooms)
    ) {
      errors.push(
        "Number of Bathrooms must be an integer between 1 and 10."
      );
    }
    
    const numberOfFloors = parseInt(formData.numberOfFloors, 10);
    if (
      isNaN(numberOfFloors) ||
      numberOfFloors < 1 ||
      numberOfFloors > 5 ||
      numberOfFloors !== parseFloat(formData.numberOfFloors)
    ) {
      errors.push(
        "Number of Floors must be an integer between 1 and 5."
      );
    }

    // Validate custom costs if enabled
    if (formData.useCustomLandCost) {
      const customLandCost = parseFloat(formData.customLandCost);
      if (isNaN(customLandCost) || customLandCost < 0) {
        errors.push("Custom land cost must be a valid positive number.");
      }
    }

    if (formData.useCustomMaterialCost) {
      const customMaterialCost = parseFloat(formData.customMaterialCost);
      if (isNaN(customMaterialCost) || customMaterialCost < 0 || customMaterialCost > 10000) {
        errors.push("Custom material cost must be a valid number between 0 and 10,000 GHS per sqm.");
      }
    }

    if (formData.useCustomLaborCost) {
      const customLaborCost = parseFloat(formData.customLaborCost);
      if (isNaN(customLaborCost) || customLaborCost < 0 || customLaborCost > 1000) {
        errors.push("Custom labor cost must be a valid number between 0 and 1,000 GHS per day.");
      }
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setModalMessage("Please correct the following errors:");
      setModalDetails(errors);
      setIsModalOpen(true);
      return;
    }
    onFormSubmit(formData);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <> 
      <section className="max-w-4xl mx-auto form-container ghana-accent p-8 fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Project Details</h2>
            <p className="text-gray-600">Enter your construction project information</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="region" className="text-sm font-medium text-gray-700">Region</label>
            <select
              id="region"
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              className="mt-2 input-field rounded-lg p-3 focus:outline-none focus-ring"
              required
            >
              <option value="">Select a region</option>
              {constructionData.regions.map((region) => (
                <option key={region.name} value={region.name}>
                  {region.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="projectType" className="text-sm font-medium text-gray-700">Project Type</label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType || "residential"}
              onChange={handleChange}
              className="mt-2 input-field rounded-lg p-3 focus:outline-none focus-ring"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="totalFloorArea" className="text-sm font-medium text-gray-700">
              Total Floor Area ({formData.areaUnit === 'sqm' ? 'sq m' : 'sq ft'})
            </label>
            <div className="flex gap-2 mt-2">
            <input
              id="totalFloorArea"
              name="totalFloorArea"
              type="number"
                min={formData.areaUnit === 'sqm' ? 50 : 500}
                max={formData.areaUnit === 'sqm' ? 200000 : 10000}
              step={1}
                placeholder={formData.areaUnit === 'sqm' ? 'e.g., 200' : 'e.g., 2000'}
              value={formData.totalFloorArea || ""}
              onChange={handleChange}
                className="flex-1 input-field rounded-lg p-3 focus:outline-none focus-ring"
              required
              inputMode="numeric"
            />
              <select
                name="areaUnit"
                value={formData.areaUnit}
                onChange={handleChange}
                className="input-field rounded-lg p-3 focus:outline-none focus-ring w-24"
              >
                <option value="sqm">sq m</option>
                <option value="sqft">sq ft</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.areaUnit === 'sqm' 
                ? 'Square meters (preferred in Ghana) - Max: 200,000 sqm' 
                : 'Square feet (1 sq ft = 0.093 sq m) - Max: 10,000 sqft'}
            </p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="numberOfBathrooms" className="text-sm font-medium text-gray-700">Number of Bathrooms</label>
            <input
              id="numberOfBathrooms"
              name="numberOfBathrooms"
              type="number"
              min={1}
              max={10}
              step={1}
              placeholder="e.g., 3"
              value={formData.numberOfBathrooms || ""}
              onChange={handleChange}
              className="mt-2 input-field rounded-lg p-3 focus:outline-none focus-ring"
              required
              inputMode="numeric"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="numberOfFloors" className="text-sm font-medium text-gray-700">Number of Floors</label>
            <input
              id="numberOfFloors"
              name="numberOfFloors"
              type="number"
              min={1}
              max={5}
              step={1}
              placeholder="e.g., 2"
              value={formData.numberOfFloors || ""}
              onChange={handleChange}
              className="mt-2 input-field rounded-lg p-3 focus:outline-none focus-ring"
              required
              inputMode="numeric"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="preferredFinishQuality" className="text-sm font-medium text-gray-700">Finish Quality</label>
            <select
              id="preferredFinishQuality"
              name="preferredFinishQuality"
              value={formData.preferredFinishQuality || "standard"}
              onChange={handleChange}
              className="mt-2 input-field rounded-lg p-3 focus:outline-none focus-ring"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <input
              id="includeExternalWorks"
              name="includeExternalWorks"
              type="checkbox"
              checked={Boolean(formData.includeExternalWorks)}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeExternalWorks" className="text-sm font-medium text-gray-700">
              Include External Works (landscaping, driveways, etc.)
            </label>
          </div>

          {/* Custom Costs Section */}
          <div className="md:col-span-2 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Custom Cost Overrides (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Override default regional costs with your own specific rates. Leave unchecked to use regional averages.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Custom Land Cost */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      id="useCustomLandCost"
                      name="useCustomLandCost"
                      type="checkbox"
                      checked={Boolean(formData.useCustomLandCost)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useCustomLandCost" className="text-sm font-medium text-gray-700">
                      Custom Land Cost (GHS per plot)
                    </label>
                  </div>
                  {formData.useCustomLandCost && (
                    <input
                      id="customLandCost"
                      name="customLandCost"
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="e.g., 5000000"
                      value={formData.customLandCost || ""}
                      onChange={handleChange}
                      className="input-field rounded-lg p-3 focus:outline-none focus-ring"
                      inputMode="numeric"
                    />
                  )}
                </div>

                {/* Custom Material Cost */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      id="useCustomMaterialCost"
                      name="useCustomMaterialCost"
                      type="checkbox"
                      checked={Boolean(formData.useCustomMaterialCost)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useCustomMaterialCost" className="text-sm font-medium text-gray-700">
                      Custom Material Cost (GHS per sqm)
                    </label>
                  </div>
                  {formData.useCustomMaterialCost && (
                    <input
                      id="customMaterialCost"
                      name="customMaterialCost"
                      type="number"
                      min={0}
                      max={10000}
                      step={50}
                      placeholder="e.g., 2500"
                      value={formData.customMaterialCost || ""}
                      onChange={handleChange}
                      className="input-field rounded-lg p-3 focus:outline-none focus-ring"
                      inputMode="numeric"
                    />
                  )}
                </div>

                {/* Custom Labor Cost */}
                <div className="flex flex-col md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      id="useCustomLaborCost"
                      name="useCustomLaborCost"
                      type="checkbox"
                      checked={Boolean(formData.useCustomLaborCost)}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useCustomLaborCost" className="text-sm font-medium text-gray-700">
                      Custom Labor Cost (GHS per day)
                    </label>
                  </div>
                  {formData.useCustomLaborCost && (
                    <input
                      id="customLaborCost"
                      name="customLaborCost"
                      type="number"
                      min={0}
                      max={1000}
                      step={10}
                      placeholder="e.g., 180"
                      value={formData.customLaborCost || ""}
                      onChange={handleChange}
                      className="input-field rounded-lg p-3 focus:outline-none focus-ring max-w-xs"
                      inputMode="numeric"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Calculate Estimate
                </>
              )}
            </button>
          </div>
        </form>
      </section>
      <ValidationModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} details={modalDetails} />
    </>
  );
}

function EstimateSummary({ estimateData, isLoading, error, onRetry }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 10));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="result-card p-8 text-center"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Animated Construction Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <motion.svg 
                  className="w-10 h-10 text-white"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </motion.svg>
              </div>
              {/* Pulsing rings */}
              <motion.div 
                className="absolute inset-0 w-20 h-20 border-2 border-blue-300 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div 
                className="absolute inset-0 w-20 h-20 border-2 border-green-300 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>
            
            <div className="space-y-4">
              <motion.h3 
                className="text-2xl font-bold text-gray-800"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Calculating Your Estimate
              </motion.h3>
              
              {/* Loading steps */}
              <div className="space-y-2 text-sm text-gray-600">
                <motion.div 
                  className="flex items-center gap-2 justify-center"
                  animate={{ opacity: progress >= 20 ? 1 : 0.3 }}
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Processing regional data...</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 justify-center"
                  animate={{ opacity: progress >= 40 ? 1 : 0.3 }}
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Calculating material costs...</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 justify-center"
                  animate={{ opacity: progress >= 60 ? 1 : 0.3 }}
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Computing labor requirements...</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 justify-center"
                  animate={{ opacity: progress >= 80 ? 1 : 0.3 }}
                >
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Applying adjustments and fees...</span>
                </motion.div>
              </div>
              
              {/* Progress bar */}
              <div className="w-80 bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span className="font-medium">{progress}% complete</span>
                <span>•</span>
                <span>Analyzing {constructionData.regions.length} regions</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto mt-8">
        <div className="result-card p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-1">Calculation Error</h3>
          <p className="text-red-600">{error}</p>
            </div>
            <button onClick={onRetry} className="btn-primary px-4 py-2 rounded-lg">Retry</button>
          </div>
        </div>
      </section>
    );
  }

  if (!estimateData) return null;

  const rows = [
    { label: 'Land Cost', value: estimateData?.landCost, highlight: true },
    { label: 'Base Construction Cost', value: estimateData?.baseCost },
    { label: 'Bathroom Costs', value: estimateData?.bathroomCost },
    estimateData?.externalWorks > 0 ? { label: 'External Works', value: estimateData?.externalWorks } : null,
    { label: 'Additional Fees', value: estimateData?.additionalFees },
    { label: 'Construction Subtotal', value: (estimateData?.baseCost || 0) + (estimateData?.bathroomCost || 0) + (estimateData?.externalWorks || 0) + (estimateData?.additionalFees || 0) },
    { label: `Markup (${Math.round((estimateData?.markupRate || 0) * 100)}%)`, value: estimateData?.markup },
    { label: `Contingency (${Math.round((estimateData?.contingencyRate || 0) * 100)}%)`, value: estimateData?.contingency },
    { label: `Location Adjustment (${((estimateData?.locationFactor || 1) - 1) * 100}%)`, value: estimateData?.locationAdjustment },
    { label: 'Inflation Adjustment (3%)', value: estimateData?.inflationAdjustment },
    { label: 'Risk Premium (5%)', value: estimateData?.riskPremium },
  ].filter(Boolean);

  const formatMoney = (n) =>
    typeof n === 'number' && !Number.isNaN(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 })
      : '-';

  return (
    <section className="max-w-4xl mx-auto mt-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="result-card ghana-accent p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Cost Breakdown</h3>
            <p className="text-gray-600">Detailed construction estimate for your project</p>
          </div>
        </div>
        
        {/* Project Details */}
        {estimateData?.projectDetails && (
          <div className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h4 className="font-semibold text-gray-800">Project Summary</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Floor Area</span>
                <p className="text-gray-600">
                  {estimateData.projectDetails.totalFloorArea} {estimateData.projectDetails.areaUnit}
                  {estimateData.projectDetails.areaUnit === 'sqft' && (
                    <span className="block text-xs text-gray-500">
                      (~{Math.round(estimateData.projectDetails.totalFloorAreaSqm)} sqm)
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Bathrooms</span>
                <p className="text-gray-600">{estimateData.projectDetails.numberOfBathrooms}</p>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Floors</span>
                <p className="text-gray-600">{estimateData.projectDetails.numberOfFloors}</p>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                <span className="font-medium text-gray-700">Type & Quality</span>
                <p className="text-gray-600 capitalize">
                  {estimateData.projectDetails.projectType} - {estimateData.projectDetails.finishQuality}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Region Information */}
        {estimateData?.regionData && (
          <div className="mb-6 region-info-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h4 className="font-semibold text-gray-800">
                Regional Data: {estimateData.regionData.name}
                {(estimateData.regionData.isCustomLandCost || estimateData.regionData.isCustomMaterialCost || estimateData.regionData.isCustomLaborCost) && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Custom Rates Applied</span>
                )}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`bg-white bg-opacity-60 p-3 rounded-lg ${estimateData.regionData.isCustomLandCost ? 'ring-2 ring-blue-300' : ''}`}>
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  Land Cost
                  {estimateData.regionData.isCustomLandCost && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </span>
                <p className="text-gray-600">{formatMoney(estimateData.regionData.landCost)} per plot</p>
              </div>
              <div className={`bg-white bg-opacity-60 p-3 rounded-lg ${estimateData.regionData.isCustomMaterialCost ? 'ring-2 ring-blue-300' : ''}`}>
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  Material Rate
                  {estimateData.regionData.isCustomMaterialCost && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </span>
                <p className="text-gray-600">{formatMoney(estimateData.regionData.constructionCostPerSqm)}/sqm</p>
              </div>
              <div className={`bg-white bg-opacity-60 p-3 rounded-lg ${estimateData.regionData.isCustomLaborCost ? 'ring-2 ring-blue-300' : ''}`}>
                <span className="font-medium text-gray-700 flex items-center gap-1">
                  Labor Rate
                  {estimateData.regionData.isCustomLaborCost && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </span>
                <p className="text-gray-600">{formatMoney(estimateData.regionData.laborCostPerDay)}/day</p>
              </div>
            </div>
          </div>
        )}
        
        <CostBreakdownGroups estimateData={estimateData} formatMoney={formatMoney} />
        <div className="total-cost-card p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            </div>
              <div>
                <span className="text-xl font-bold text-gray-800">Total Estimated Cost</span>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {formatMoney(estimateData?.totalCost)}
        </div>
        </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => generatePDFReport(estimateData)}
                className="btn-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Estimate Details</p>
              <p>Based on {constructionData.currency} rates for {estimateData?.regionData?.name || 'selected region'}. Includes permits, utilities, design fees, and regional adjustments.</p>
              <p className="mt-2 text-xs text-gray-500">Last updated: {constructionData.last_updated}</p>
            </div>
        </div>
        </div>
      </motion.div>

      {/* Materials List */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="result-card ghana-accent p-8 mt-6">
        <MaterialsList estimateData={estimateData} />
      </motion.div>

      {/* Workers List */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="result-card ghana-accent p-8 mt-6">
        <WorkersList estimateData={estimateData} />
      </motion.div>

      {/* Scope of Work */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="result-card ghana-accent p-8 mt-6">
        <ScopeOfWork estimateData={estimateData} />
      </motion.div>
    </section>
  );
}

// Tooltip Component
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 mt-1 text-sm bg-gray-900 text-white rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
}

// Cost Breakdown Groups Component
function CostBreakdownGroups({ estimateData, formatMoney }) {
  const [expandedGroups, setExpandedGroups] = useState({
    primary: true,
    construction: false,
    adjustments: false
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const primaryCosts = [
    { 
      label: 'Land Cost', 
      value: estimateData?.landCost, 
      highlight: true,
      tooltip: 'Cost of purchasing the land or plot for construction'
    },
    { 
      label: 'Base Construction Cost', 
      value: estimateData?.baseCost,
      tooltip: 'Core construction cost including materials and basic labor'
    },
    { 
      label: 'Bathroom Costs', 
      value: estimateData?.bathroomCost,
      tooltip: 'Additional costs for bathroom fixtures and installations'
    }
  ];

  if (estimateData?.externalWorks > 0) {
    primaryCosts.push({ 
      label: 'External Works', 
      value: estimateData?.externalWorks,
      tooltip: 'Landscaping, driveways, perimeter walls, and outdoor improvements'
    });
  }

  const constructionCosts = [
    { 
      label: 'Additional Fees', 
      value: estimateData?.additionalFees,
      tooltip: 'Permits, utilities connection, architectural design, and engineering fees'
    },
    { 
      label: 'Construction Subtotal', 
      value: (estimateData?.baseCost || 0) + (estimateData?.bathroomCost || 0) + (estimateData?.externalWorks || 0) + (estimateData?.additionalFees || 0),
      isSubtotal: true
    }
  ];

  const adjustmentCosts = [
    { 
      label: `Markup (${Math.round((estimateData?.markupRate || 0) * 100)}%)`, 
      value: estimateData?.markup,
      tooltip: 'Contractor profit margin and overhead costs'
    },
    { 
      label: `Contingency (${Math.round((estimateData?.contingencyRate || 0) * 100)}%)`, 
      value: estimateData?.contingency,
      tooltip: 'Buffer for unexpected costs and project variations'
    },
    { 
      label: `Location Adjustment (${((estimateData?.locationFactor || 1) - 1) * 100}%)`, 
      value: estimateData?.locationAdjustment,
      tooltip: 'Regional cost variations based on local market conditions'
    },
    { 
      label: 'Inflation Adjustment (3%)', 
      value: estimateData?.inflationAdjustment,
      tooltip: 'Adjustment for expected price increases during construction'
    },
    { 
      label: 'Risk Premium (5%)', 
      value: estimateData?.riskPremium,
      tooltip: 'Additional buffer for project risks and unforeseen circumstances'
    }
  ];

  const totalCost = estimateData?.totalCost || 0;

  const calculatePercentage = (value) => {
    return totalCost > 0 ? ((value / totalCost) * 100).toFixed(1) : 0;
  };

  const renderCostGroup = (title, costs, groupKey, icon) => {
    const isExpanded = expandedGroups[groupKey];
    const groupTotal = costs.reduce((sum, cost) => sum + (cost.value || 0), 0);
    const groupPercentage = calculatePercentage(groupTotal);

    return (
      <div className="mb-4 bg-white bg-opacity-60 rounded-lg overflow-hidden border border-gray-200">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleGroup(groupKey)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${icon.bgColor}`}>
              {icon.svg}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{title}</h4>
              <p className="text-sm text-gray-600">{groupPercentage}% of total cost</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-800">{formatMoney(groupTotal)}</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {isExpanded && (
          <div className="border-t border-gray-200">
            {costs.map((cost, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ${
                  cost.isSubtotal ? 'bg-gray-100 font-semibold border-t border-gray-300' : ''
                } ${cost.highlight ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`${cost.isSubtotal ? 'font-semibold' : ''} text-gray-700`}>
                    {cost.label}
                  </span>
                  {cost.tooltip && (
                    <Tooltip content={cost.tooltip}>
                      <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </Tooltip>
                  )}
                </div>
                <div className="text-right">
                  <span className={`${cost.isSubtotal ? 'font-bold text-lg' : 'font-semibold'} text-gray-800`}>
                    {formatMoney(cost.value)}
                  </span>
                  {!cost.isSubtotal && totalCost > 0 && (
                    <div className="text-xs text-gray-500">
                      {calculatePercentage(cost.value || 0)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 mb-6">
      {renderCostGroup(
        "Primary Costs",
        primaryCosts,
        "primary",
        {
          bgColor: "bg-blue-100 text-blue-600",
          svg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
        }
      )}

      {renderCostGroup(
        "Construction & Fees",
        constructionCosts,
        "construction",
        {
          bgColor: "bg-orange-100 text-orange-600",
          svg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        }
      )}

      {renderCostGroup(
        "Adjustments & Contingencies",
        adjustmentCosts,
        "adjustments",
        {
          bgColor: "bg-green-100 text-green-600",
          svg: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        }
      )}
    </div>
  );
}

// Materials List Component
function MaterialsList({ estimateData }) {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});

  if (!estimateData?.projectDetails) return null;

  const calculateMaterialQuantity = (material, totalFloorAreaSqm) => {
    return material.quantity_per_sqm * totalFloorAreaSqm;
  };

  const calculateMaterialCost = (material, quantity) => {
    return material.cost_per_unit * quantity;
  };

  const formatMoney = (n) =>
    typeof n === 'number' && !Number.isNaN(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 })
      : '-';

  const totalFloorAreaSqm = estimateData.projectDetails.totalFloorAreaSqm;

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortedMaterials = (materials) => {
    return [...materials].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'cost':
          aValue = calculateMaterialCost(a, calculateMaterialQuantity(a, totalFloorAreaSqm));
          bValue = calculateMaterialCost(b, calculateMaterialQuantity(b, totalFloorAreaSqm));
          break;
        case 'quantity':
          aValue = calculateMaterialQuantity(a, totalFloorAreaSqm);
          bValue = calculateMaterialQuantity(b, totalFloorAreaSqm);
          break;
        case 'rate':
          aValue = a.cost_per_unit;
          bValue = b.cost_per_unit;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const getFilteredMaterials = (materials) => {
    return materials.filter(material =>
      material.name.toLowerCase().includes(filterText.toLowerCase()) ||
      material.category.toLowerCase().includes(filterText.toLowerCase())
    );
  };

  const calculateCategoryTotal = (materials) => {
    return materials.reduce((total, material) => {
      const quantity = calculateMaterialQuantity(material, totalFloorAreaSqm);
      return total + calculateMaterialCost(material, quantity);
    }, 0);
  };

  const calculateGrandTotal = () => {
    return Object.values(constructionData.materials).reduce((grandTotal, materials) => {
      return grandTotal + calculateCategoryTotal(materials);
    }, 0);
  };

  const filteredCategories = selectedCategory === 'all' 
    ? Object.entries(constructionData.materials)
    : Object.entries(constructionData.materials).filter(([category]) => category === selectedCategory);

  const grandTotal = calculateGrandTotal();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">Materials List</h3>
          <p className="text-gray-600">Detailed breakdown of construction materials needed</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Materials Cost</div>
          <div className="text-xl font-bold text-orange-600">{formatMoney(grandTotal)}</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 p-4 bg-white bg-opacity-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Materials</label>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full input-field rounded-lg p-2 text-sm focus:outline-none focus-ring"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full input-field rounded-lg p-2 text-sm focus:outline-none focus-ring"
            >
              <option value="all">All Categories</option>
              {Object.keys(constructionData.materials).map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full input-field rounded-lg p-2 text-sm focus:outline-none focus-ring"
            >
              <option value="name">Name</option>
              <option value="cost">Total Cost</option>
              <option value="quantity">Quantity</option>
              <option value="rate">Unit Rate</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full input-field rounded-lg p-2 text-sm focus:outline-none focus-ring"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials by Category */}
      {filteredCategories.map(([category, materials]) => {
        const filteredMaterials = getFilteredMaterials(materials);
        const sortedMaterials = getSortedMaterials(filteredMaterials);
        const categoryTotal = calculateCategoryTotal(filteredMaterials);
        const categoryPercentage = grandTotal > 0 ? ((categoryTotal / grandTotal) * 100).toFixed(1) : 0;
        const isExpanded = expandedCategories[category] !== false; // Default to expanded

        if (filteredMaterials.length === 0) return null;

        return (
          <div key={category} className="mb-6 bg-white bg-opacity-60 rounded-lg overflow-hidden border border-gray-200">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 capitalize">
                    {category.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {filteredMaterials.length} items • {categoryPercentage}% of materials cost
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">{formatMoney(categoryTotal)}</span>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 font-semibold text-sm text-gray-700">
                  <button 
                    onClick={() => handleSort('name')}
                    className="text-left hover:text-gray-900 flex items-center gap-1"
                  >
                    Material
                    {sortBy === 'name' && (
                      <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                  <div>Unit</div>
                  <button 
                    onClick={() => handleSort('rate')}
                    className="text-left hover:text-gray-900 flex items-center gap-1"
                  >
                    Rate (GHS)
                    {sortBy === 'rate' && (
                      <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                  <button 
                    onClick={() => handleSort('quantity')}
                    className="text-left hover:text-gray-900 flex items-center gap-1"
                  >
                    Quantity
                    {sortBy === 'quantity' && (
                      <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                  <button 
                    onClick={() => handleSort('cost')}
                    className="text-left hover:text-gray-900 flex items-center gap-1"
                  >
                    Total Cost
                    {sortBy === 'cost' && (
                      <svg className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </div>
                {sortedMaterials.map((material, idx) => {
                  const quantity = calculateMaterialQuantity(material, totalFloorAreaSqm);
                  const totalCost = calculateMaterialCost(material, quantity);
                  const itemPercentage = categoryTotal > 0 ? ((totalCost / categoryTotal) * 100).toFixed(1) : 0;
                  
                  return (
                    <div key={idx} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                      <div className="font-medium text-gray-800">{material.name}</div>
                      <div className="text-gray-600">{material.unit}</div>
                      <div className="text-gray-600">{formatMoney(material.cost_per_unit)}</div>
                      <div className="text-gray-600">{quantity.toFixed(2)}</div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{formatMoney(totalCost)}</div>
                        <div className="text-xs text-gray-500">{itemPercentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Workers List Component
function WorkersList({ estimateData }) {
  if (!estimateData?.projectDetails) return null;

  const formatMoney = (n) =>
    typeof n === 'number' && !Number.isNaN(n)
      ? n.toLocaleString(undefined, { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 })
      : '-';

  const totalFloorAreaSqm = estimateData.projectDetails.totalFloorAreaSqm;

  const calculateWorkerDays = (worker, totalArea) => {
    return Math.ceil(totalArea / worker.productivity_sqm_per_day);
  };

  const calculateWorkerCost = (worker, days) => {
    return worker.daily_rate * days;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Workers & Labor</h3>
          <p className="text-gray-600">Required workforce and labor costs</p>
        </div>
      </div>

      {Object.entries(constructionData.workers).map(([skillLevel, workers]) => (
        <div key={skillLevel} className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 capitalize">{skillLevel.replace('_', ' ')} Workers</h4>
          <div className="bg-white bg-opacity-50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 font-semibold text-sm text-gray-700">
              <div>Role</div>
              <div>Daily Rate</div>
              <div>Productivity</div>
              <div>Days Needed</div>
              <div>Total Cost</div>
              <div>Category</div>
            </div>
            {workers.map((worker, idx) => {
              const daysNeeded = calculateWorkerDays(worker, totalFloorAreaSqm);
              const totalCost = calculateWorkerCost(worker, daysNeeded);
              return (
                <div key={idx} className="grid grid-cols-6 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                  <div className="font-medium text-gray-800">{worker.role}</div>
                  <div className="text-gray-600">{formatMoney(worker.daily_rate)}</div>
                  <div className="text-gray-600">{worker.productivity_sqm_per_day} sqm/day</div>
                  <div className="text-gray-600">{daysNeeded} days</div>
                  <div className="font-semibold text-gray-800">{formatMoney(totalCost)}</div>
                  <div className="text-gray-600 capitalize">{worker.category}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Scope of Work Component
function ScopeOfWork({ estimateData }) {
  if (!estimateData?.projectDetails) return null;

  const totalDuration = constructionData.scope_of_work.phases.reduce((sum, phase) => sum + phase.duration_days, 0);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Scope of Work</h3>
          <p className="text-gray-600">Construction phases and timeline ({totalDuration} days total)</p>
        </div>
      </div>

      <div className="space-y-4">
        {constructionData.scope_of_work.phases.map((phase, idx) => (
          <div key={idx} className="bg-white bg-opacity-70 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{phase.phase}</h4>
                <p className="text-sm text-gray-600">{phase.duration_days} days • {phase.percentage_of_total}% of total work</p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Phase {idx + 1}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Activities</h5>
                <ul className="space-y-1">
                  {phase.activities.map((activity, actIdx) => (
                    <li key={actIdx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Required Workers</h5>
                <div className="flex flex-wrap gap-2">
                  {phase.required_workers.map((worker, workerIdx) => (
                    <span key={workerIdx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {worker}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Key Materials</h5>
                <div className="flex flex-wrap gap-2">
                  {phase.required_materials.map((material, matIdx) => (
                    <span key={matIdx} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [estimateData, setEstimateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  // Get region data from JSON
  const getRegionData = (regionName) => {
    const region = constructionData.regions.find(r => r.name === regionName);
    return region || constructionData.regions[0]; // fallback to Accra
  };

  const getDefaultRates = (projectType, finishQuality) => {
    return {
      markupRate: constructionData.default_rates.markup_rate,
      contingencyRate: constructionData.default_rates.contingency_rate,
      inflationRate: constructionData.default_rates.inflation_rate,
      riskPremiumRate: constructionData.default_rates.risk_premium_rate,
    };
  };

  const calculateEstimate = (formData) => {
    const totalFloorArea = Number.parseInt(formData?.totalFloorArea, 10);
    const numberOfBathrooms = Number.parseInt(formData?.numberOfBathrooms, 10);
    const numberOfFloors = Number.parseInt(formData?.numberOfFloors, 10);

    if (
      Number.isNaN(totalFloorArea) ||
      Number.isNaN(numberOfBathrooms) ||
      Number.isNaN(numberOfFloors)
    ) {
      throw new Error('Invalid numeric input');
    }

    // Get region-specific data
    const regionData = getRegionData(formData?.region);
    const { markupRate, contingencyRate, inflationRate, riskPremiumRate } = getDefaultRates(
      formData?.projectType,
      formData?.preferredFinishQuality
    );

    // Handle area unit conversion
    let totalFloorAreaSqm;
    if (formData?.areaUnit === 'sqm') {
      totalFloorAreaSqm = totalFloorArea; // Already in square meters
    } else {
      totalFloorAreaSqm = totalFloorArea * 0.092903; // Convert sq ft to sq m
    }

    // Determine costs - use custom if provided, otherwise use regional data
    const landCostPerPlot = formData?.useCustomLandCost && formData?.customLandCost 
      ? parseFloat(formData.customLandCost) 
      : regionData.land_cost_per_plot;

    const constructionCostPerSqm = formData?.useCustomMaterialCost && formData?.customMaterialCost 
      ? parseFloat(formData.customMaterialCost) 
      : regionData.construction_cost_per_sqm;

    const laborCostPerDay = formData?.useCustomLaborCost && formData?.customLaborCost 
      ? parseFloat(formData.customLaborCost) 
      : regionData.labor_cost_per_day;

    // Base construction costs using determined rates
    const baseConstructionCost = totalFloorAreaSqm * constructionCostPerSqm;
    
    // Apply quality multiplier
    const qualityMultiplier = regionData.quality_multipliers[formData?.preferredFinishQuality] || 1.0;
    let adjustedConstructionCost = baseConstructionCost * qualityMultiplier;

    // Apply project type multiplier
    const projectTypeMultiplier = regionData.project_type_multipliers[formData?.projectType] || 1.0;
    adjustedConstructionCost *= projectTypeMultiplier;

    // Bathroom costs
    const bathroomCost = numberOfBathrooms * regionData.bathroom_cost;

    // Floor multiplier for additional floors
    const additionalFloors = Math.max(0, numberOfFloors - 1);
    const floorMultiplier = 1 + additionalFloors * regionData.floor_multiplier;
    adjustedConstructionCost *= floorMultiplier;

    // External works
    const externalWorksRate = formData?.includeExternalWorks ? regionData.external_works_rate : 0;
    const externalWorks = adjustedConstructionCost * externalWorksRate;

    // Additional fees
    const additionalFees = Object.values(regionData.additional_fees).reduce((sum, fee) => sum + fee, 0);

    // Calculate derived costs
    const markup = adjustedConstructionCost * markupRate;
    const contingency = adjustedConstructionCost * contingencyRate;
    const locationAdjustment = adjustedConstructionCost * (regionData.location_factor - 1);
    const inflationAdjustment = adjustedConstructionCost * inflationRate;
    const riskPremium = adjustedConstructionCost * riskPremiumRate;

    // Total cost calculation
    const subtotal = adjustedConstructionCost + bathroomCost + externalWorks + additionalFees;
    const totalCost = subtotal + markup + contingency + locationAdjustment + inflationAdjustment + riskPremium;

    return {
      materialCost: adjustedConstructionCost * 0.6, // Estimate 60% materials
      laborCost: adjustedConstructionCost * 0.3, // Estimate 30% labor
      equipmentCost: adjustedConstructionCost * 0.1, // Estimate 10% equipment
      baseCost: adjustedConstructionCost,
      landCost: landCostPerPlot, // Include land cost in breakdown
      bathroomCost,
      externalWorks,
      additionalFees,
      markupRate,
      contingencyRate,
      markup,
      contingency,
      locationFactor: regionData.location_factor,
      locationAdjustment,
      inflationAdjustment,
      riskPremium,
      totalCost: totalCost + landCostPerPlot, // Include land cost in total
      totalCostWithoutLand: totalCost, // Keep construction-only cost
      regionData: {
        name: regionData.displayName,
        landCost: landCostPerPlot,
        constructionCostPerSqm: constructionCostPerSqm,
        laborCostPerDay: laborCostPerDay,
        isCustomLandCost: formData?.useCustomLandCost || false,
        isCustomMaterialCost: formData?.useCustomMaterialCost || false,
        isCustomLaborCost: formData?.useCustomLaborCost || false
      },
      projectDetails: {
        totalFloorArea,
        areaUnit: formData?.areaUnit || 'sqm',
        totalFloorAreaSqm,
        numberOfBathrooms,
        numberOfFloors,
        projectType: formData?.projectType,
        finishQuality: formData?.preferredFinishQuality,
        includeExternalWorks: formData?.includeExternalWorks
      },
      inputs: { ...formData },
    };
  };

  const fetchEstimate = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Calculate locally using JSON data
      const result = calculateEstimate(formData);
      setEstimateData(result);
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || 'Failed to compute estimate';
      setError(message);
      setEstimateData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setLastFormData(formData);
    await fetchEstimate(formData);
  };

  const handleRetry = () => {
    if (lastFormData) fetchEstimate(lastFormData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="header-gradient text-white p-6 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ghanabuild.AI</h1>
              <p className="text-blue-100 font-medium">Advanced Construction Cost Estimator for Ghana</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-100">Accurate Regional Data</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-blue-100">Instant Calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="text-blue-100">All {constructionData.regions.length} Regions Covered</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow p-6 pb-20">
        <ProjectForm onFormSubmit={handleFormSubmit} isLoading={isLoading} />
        <EstimateSummary
          estimateData={estimateData}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </main>
      
      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
            {/* Copyright and Last Updated */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-green-500 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-medium">© {new Date().getFullYear()} Ghanabuild.AI</span>
              </div>
              <span className="hidden md:inline text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            
            {/* Quick Links and Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs">
              {/* Social Media Share */}
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg">
                <span className="text-gray-600 font-medium">Share:</span>
                <button 
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent('Check out Ghanabuild.AI - Advanced Construction Cost Estimator for Ghana! 🏗️🇬🇭');
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=550,height=350');
                  }}
                  className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=350');
                  }}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent('Ghanabuild.AI - Construction Cost Estimator');
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=350');
                  }}
                  className="text-blue-700 hover:text-blue-900 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    const text = 'Check out Ghanabuild.AI - Advanced Construction Cost Estimator for Ghana!';
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                  }}
                  className="text-green-600 hover:text-green-800 transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  title="Share on WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.488"/>
                  </svg>
                </button>
              </div>
              
              <span className="text-gray-300">•</span>
              
              {/* Donate Button */}
              <button 
                onClick={() => {
                  const donationMessage = `
🏗️ Support Ghanabuild.AI Development

Help us improve Ghana's construction industry with better cost estimation tools!

💰 Donate via Zelle:
📧 nii.andrews@gmail.com

Your support helps us:
✅ Keep the platform free
✅ Add more regions & features  
✅ Improve data accuracy
✅ Support more contractors

Thank you for building Ghana's future with us! 🇬🇭
                  `.trim();
                  
                  if (navigator.share) {
                    navigator.share({
                      title: 'Support Ghanabuild.AI',
                      text: donationMessage
                    });
                  } else {
                    navigator.clipboard.writeText(donationMessage).then(() => {
                      alert('Donation info copied to clipboard!\n\nZelle: nii.andrews@gmail.com');
                    }).catch(() => {
                      alert('💰 Support Ghanabuild.AI\n\nDonate via Zelle:\nnii.andrews@gmail.com\n\nThank you for supporting Ghana\'s construction industry! 🇬🇭');
                    });
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
                title="Support our mission"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
                <span className="font-medium">Donate</span>
              </button>
              
              <span className="text-gray-300 hidden lg:inline">•</span>
              
              {/* Traditional Links */}
              <div className="hidden lg:flex items-center gap-3">
                <button 
                  onClick={() => window.open('#privacy', '_blank')}
                  className="text-gray-600 hover:text-blue-600 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 py-0.5"
                >
                  Privacy
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => window.open('#terms', '_blank')}
                  className="text-gray-600 hover:text-blue-600 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 py-0.5"
                >
                  Terms
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => window.open('mailto:support@ghanabuild.ai', '_blank')}
                  className="text-gray-600 hover:text-blue-600 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-1 py-0.5"
                >
                  Support
                </button>
              </div>
              
              <span className="text-gray-300 hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1">
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500 font-medium">Made for Ghana</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;