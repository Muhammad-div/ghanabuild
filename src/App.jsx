import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

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
          <div className="relative group">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
            <input
              id="region"
              name="region"
              type="text"
              value={formData.region}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Accra"
              aria-required="true"
            />
            <div className="absolute hidden group-hover:block bg-blue-600 text-white text-sm rounded py-2 px-3 -top-10 left-0 z-10">
              Enter a valid region (e.g., Accra, Kumasi-Tamale)
            </div>
          </div>
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">Project Type</label>
            <select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="relative group">
            <label htmlFor="totalFloorArea" className="block text-sm font-medium text-gray-700">Total Floor Area (sq ft)</label>
            <input
              id="totalFloorArea"
              name="totalFloorArea"
              type="number"
              min="500"
              max="10000"
              value={formData.totalFloorArea}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 2000"
              aria-required="true"
            />
            <div className="absolute hidden group-hover:block bg-blue-600 text-white text-sm rounded py-2 px-3 -top-10 left-0 z-10">
              Enter an integer between 500 and 10,000 sq ft
            </div>
          </div>
          <div className="relative group">
            <label htmlFor="numberOfBathrooms" className="block text-sm font-medium text-gray-700">Number of Bathrooms</label>
            <input
              id="numberOfBathrooms"
              name="numberOfBathrooms"
              type="number"
              min="1"
              max="10"
              value={formData.numberOfBathrooms}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 2"
              aria-required="true"
            />
            <div className="absolute hidden group-hover:block bg-blue-600 text-white text-sm rounded py-2 px-3 -top-10 left-0 z-10">
              Enter an integer between 1 and 10
            </div>
          </div>
          <div className="relative group">
            <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700">Number of Floors</label>
            <input
              id="numberOfFloors"
              name="numberOfFloors"
              type="number"
              min="1"
              max="5"
              value={formData.numberOfFloors}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g., 1"
              aria-required="true"
            />
            <div className="absolute hidden group-hover:block bg-blue-600 text-white text-sm rounded py-2 px-3 -top-10 left-0 z-10">
              Enter an integer between 1 and 5
            </div>
          </div>
          <div>
            <label htmlFor="preferredFinishQuality" className="block text-sm font-medium text-gray-700">Preferred Finish Quality</label>
            <select
              id="preferredFinishQuality"
              name="preferredFinishQuality"
              value={formData.preferredFinishQuality}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="standard">Standard</option>
              <option value="luxury">Luxury</option>
              <option value="eco-friendly">Eco-Friendly</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="includeExternalWorks"
              name="includeExternalWorks"
              checked={formData.includeExternalWorks}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="includeExternalWorks" className="ml-2 text-sm font-medium text-gray-700">
              Include External Works (e.g., landscaping)
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full p-2 rounded-md ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {isLoading ? 'Calculating...' : 'Calculate Cost Estimate'}
          </button>
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
      <motion.section
        className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Estimated Cost</h2>
        <div className="space-y-2">
          <p className="text-gray-600 text-center">Generating estimate... ({progress}%)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section
        className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Estimated Cost</h2>
        <p className="text-red-600">{error}</p>
        {estimateData?.details && estimateData.details.length > 0 && (
          <ul className="list-disc pl-5 mt-2 text-red-600">
            {estimateData.details.map((detail, i) => (
              <li key={i}>{detail}</li>
            ))}
          </ul>
        )}
        <button
          onClick={onRetry}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Retry
        </button>
      </motion.section>
    );
  }

  if (!estimateData) {
    return (
      <motion.section
        className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">Estimated Cost</h2>
        <p className="text-gray-600">Please fill out the form to generate an estimate.</p>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="max-w-4xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">Estimated Cost</h2>
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium">Project Details</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Region: {estimateData.user_inputs.region}</li>
            <li>Project Type: {estimateData.user_inputs.projectType}</li>
            <li>Total Floor Area: {estimateData.user_inputs.totalFloorArea} sq ft</li>
            <li>Bathrooms: {estimateData.user_inputs.numberOfBathrooms}</li>
            <li>Floors: {estimateData.user_inputs.numberOfFloors}</li>
            <li>Finish Quality: {estimateData.user_inputs.preferredFinishQuality}</li>
            <li>External Works: {estimateData.user_inputs.includeExternalWorks ? "Yes" : "No"}</li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium">Cost Estimate</h3>
          <p className="text-gray-600">
            Total Cost: ${estimateData.estimate.total_cost.toLocaleString()}
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>
              Materials: ${estimateData.estimate.breakdown.materials.toLocaleString()}
            </li>
            <li>
              Labor: ${estimateData.estimate.breakdown.labor.toLocaleString()}
            </li>
            <li>
              External Works: ${estimateData.estimate.breakdown.external_works.toLocaleString()}
            </li>
          </ul>
          <p className="text-gray-600">
            Confidence Interval: ${estimateData.estimate.confidence_interval[0].toLocaleString()} - ${estimateData.estimate.confidence_interval[1].toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium">Optimizations</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {estimateData.optimizations.recommendations.map((rec, i) => (
              <li key={i}>
                {rec.material}: Saves ${rec.savings} ({rec.impact})
              </li>
            ))}
          </ul>
          <p className="text-gray-600">
            Total Savings: ${estimateData.optimizations.total_savings.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="text-lg font-medium">Ethical Review</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {estimateData.ethical_review.flags.map((flag, i) => (
              <li key={i}>
                {flag.issue}: {flag.mitigation}
              </li>
            ))}
          </ul>
          <p className="text-gray-600">Status: {estimateData.ethical_review.status}</p>
        </motion.div>
      </div>
      {estimateData && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </motion.section>
  );
}

function App() {
  const [estimateData, setEstimateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  const fetchEstimate = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        "https://ghanabuild-backend.onrender.com/estimate",
        formData,
        { timeout: 15000 }
      );
      setEstimateData(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch estimate");
      setEstimateData(
        err.response?.data?.details
          ? { details: err.response.data.details }
          : null
      );
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
