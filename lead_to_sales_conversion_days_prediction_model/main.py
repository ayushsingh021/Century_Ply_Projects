from src.data_ingest import DataIngestion
from src.data_processing import DataProcessing
from src.data_partitioning import PartitionData
from sklearn.model_selection import train_test_split

from xgboost import XGBRegressor
from sklearn import metrics
import pandas as pd

import os



if __name__ == "__main__":
    # print("running")
    data_ingest = DataIngestion("Data/Lead.csv" , "Data/Sales.csv")
    
    data_for_encoding = data_ingest.final_data_ready_for_processing();
    
    data_for_encoding.to_csv('Data/ready_for_processing.csv', index=False)
    
    data_encoding = DataProcessing('Data/ready_for_processing.csv');
    encoded_df = data_encoding.oneHotEncoding()
   
    encoded_df.to_csv('Data/ready_for_model.csv', index=False)
    
    data_partitioned = PartitionData("Data/ready_for_model.csv")
    X, Y = data_partitioned.get_X_y(); 
    
    # model
    
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=2)
    
        # Before splitting the data, check for NaN values in Y
    # print("NaN values in Y_train:", Y_train.isnull().sum())
    # print("NaN values in Y_test:", Y_test.isnull().sum())

# Drop rows with NaN values in Y_train and Y_test
    # X_train = X_train[~Y_train.isnull()]
    # Y_train = Y_train.dropna()
    # X_test = X_test[~Y_test.isnull()]
    # Y_test = Y_test.dropna()
    params = {
    'learning_rate':0.1,
    'max_depth': 3,
    'n_estimators': 100,
    'gamma': 0,
    'colsample_bytree': 0.8,
    'objective': 'reg:squarederror',  # For regression tasks
    'eval_metric': 'rmse',  # Evaluation metric
    'random_state': 42  # Random seed for reproducibility
    }
    regressor = XGBRegressor(**params)
    regressor.fit(X_train, Y_train)
    
    # prediction on training data
    training_data_prediction = regressor.predict(X_train)
    
    
    r2_train = metrics.r2_score(Y_train, training_data_prediction)
    print('R Squared value for train = ' ,r2_train)
    
    # prediction on test data
    test_data_prediction = regressor.predict(X_test)
    # R squared Value
    r2_test = metrics.r2_score(Y_test, test_data_prediction)
    print('R Squared value for test = ', r2_test)
    
    # print(len(training_data_prediction))
    # print(len(Y_train))
    # print(len(test_data_prediction))
    # print(len(Y_test))

    train_df = pd.DataFrame({
        'Training Prediction': training_data_prediction,
        'Y_train': Y_train,
    })
    test_df = pd.DataFrame({
        'Testing Prediction': test_data_prediction,
        'Y_test': Y_test
    })
    

    train_df.to_csv("Data/predictions_and_targets_train.csv", index=False)
    test_df.to_csv("Data/predictions_and_targets_test.csv", index=False)
    
    
    
    
    os.remove("Data/ready_for_model.csv")
    os.remove("Data/ready_for_processing.csv")
    
    
    
    
    
    