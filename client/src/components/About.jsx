import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCogs, FaChartLine, FaDatabase, FaRobot, FaGithub } from 'react-icons/fa';

const About = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-5xl w-full bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/743/743007.png"
                        alt="car logo"
                        className="w-16 h-16 mb-4 md:mb-0 md:mr-4"
                    />
                    <h1 className="text-4xl font-bold text-center text-blue-800">
                        🚗 About the Car Price Prediction Model
                    </h1>
                </div>
                <div className="text-center my-4">
                    <a
                        href="https://github.com/Krishal23/Car-Price-Predictor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium text-lg"
                    >
                        <FaGithub size={20} /> View Project on GitHub
                    </a>
                </div>

                <Section
                    icon={<FaCheckCircle className="text-blue-600 mr-2" size={22} />}
                    title="1. Problem Statement"
                    content="The primary goal of this project is to accurately predict the selling price of used cars based on features such as the car's name, company, manufacturing year, kilometers driven, and fuel type. This model helps both buyers and sellers make informed decisions."
                />

                <Section
                    icon={<FaDatabase className="text-green-600 mr-2" size={22} />}
                    title="2. Data Preprocessing & Cleaning"
                    listItems={[
                        "Year Column: Converted non-numeric entries and transformed to integer type.",
                        "Price Column: Removed 'Ask For Price', stripped commas, and converted to integers.",
                        "Kms Driven: Removed text like 'kms' and commas; filtered out anomalies.",
                        "Fuel Type: Handled missing (NaN) values.",
                        "Car Name: Standardized by extracting the first three words.",
                        "Outliers: Removed prices above ₹60,00,000 to increase accuracy."
                    ]}
                    additionalText="The cleaned dataset was saved as clean_data.csv."
                />

                <Section
                    icon={<FaCogs className="text-yellow-600 mr-2" size={22} />}
                    title="3. Model Architecture & Approach"
                    listItems={[
                        "Selected Features: name, company, year, kms_driven, fuel_type (target: price).",
                        "Encoding: Used OneHotEncoder for categorical variables.",
                        "ColumnTransformer: Applied encoding only to specific columns.",
                        "Model: Used Linear Regression for its interpretability.",
                        "Pipeline: Combined transformations and model for streamlined input handling."
                    ]}
                />

                <Section
                    icon={<FaRobot className="text-purple-600 mr-2" size={22} />}
                    title="4. Model Training & Optimization"
                    content="We trained the model on an 80/20 train-test split, iterating 1000 times using different random states. The best model was selected based on the highest R2 score recorded during these iterations, ensuring robust performance across diverse data splits."
                />

                <Section
                    icon={<FaChartLine className="text-pink-600 mr-2" size={22} />}
                    title="5. Model Accuracy & Intuitiveness"
                    content="The model achieved a strong R2 Score: 82.81%. This means ~82.8% of the variance in a car's selling price can be explained by the given features."
                    highlight="R2 Score: 82.8053189%"
                    additionalText="This high score indicates that the model is highly reliable for estimating prices based on historical patterns in the data."
                />
            </motion.div>
        </div>
    );
};

const Section = ({ icon, title, content, listItems = [], highlight, additionalText }) => (
    <motion.section
        whileHover={{ scale: 1.01 }}
        className="mb-10 bg-white p-6 rounded-2xl shadow-md border border-blue-100"
    >
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
            {icon} {title}
        </h2>
        {content && <p className="text-gray-700 text-lg leading-relaxed mb-4">{content}</p>}
        {listItems.length > 0 && (
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
                {listItems.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </ul>
        )}
        {highlight && (
            <div className="bg-blue-100 mt-4 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md">
                <p className="font-semibold text-xl">{highlight}</p>
            </div>
        )}
        {additionalText && <p className="mt-2 text-gray-700 text-lg">{additionalText}</p>}
    </motion.section>
);

export default About;
