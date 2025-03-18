# Written by Etienne Richart
# Modified by John Win, Cuong Tran
from functools import reduce
import pandas as pd
import os

# function that take the column number to counts the number of non NaN in a column from row 10 to non-inclusive row_end
def count_times_played(sheet, center, row_start, row_end):
    countLeft = 0
    countRight = 0
    for i in range(row_start, row_end):
        if not pd.isna(sheet.iat[i, center-1]):
            countLeft += 1
        if not pd.isna(sheet.iat[i, center+1]):
            countRight += 1
    return countLeft, countRight

#Load the first file that end in '.xls' from the cop_input directory
cop_file = [file for file in os.listdir(r'./cop_input') if '.xls' == file[-4:]][0]
#Read the file into a list of pandas dataframes for each sheet in the file
cop_sheets = pd.read_excel(f"./cop_input/test.xlsx", sheet_name=None)
output_df = []
for sheet_name, sheet in cop_sheets.items():
    # It seems the code to generate the all sheets adds a blank sheet which messes up the program, and so we must skip that sheet
    if 'sheet' in sheet_name.casefold():
        continue
    rat_entry = dict()
    rat_entry['Rat'] = [sheet.iat[0,2]]
    #Left Time
    rat_entry[sheet.iat[5,0]] = [sheet.iat[5,2]]
    #Right Time
    rat_entry[sheet.iat[6,0]] = [sheet.iat[6,2]]

    #Finding the x,y of the cell with Center as its value
    center_row = sheet[sheet.isin(['Center']).any(axis=1)]
    center_y_index = center_row.index[0]
    center_x_index = 0
    for index, (_, data) in enumerate(center_row.iteritems()):
        if data.item() == 'Center':
            center_x_index = index
            break
    countLeft, countRight = count_times_played(sheet, center_x_index, center_y_index + 1, len(sheet))
    #Left Count
    rat_entry[f"{sheet.iat[center_y_index,center_x_index-1]} Count"] = [countLeft]
    #Right Count
    rat_entry[f"{sheet.iat[center_y_index,center_x_index+1]} Count"] = [countRight]

    #Left Chews
    rat_entry[sheet.iat[7,0]] = [sheet.iat[7,2]]
    #Left Hops
    rat_entry[sheet.iat[8,0]] = [sheet.iat[8,2]]
    #Left Ears
    rat_entry[sheet.iat[9,0]] = [sheet.iat[9,2]]
    #Center Hops
    rat_entry[sheet.iat[10,0]] = [sheet.iat[10,2]]
    #Center Ears
    rat_entry[sheet.iat[11,0]] = [sheet.iat[11,2]]
    #Right Chews
    rat_entry[sheet.iat[12,0]] = [sheet.iat[12,2]]
    #Right Hops
    rat_entry[sheet.iat[13,0]] = [sheet.iat[13,2]]
    #Right Ears
    rat_entry[sheet.iat[14,0]] = [sheet.iat[14,2]]

    temp_df = pd.DataFrame(rat_entry)
    output_df.append(temp_df)
df = reduce(lambda left, right: pd.merge(left,right, how='outer'), output_df)
df = df.sort_values(by=['Rat'])
#Turn DataFrame into a Excel document
df.to_excel('COPout.xlsx', index=False, sheet_name="COP Output")