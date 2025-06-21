import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FaCarSide, FaGasPump, FaCalendarAlt, FaRoad } from "react-icons/fa";
import About from "./About";

export const CarForm = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const [options, setOptions] = useState({ name: [], company: [], fuel_type: [], year: [] });
    const [loading, setLoading] = useState(true);
    const [filteredNames, setFilteredNames] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [submittedValues, setSubmittedValues] = useState(null);
    const [aboutPop, setAboutPop] = useState(false)

    useEffect(() => {
        fetch(`${API_URL}/retrive-values`)
            .then(res => res.json())
            .then(data => {
                setOptions({
                    name: data.name,
                    company: data.companies,
                    fuel_type: data.fuel_type,
                    year: data.year
                });
                setLoading(false);
            })
            .catch(err => {
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
                setPrediction(data.prediction);
                setSubmittedValues(values);
            } else {
                setPrediction("Error: " + data?.error);
                setSubmittedValues(null);
            }
            resetForm();
        } catch (err) {
            console.log(err);
            setPrediction("Something went wrong");
            setSubmittedValues(null);
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading options...</div>;

    return (
        <div
            className="min-h-screen bg-fixed bg-cover bg-center p-4 "
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1350&q=80)` }}
        >
            {
                aboutPop && <About onClose={() => setAboutPop(false)} />
            }

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-xl mx-auto mt-10 bg-white/90 backdrop-blur p-6 rounded-2xl shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center  mb-6">

                        <img
                            src="https://i.pinimg.com/736x/94/18/71/94187161004d98b31349fe7c66663e02.jpg"
                            alt="Car"
                            className="h-20 mr-2"
                        />

                        <h2 className="text-3xl font-bold text-blue-700">Car Price Predictor</h2>
                    </div>
                    <button className="text-md font-normal items-center text-gray-500" onClick={() => { setAboutPop(true) }}>About</button>
                </div>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="space-y-4">
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <label htmlFor="company" className="block font-medium">Company</label>
                                <Field as="select" name="company" className="w-full p-2 border rounded"
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
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }}>
                                <label htmlFor="name" className="block font-medium">Car Name</label>
                                <Field as="select" name="name" className="w-full p-2 border rounded">
                                    <option value="">Select a car</option>
                                    {filteredNames.map((name, idx) => (
                                        <option key={idx} value={name}>{name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }}>
                                <label htmlFor="fuel_type" className="block font-medium flex items-center">
                                    <FaGasPump className="mr-2" /> Fuel Type
                                </label>
                                <Field as="select" name="fuel_type" className="w-full p-2 border rounded">
                                    <option value="">Select Fuel Type</option>
                                    {options.fuel_type.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="fuel_type" component="div" className="text-red-500 text-sm" />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }}>
                                <label htmlFor="year" className="block font-medium flex items-center">
                                    <FaCalendarAlt className="mr-2" /> Year
                                </label>
                                <Field as="select" name="year" className="w-full p-2 border rounded">
                                    <option value="">Select Year</option>
                                    {options.year.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="year" component="div" className="text-red-500 text-sm" />
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }}>
                                <label htmlFor="kms_driven" className="block font-medium flex items-center">
                                    <FaRoad className="mr-2" /> Kms Driven
                                </label>
                                <Field
                                    name="kms_driven"
                                    type="number"
                                    className="w-full p-2 border rounded"
                                />
                                <ErrorMessage name="kms_driven" component="div" className="text-red-500 text-sm" />
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700"
                            >
                                {isSubmitting ? "Predicting..." : "Predict Price"}
                            </motion.button>
                        </Form>
                    )}
                </Formik>

                {prediction && submittedValues && typeof prediction === "number" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-6 bg-green-50 border border-green-400 text-green-900 rounded-lg shadow-sm space-y-2"
                    >
                        <h3 className="text-lg font-bold text-center">Prediction Summary</h3>
                        <p><strong>Company:</strong> {submittedValues.company}</p>
                        <p><strong>Car Name:</strong> {submittedValues.name}</p>
                        <p><strong>Fuel Type:</strong> {submittedValues.fuel_type}</p>
                        <p><strong>Year:</strong> {submittedValues.year}</p>
                        <p><strong>Kms Driven:</strong> {submittedValues.kms_driven}</p>
                        <p className="text-xl mt-2 text-center font-semibold text-green-700">
                            🚗 Estimated Price: ₹ {prediction}
                        </p>
                    </motion.div>
                )}

            </motion.div>
        </div>
    );
};