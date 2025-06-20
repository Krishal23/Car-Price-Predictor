import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export const CarForm = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [options, setOptions] = useState({
        name: [],
        company: [],
        fuel_type: [],
        year: [],
    });
    const [loading, setLoading] = useState(true);
    const [filteredNames, setFilteredNames] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/retrive-values`)
            .then((res) => res.json())
            .then((data) => {
                setOptions({
                    name: data.name,
                    company: data.companies,    
                    fuel_type: data.fuel_type,
                    year: data.year
                });

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching options:", err);
                setLoading(false);
            });
    }, [API_URL]);

    useEffect(() => {
        if (selectedCompany) {
            const filtered = options.name.filter(n => n.toLowerCase().startsWith(selectedCompany.toLowerCase()));
            setFilteredNames(filtered);
        } else {
            setFilteredNames([]);
        }
    }, [selectedCompany, options.name]);


    const initialValues = {
        name: "",
        company: "",
        year: "",
        kms_driven: "",
        fuel_type: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Required"),
        company: Yup.string().required("Required"),
        year: Yup.number().required("Required"),
        kms_driven: Yup.number().min(0).required("Required"),
        fuel_type: Yup.string().required("Required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await fetch(`${API_URL}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (data?.prediction) {
                setPrediction(`Predicted Price: ₹ ${data.prediction}`);
            } else {
                setPrediction("Error: " + data?.error);
            }
            resetForm();
        } catch (err) {
            console.log(err);
            setPrediction("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading options...</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Car Price Prediction</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="space-y-4">
                        <div>
                            <label htmlFor="company" className="block font-medium">Company</label>
                            <Field as="select" name="company"
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    setFieldValue("company", e.target.value);
                                    setSelectedCompany(e.target.value);      
                                    setFieldValue("name", "");               
                                }}
                            >
                                <option value="">Select a company</option>
                                {options.company.map((comp, idx) => (
                                    <option key={idx} value={comp}>{comp}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="company" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="name" className="block font-medium">Car Name</label>
                            <Field as="select" name="name" className="w-full p-2 border rounded">
                                <option value="">Select a car</option>
                                {filteredNames.map((name, idx) => (
                                    <option key={idx} value={name}>{name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>


                        <div>
                            <label htmlFor="fuel_type" className="block font-medium capitalize">
                                Fuel Type
                            </label>
                            <Field as="select" name="fuel_type" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="">Select Fuel Type</option>
                                {options.fuel_type.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="fuel_type" component="div" className="text-red-500 text-sm" />
                        </div>

                        {/* year and kms_driven as number inputs */}
                        <div>
                            <label htmlFor="year" className="block font-medium capitalize">
                                Year
                            </label>
                            <Field as="select" name="year" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                                <option value="">Select Year</option>
                                {options.year.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="year" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label htmlFor="kms_driven" className="block font-medium capitalize">
                                Kms Driven
                            </label>
                            <Field
                                name="kms_driven"
                                type="number"
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <ErrorMessage name="kms_driven" component="div" className="text-red-500 text-sm" />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            {isSubmitting ? "Predicting..." : "Predict Price"}
                        </button>
                    </Form>
                )}
            </Formik>
            {prediction && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center font-semibold">
                    {prediction}
                </div>
            )}

        </div>
    );
};
