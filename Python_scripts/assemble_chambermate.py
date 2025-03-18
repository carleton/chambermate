# python file to assemble all the total exits from the worksheets
# Paula gave me.

from xlrd import *
from xlwt import *
import os




def range_count(sheet, col, startrow, endrow):
    count = 0
    ls = sheet.col_slice(col, startrow, endrow)
    # return len( [each for each in ls if each.ctype == XL_CELL_NUMBER ] )
    
    for each in ls:
        if each.ctype == XL_CELL_NUMBER: # if number
            count += 1
                
    return count
    
def range_count_if_greater_equal(sheet, col, startrow, endrow, num):
    count = 0
    ls = sheet.col_slice(col, startrow, endrow)
    # return len( [each for each in ls if each.ctype == XL_CELL_NUMBER and each.value >= num] )
    for each in ls:
        if each.ctype == XL_CELL_NUMBER: # if number
            if each.value >= num:
                count += 1
                
    return count


def range_avg(sheet, col, startrow, endrow):
    sum = 0
    count = 0
    ls = sheet.col_slice(col, startrow, endrow)
    # lsv = [each.value for each in ls if each.ctype == XL_CELL_NUMBER ]
    # if len(ls) == 0:
    #    return 0
    # return (float(sum(lsv)) / float(len(lsv)))
    
    for each in ls:
        if each.ctype == XL_CELL_NUMBER: # if number
            sum += each.value
            count += 1
    if count == 0 and sum == 0:
        return ""
    return (float(sum)/float(count))

def range_sum(sheet, col, startrow, endrow):
    sum = 0
    ls = sheet.col_slice(col, startrow, endrow)
    #return sum( [ each for each.value in ls if ls.ctype == XL_CELL_NUMBER ] )
    count = 0
    for each in ls:
        if each.ctype == XL_CELL_NUMBER: # if number
            sum += each.value
            count += 1
    if count == 0:
        return ""
        
    return sum

def main():
    files = os.listdir("input")
    files = [ file for file in files if file[-4:] == ".xls" ]
    files = [ file for file in files if "other" not in file ]
    
    #files = ["Clides Baseline.xls", "Clides Lido 1.xls"]
    dir = os.path.join(os.getcwd(),"input")
    res = []
    results = Workbook()
    
    reads = None
    num = 0
    denum = 0 # assert that denum is not zero. If it is just put #error
    # remember to describe the error
    exit_mounts = 0
    exit_intros = 0
    exit_ejac = 0

    crm_mount = 0
    crm_intro = 0
    crm_ejac = 0

    texitmount = 0
    texitintro = 0
    texitejac = 0

    lq = 0
    lr = 0
    
    twm = 0
    mounts = 0
    intros = 0
    ejacs = 0
    ins = 0
    outs = 0
    secs = 0
    hops_in = 0
    ears_in = 0
    hops_out = 0
    ears_out = 0
    rej = 0

    
    # calcexit -> (num/denum) * 100
    for file in files:
        res = []
        sheet_res = results.add_sheet(file,cell_overwrite_ok=True)

        reads = open_workbook(os.path.join(dir,file))
        
        try:
            readsother = open_workbook(os.path.join(dir,file[:-4]+" other.xls"))
        except:
            readsother = None
            
        # TODO -- replace the writing to write the new variables
        for i in range(reads.nsheets):
            sheet = reads.sheet_by_index(i)
            
            # calculate exits here
            if readsother:
                if sheet.cell(3,2).ctype == 0: # Is there no date?
                    sheet = readsother.sheet_by_name(sheet.name) # Okay, look at the sheet on the other workbook
                    if sheet.cell(3,2).ctype == 0: # Okay, it's empty too; moving on.
                        continue
                else:
                    if readsother.sheet_by_name(sheet.name).cell(3,2).ctype != 0: # Are _neither_ empty?! Yikes!
                        print("Collision on sheet", sheet.name)
                        res.extend( zip([file]*len(data_values), [i]*len(data_values), data_fields, ["COLLISION"]*len(data_values)))
                        #continue
            # exit mounts
            if range_count(sheet, 3, 18, 130) == 0:
                exit_mounts = ""
            else:
                exit_mounts= round(((float(range_count(sheet, 9, 18, 130))/
                                float(range_count(sheet, 3, 18, 130)))*100),2)
            # exit intro
            if range_count(sheet, 5, 18, 130) == 0:
                exit_intros = ""
            else:
                exit_intros= round(((float(range_count(sheet, 11, 18, 130))/
                                float(range_count(sheet, 5, 18, 130)))*100),2)
            # exit ejac
            if range_count(sheet, 7, 18, 130) == 0:
                exit_ejac = ""
            else:
                exit_ejac=round(((float(range_count(sheet, 13, 18, 130))
                                /float(range_count(sheet, 7, 18, 130)))*100),2)
            
            # calculate mean content
            # mount
            crm_mount = range_avg(sheet, 9, 18, 130)
            # intro
            crm_intro = range_avg(sheet, 11, 18, 130)
            # ejac
            crm_ejac = range_avg(sheet, 13, 18, 130)

            
            # calculate mean time to exit
            # mount
            texitmount = range_avg(sheet, 22, 18, 130)
            # intro
            texitintro = range_avg(sheet, 23, 18, 130)
            # ejac
            texitejac = range_avg(sheet, 24, 18, 130)


            # calculate the pacing lq
            if (range_count(sheet, 3, 18, 130) + range_count(sheet, 4, 18, 130) + \
                         range_count(sheet, 5, 18, 130) + \
                         range_count(sheet, 6, 18, 130) + \
                         range_count(sheet, 7, 18, 130) + \
                         range_count(sheet, 8, 18, 130)) == 0:
                lq = ""
            else:
                
                lq = round((float(range_count_if_greater_equal(sheet, 4, 18, 130, 2) + \
                          range_count_if_greater_equal(sheet, 6, 18, 130, 2) + \
                          range_count_if_greater_equal(sheet, 7, 18, 130, 2)\
                          )/(float(range_count(sheet, 3, 18, 130) + range_count(sheet, 4, 18, 130) + \
                                 range_count(sheet, 5, 18, 130) + \
                                 range_count(sheet, 6, 18, 130) + \
                                 range_count(sheet, 7, 18, 130) + \
                                 range_count(sheet, 8, 18, 130))/2) * 100),2)
                
            # calculate the pacing lr
            if (range_count(sheet, 4, 18, 130) + \
                        range_count(sheet, 6, 18, 130) + \
                        range_count(sheet, 8, 18, 130)) == 0:
                lr = ""
            else:
                try:
                    lr = round((float(range_sum(sheet, 4, 18, 130) + \
                          range_sum(sheet, 6, 18, 130) + \
                          range_sum(sheet, 8, 18, 130)) \
                          /float(range_count(sheet, 4, 18, 130) + \
                                range_count(sheet, 6, 18, 130) + \
                                range_count(sheet, 8, 18, 130))),2)
                except TypeError:
                    lr = ""
            
            # time with male
            twm = range_sum(sheet, 21, 18, 130)
            # no. of mounts
            mounts = range_count(sheet, 3, 18, 130)
            # no. of intros
            intros = range_count(sheet, 5, 18, 130)
            # no. of ejacs
            ejacs = range_count(sheet, 7, 18, 130)
            # no. of ins
            ins = sheet.cell(4, 3).value
            # no. of outs
            outs = sheet.cell(5, 3).value
            # no. of seconds
            secs = sheet.cell(6, 3).value
            # no. of hops in
            hops_in = sheet.cell(7, 3).value
            # no. of ears in
            ears_in = sheet.cell(8, 3).value
            # no. of rejection behavior
            rej = sheet.cell(14, 3).value
            # female number
            female_number = sheet.cell(1, 1).value
            # get treatment day/ experiment identifier
            treatment_identifier = sheet.cell(15, 3).value
            # no. of hops out
            hops_out = sheet.cell(9, 3).value
            # no. of ears out
            ears_out = sheet.cell(10, 3).value


            data_fields = [ 'female number'+str(treatment_identifier), 'pem'+str(treatment_identifier),'pei'+str(treatment_identifier),'pee'+str(treatment_identifier),'crm'+str(treatment_identifier),'cri'+str(treatment_identifier),'cre'+str(treatment_identifier),'time.exit.m'+str(treatment_identifier),'time.exit.i'+str(treatment_identifier),'time.exit.e'+str(treatment_identifier), 'lq'+str(treatment_identifier),'lr'+str(treatment_identifier),'twm'+str(treatment_identifier),'mounts'+str(treatment_identifier),'intros'+str(treatment_identifier),'ejacs'+str(treatment_identifier),'ins'+str(treatment_identifier),'outs'+str(treatment_identifier),'sec'+str(treatment_identifier),'hopsin'+str(treatment_identifier),'earsin'+str(treatment_identifier),'hopsalone'+str(treatment_identifier),'earsalone'+str(treatment_identifier),'rej'+str(treatment_identifier)]

            data_values = [ female_number, exit_mounts, exit_intros, exit_ejac, crm_mount, crm_intro, crm_ejac,
                            texitmount, texitintro, texitejac, lq, lr, twm, mounts, intros, ejacs,
                            ins, outs, secs, hops_in, ears_in, hops_out, ears_out, rej ]
            res.extend( zip(data_fields, data_values))
            
            # The above replaces
            #res.append((file, i, "pem", exit_mounts))
            # etc
            #res.append((file, i, "rej", rej))

        # read in the data into res
        # then here you could put it into the results.xls file
        for f in range(len(data_fields)):
            sheet_res.write(0, f, data_fields[f])
        #sheet_res.write(0, 2, "pem")
        # etc
        #sheet_res.write(0, 23, "rej")
         
        for i in range(len(res)):
            #print i, res[i]
            n = len(data_fields)
            (fieldname, value) = res[i]
            
            if isinstance(value, float):
                value = round((value), 2)

            sheet_res.write(int(i/n+1), int(i%n), value)
        
        for j in range(0,3):
            for i in range(len(res)):
                n = len(data_fields)
                (fieldname, value) = res[i]
                if fieldname == "TypeStim":
                    sheet_res.row(i/n + 1 + j * len(res)/n).write(11, j+1)
                p = ["pem", "pei", "pee" ]
                c = ["crm", "cri", "cre" ]
                t = ["time.exit.m", "time.exit.i", "time.exit.e"]
                if fieldname == p[j]:
                    sheet_res.row(i/n + 1 + j * len(res)/n).write(12, value)
                if fieldname == c[j]:
                    sheet_res.row(i/n + 1 + j * len(res)/n).write(13, value)
                if fieldname == t[j]:
                    sheet_res.row(i/n + 1 + j * len(res)/n).write(14, value)
        
    results.save("assembled results.xls")

if __name__ == "__main__":
    # remember to check if you are dividing by 0
    main()
