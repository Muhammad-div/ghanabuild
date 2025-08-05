import React, { useState } from "react";

function EstimatorForm() {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(process.env.REACT_APP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form inputs */}
      <input name="example" onChange={handleChange} />
      <button type="submit">Estimate</button>
      {result && <div>Result: {JSON.stringify(result)}</div>}
    </form>
  );
}

export default EstimatorForm;