import os 
from flask import Flask, render_template, request,jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app= Flask(__name__)
CORS(app)

car=pd.read_csv('clean_data.csv')
model = pickle.load(open("Car-Prediction-Model.pkl","rb"))

# create route
@app.route('/retrive-values')
def values():
    return jsonify({
        'companies': sorted(car['company'].unique().tolist()),
        'name': sorted(car['name'].unique().tolist()),
        'year': sorted([int(x) for x in car['year'].unique()], reverse=True),
        'fuel_type': sorted(car['fuel_type'].unique().tolist())
    })
  
    
    
        


@app.route('/predict',methods=['POST'])
def predict():
    data=request.get_json()
     
    try:
        input_df=pd.DataFrame([[
            data['name'],
            data['company'],
            int(data['year']),
            int(data['kms_driven']),
            data['fuel_type']
        ]], columns=['name','company','year','kms_driven','fuel_type'])
        prediction=model.predict(input_df)[0]
        return jsonify({'prediction':int(prediction)})
    except Exception as e:
        return jsonify({'error':str(e)})


if __name__=="__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 