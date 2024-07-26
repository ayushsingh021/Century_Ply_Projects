import pandas as pd

from sklearn.preprocessing import OneHotEncoder

class DataProcessing:
    # class for Processing for data
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

    
    #Label Encoding
    def labelEncoding(self):
        
        pd.set_option('future.no_silent_downcasting', True)  # Set the option to opt-in to future behavior
        data_frame = self.load_data();
        data_frame.replace({'Lead - Open/Closed: Picklist Value': {'Closed':0 ,'Open':1}}, inplace=True)
        data_frame.replace({'Active Status: Picklist Value': {'InActive':0 ,'Active':1}}, inplace=True)
        
        return data_frame
    
    # def oneHotEncoding(self):
    #     data_frame_2 = self.labelEncoding()
        
    #     categorical_columns = data_frame_2.select_dtypes(include=['object']).columns.tolist();
    #     #Initialize OneHotEncoder
    #     encoder = OneHotEncoder(sparse_output=False)
    #     # Apply one-hot encoding to the categorical columns
    #     data_frame_2 = encoder.fit_transform(data_frame_2[categorical_columns])

    #     #Create a DataFrame with the one-hot encoded columns
    #     #We use get_feature_names_out() to get the column names for the encoded data
    #     one_hot_df = pd.DataFrame(data_frame_2, columns=encoder.get_feature_names_out(categorical_columns))

    #     # Concatenate the one-hot encoded dataframe with the original dataframe
    #     data_frame_2 = pd.concat([data_frame_2, one_hot_df], axis=1)

    #     # Drop the original categorical columns
    #     data_frame_2 = data_frame_2.drop(categorical_columns, axis=1)
        
    #     return data_frame_2
    
    def oneHotEncoding(self):
        data_frame_2 = self.labelEncoding()
    
        categorical_columns = data_frame_2.select_dtypes(include=['object']).columns.tolist()
        # Initialize OneHotEncoder
        encoder = OneHotEncoder(sparse_output=False)
        # Apply one-hot encoding to the categorical columns
        data_frame_encoded = encoder.fit_transform(data_frame_2[categorical_columns])

        # Create a DataFrame with the one-hot encoded columns
        one_hot_df = pd.DataFrame(data_frame_encoded, columns=encoder.get_feature_names_out(categorical_columns))

        # Concatenate the one-hot encoded dataframe with the original dataframe
        data_frame_2 = pd.concat([data_frame_2.drop(columns=categorical_columns), one_hot_df], axis=1)

        return data_frame_2
        
        

        
    
        