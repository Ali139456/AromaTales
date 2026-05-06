import openpyxl

wb = openpyxl.load_workbook("Aroma Tales.xlsx", read_only=True, data_only=True)
ws = wb["Perfumes Names"]
for r in ws.iter_rows(min_row=2, values_only=True):
    p = str(r[2] or "").strip()
    o = str(r[1] or "").strip()
    pr = r[0]
    if p:
        print(repr(p), pr, repr(o))
