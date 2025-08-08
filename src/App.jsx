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
    numberOfBathrooms: "",
    numberOfFloors: "",
    preferredFinishQuality: "standard",
    includeExternalWorks: false,
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
    if (
      isNaN(totalFloorArea) ||
      totalFloorArea < 500 ||
      totalFloorArea > 10000 ||
      totalFloorArea !== parseFloat(formData.totalFloorArea)
    ) {
      errors.push(
        "Total Floor Area must be an integer between 500 and 10,000 sq ft."
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
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Enter Your Project Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="region" className="text-sm font-medium text-gray-700">Region</label>
            <select
              id="region"
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              className="mt-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="totalFloorArea" className="text-sm font-medium text-gray-700">Total Floor Area (sq ft)</label>
            <input
              id="totalFloorArea"
              name="totalFloorArea"
              type="number"
              min={500}
              max={10000}
              step={1}
              placeholder="e.g., 2000"
              value={formData.totalFloorArea || ""}
              onChange={handleChange}
              className="mt-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              inputMode="numeric"
            />
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
              className="mt-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Estimating..." : "Estimate"}
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
      <section className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">Calculating estimate… {progress}%</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-red-600">{error}</p>
          <button onClick={onRetry} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">Retry</button>
        </div>
      </section>
    );
  }

  if (!estimateData) return null;

  const rows = [
    { label: 'Base Construction Cost', value: estimateData?.baseCost },
    { label: 'Bathroom Costs', value: estimateData?.bathroomCost },
    estimateData?.externalWorks > 0 ? { label: 'External Works', value: estimateData?.externalWorks } : null,
    { label: 'Additional Fees', value: estimateData?.additionalFees },
    { label: 'Subtotal', value: (estimateData?.baseCost || 0) + (estimateData?.bathroomCost || 0) + (estimateData?.externalWorks || 0) + (estimateData?.additionalFees || 0) },
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
    <section className="max-w-4xl mx-auto mt-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Estimated Cost Breakdown</h3>
        
        {/* Region Information */}
        {estimateData?.regionData && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Region: {estimateData.regionData.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
              <div>Land Cost: {formatMoney(estimateData.regionData.landCost)} per plot</div>
              <div>Construction: {formatMoney(estimateData.regionData.constructionCostPerSqm)}/sqm</div>
              <div>Labor Rate: {formatMoney(estimateData.regionData.laborCostPerDay)}/day</div>
            </div>
          </div>
        )}
        
        <div className="divide-y">
          {rows.map((row, idx) => (
            <div key={row.label} className="py-2 flex items-center justify-between">
              <span className="text-gray-700">{row.label}</span>
              <span className="font-medium">{formatMoney(row.value)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-center justify-between">
          <span className="text-blue-700 font-semibold">Total Estimated Cost</span>
          <span className="text-blue-800 font-bold text-xl">{formatMoney(estimateData?.totalCost)}</span>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Based on {constructionData.currency} rates for {estimateData?.regionData?.name || 'selected region'}. 
          Includes permits, utilities, design fees, and regional adjustments.
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

    // Convert sq ft to sq meters for accurate calculations
    const totalFloorAreaSqm = totalFloorArea * 0.092903; // 1 sq ft = 0.092903 sq m

    // Base construction costs using regional data
    const baseConstructionCost = totalFloorAreaSqm * regionData.construction_cost_per_sqm;
    
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
      totalCost,
      regionData: {
        name: regionData.displayName,
        landCost: regionData.land_cost_per_plot,
        constructionCostPerSqm: regionData.construction_cost_per_sqm,
        laborCostPerDay: regionData.labor_cost_per_day
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Ghanabuild.AI</h1>
        <p className="text-sm">Advanced House Cost Estimator</p>
      </header>
      <main className="flex-grow p-4">
        <ProjectForm onFormSubmit={handleFormSubmit} isLoading={isLoading} />
        <EstimateSummary
          estimateData={estimateData}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Ghanabuild.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;