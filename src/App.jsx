import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import constructionData from './ghana-construction-data.json';

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
    const maxArea = formData.areaUnit === 'sqm' ? 1000 : 10000; // 1000 sqm max, 10000 sqft max
    const areaLabel = formData.areaUnit === 'sqm' ? 'sq m' : 'sq ft';
    
    if (
      isNaN(totalFloorArea) ||
      totalFloorArea < minArea ||
      totalFloorArea > maxArea ||
      totalFloorArea !== parseFloat(formData.totalFloorArea)
    ) {
      errors.push(
        `Total Floor Area must be an integer between ${minArea} and ${maxArea} ${areaLabel}.`
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
      if (isNaN(customLandCost) || customLandCost < 0 || customLandCost > 1000000) {
        errors.push("Custom land cost must be a valid number between 0 and 1,000,000 GHS.");
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
                max={formData.areaUnit === 'sqm' ? 1000 : 10000}
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
                ? 'Square meters (preferred in Ghana)' 
                : 'Square feet (1 sq ft = 0.093 sq m)'}
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
                      max={1000000}
                      step={1000}
                      placeholder="e.g., 120000"
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
        <div className="result-card p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Calculating Your Estimate</h3>
              <p className="text-gray-600">Analyzing construction costs for your project...</p>
              <div className="mt-4 w-64 bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
            </div>
          </div>
        </div>
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
        
        <div className="space-y-1 mb-6">
          {rows.map((row, idx) => (
            <div key={row.label} className={`py-3 px-4 rounded-lg flex items-center justify-between hover:bg-opacity-70 transition-colors ${
              row.highlight ? 'bg-blue-50 border border-blue-200' : 'bg-white bg-opacity-50'
            }`}>
              <span className="text-gray-700 font-medium flex items-center gap-2">
                {row.highlight && (
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                )}
                {row.label}
              </span>
              <span className="font-semibold text-gray-800">{formatMoney(row.value)}</span>
            </div>
          ))}
        </div>
        <div className="total-cost-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">Total Estimated Cost</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{formatMoney(estimateData?.totalCost)}</span>
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
    </section>
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
      <main className="flex-grow p-6">
        <ProjectForm onFormSubmit={handleFormSubmit} isLoading={isLoading} />
        <EstimateSummary
          estimateData={estimateData}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </main>
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Ghanabuild.AI</p>
                <p className="text-gray-400 text-sm">Building Ghana's Future</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="text-center">
                <p className="font-medium text-white">{constructionData.regions.length}</p>
                <p>Regions Covered</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-white">2025</p>
                <p>Data Updated</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Ghanabuild.AI. All rights reserved. | Empowering construction across Ghana</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;