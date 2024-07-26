import pandas as pd
from sklearn.preprocessing import StandardScaler


class PartitionData:
     # Class for partitioning data from csv
    def __init__(self, file_path):
        # Initialize the class with filepath
        # :param file_path:str, path to CSV_file
        self.file_path = file_path;
    
    def load_data(self):
        """
        Load the data from csv file,
        :return pandas Dataframe, data loaded from the CSV file
        """
        data = pd.read_csv(self.file_path)
        return data
    
    def get_X_y(self):
        
        """
        get the features (X) and target(y) variables from the data.
        return: tuple, features (X) and target(y) variables
        """
        # separating the data and labels

        data = self.load_data()
        # print(data.isnull().sum())
        Y = data['days_between_lead_supply']
        X = data.drop(columns = 'days_between_lead_supply', axis=1)
       
        scaler = StandardScaler()
        scaler.fit(X)
        standardized_data = scaler.transform(X)
        
        X = standardized_data
        
        return X,Y
        
        