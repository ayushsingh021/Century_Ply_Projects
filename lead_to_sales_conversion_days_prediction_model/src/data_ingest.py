import pandas as pd

class DataIngestion:
     # Class for ingesting data from csv
    
    #constructor
    def __init__(self, file_path1 , file_path2):
        # Initialize the class with filepath
        # :param file_path:str, path to CSV_file
        self.file_path1 = file_path1;
        self.file_path2 = file_path2;
        
    def load_data(self):
        """
        Load the data from csv file,
        :return pandas Dataframe, data loaded from the CSV file
        """
        try:
            data1 = pd.read_csv(self.file_path1, encoding='latin1')
            data2 = pd.read_csv(self.file_path2, encoding='latin1')
            return data1, data2
        except Exception as e:
            print("Error loading data:", e)
            return None, None
    
    def lead_sales_data_merge(self):
        
        df1, df2 = self.load_data()
        if df1 is None or df2 is None:
            return None
        
        try:
            merged_df = pd.merge(df1, df2, on='Lead ID', how='inner')
            return merged_df
        except Exception as e:
            print("Error merging data:", e)
            return None
    
    def removing_not_usable_features(self):
        # List of columns to be removed
        lead_conv_to_sales_data = self.lead_sales_data_merge()
        
        cols_to_remove = ['Lead ID', 'House No./ Flat No.', 
                          'Drop Reason: Picklist Value',
                          'EMD at Lead Creation_x','Expected Maturity Date_x',
                          'EMD Changed BY: Team Member Id','EMD Changed BY: Team Member Name',
                          'Lead Created By: Team Member Id_x','Lead Created By: Team Member Name_x',
                          'Primary Owner: Team Member Id_x','Primary Owner: Team Member Name_x',
                          'Secondary Owner: Team Member Id','Secondary Owner: Team Member Name',
                          'Owner Name_x','Owner Number_x','Address','Territory Code','Town name: Code_x',
                          'Town name','Grid: Code',
                          'Grid: Name','Last Modified Date',
                          'Brand','Inactive_date',
                          'Inactive By: Team Member Id','Call  Center Disposition',
                          'Pincode As per GPS','State',
                          'Landmark','Conversion Verified',
                          'Lost date','Old Lead ID',
                          'Validation date','Lead Created By: Phone Number',
                          'Site Name_y','Lead Source Type: Picklist Value_y',
                          'Source of Lead: Picklist Value_y','Primary Owner: Team Member Id_y',
                          'Primary Owner: Team Member Name_y','Supply Created By: Team Member Id',
                          'Supply Created By: Team Member Name','Lead Created By: Team Member Id_y',
                          'Lead Created By: Team Member Name_y','Lob_y',
                          'Division_y','Lead Created Date_y',
                          'Town name: Code_y','Town name: Name',
                          'Geographical Town: Town Code_y','Geographical Town: Town Name',
                          'Site Status: Picklist Value_y','Secondary Territory Code',
                          'Secondary Territory Name','Supply Account ID',
                          'Supply Account Name','Primary: Territory: Code',
                          'Primary : Territory: Name','Supply Approval: Picklist Value',
                          'Branch Code','Branch_y','EMD at Lead Creation_y',
                          'Expected Maturity Date_y','Site Address as per GPS',
                          'Owner Name_y','Sale Remarks' , 
                          'Owner Number_y', 'Site Type-1: Picklist Value',
                          'Site Type-2: Picklist Value','Number of attempts',
                          'Branch_x' , 'Site Name_x',
                          'Territory Name','Geographical Town: Town Code_x',
                          'Geographical Town Name']  # Replace with the actual column names
        
        lead_conv_to_sales_data.drop(columns=cols_to_remove , inplace= True)
        
        return lead_conv_to_sales_data;
    
    def features_with_excessive_null_val(self):
        cleaned_data = self.removing_not_usable_features();
        null_percentage = cleaned_data.isnull().mean() * 100

        # List columns with more than 50% null values
        columns_to_drop = null_percentage[null_percentage > 50].index

        # Drop columns with more than 50% null values
        cleaned_data.drop(columns=columns_to_drop, inplace=True)
        
        # Drop rows where the value in the 'supply_data' column is null
        cleaned_data.dropna(subset=['Supply Date'], inplace=True)
        
        return cleaned_data
    
    def creating_target_var_col(self):
        final_data = self.features_with_excessive_null_val()
        final_data['lead_date'] = pd.to_datetime(final_data['Lead Created Date_x'], format='%d-%m-%Y')
        final_data['supply_date'] = pd.to_datetime(final_data['Supply Date'], format='%d-%m-%Y')
        
        # Calculate the number of days between 'lead_date' and 'supply_date' and store it in a new column
        final_data['days_between_lead_supply'] = (final_data['supply_date'] - final_data['lead_date']).dt.days
        
        # After the calculation of target variable days_between_lead_supply we will remove the cols of lead_date and supply date
        final_data.drop(columns=['Lead Created Date_x', 'Supply Date','lead_date','supply_date'], inplace=True)
        
        return final_data
        
    def dealing_with_empty_val(self):
    # Filling missing values in "Qnantity Supplied" column with the mean value

        data_frame = self.creating_target_var_col();
        # filling the missing values in "Qnantity Supplied column" with "Mean" value
        data_frame['Qnantity Supplied'].fillna(data_frame['Qnantity Supplied'].mean(),)
        
        #droping the row if any val of it is null
        data_frame = data_frame.dropna(how='any')
        
        return data_frame;
    
    def final_data_ready_for_processing(self):
        df = self.dealing_with_empty_val();
        return df;
    
    # #final step -- first thing is data cleaning
    # def get_X_y(self):
        
    #     """
    #     get the features (X) and target(y) variables from the data.
    #     return: tuple, features (X) and target(y) variables
    #     """
    #     data = self.load_data()
    #     X = data[["TV"]]
    #     y = data[["sales"]]
        
    #     #combine them in single df
    #     df = pd.concat([X,y], axis = 1)
    #     return X, y, df