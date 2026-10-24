from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

OUT = r"C:\Users\ccoop\rigfloorhq\public\downloads\es-kill-sheet-blank.pdf"

c = canvas.Canvas(OUT, pagesize=letter)
W, H = letter
MARGIN = 0.55 * inch
x0 = MARGIN
x1 = W - MARGIN
col_w = (x1 - x0 - 0.3 * inch) / 2
col2_x = x0 + col_w + 0.3 * inch

y = H - MARGIN

def header():
    global y
    c.setFont("Helvetica-Bold", 16)
    c.drawString(x0, y, "HOJA DE CONTROL — FORMULARIO EN BLANCO")
    c.setFont("Helvetica", 8)
    c.drawRightString(x1, y + 2, "rigfloorhq.com/es/calculators/kill-sheet")
    y -= 14
    c.setLineWidth(1)
    c.line(x0, y, x1, y)
    y -= 16

def section_title(title):
    global y
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(x0, y, title)
    y -= 13

def field_row(label_l, label_r=None):
    global y
    c.setFont("Helvetica", 8.5)
    c.drawString(x0, y, label_l)
    c.setLineWidth(0.6)
    c.line(x0, y - 11, x0 + col_w, y - 11)
    if label_r:
        c.drawString(col2_x, y, label_r)
        c.line(col2_x, y - 11, col2_x + col_w, y - 11)
    y -= 24

def spacer(h=6):
    global y
    y -= h

header()

section_title("DATOS DEL POZO Y DE LA SURGENCIA")
field_row("Profundidad Vertical Verdadera (ft)", "Peso de Lodo Original (ppg)")
field_row("SIDPP (psi)", "Presion de Circ. Lenta @ SPM (psi)")
field_row("SICP (psi)", "MAASP (psi)")
spacer()

section_title("DATOS DE BOMBA")
field_row("Salida de Bomba (bbl/embolada)")
spacer()

section_title("VOLUMEN DE LA SARTA DE PERFORACION")
field_row("Longitud de Tuberia de Perforacion (ft)", "Capacidad de Tuberia de Perforacion (bbl/ft)")
field_row("Longitud de Lastrabarrenas/BHA (ft)", "Capacidad de Lastrabarrenas/BHA (bbl/ft)")
spacer()

section_title("VOLUMEN ANULAR")
field_row("Longitud Anular TP/Hoyo Abierto (ft)", "Capacidad Anular TP/Hoyo Abierto (bbl/ft)")
field_row("Longitud Anular Lastrabarrenas/Hoyo Abierto (ft)", "Capacidad Anular Lastrabarrenas/Hoyo Abierto (bbl/ft)")
spacer()

section_title("RESULTADOS")
field_row("Peso de Lodo de Matanza (ppg)", "Presion de Circulacion Inicial / ICP (psi)")
field_row("Presion de Circulacion Final / FCP (psi)", "Volumen Total de la Sarta (bbl)")
field_row("Volumen Anular Total (bbl)", "Emboladas a la Barrena")
field_row("Emboladas de Fondo Arriba", "Circulacion Total / Emboladas para Matar")
spacer(4)

section_title("PROGRAMA DE PRESION DE TUBERIA DE PERFORACION")

table_top = y
row_h = 15.5
n_rows = 12
col1_w = 1.1 * inch
col2_w = 2.0 * inch
col3_w = (x1 - x0) - col1_w - col2_w

c.setFont("Helvetica-Bold", 8.5)
header_h = 16
c.setLineWidth(0.8)
c.rect(x0, table_top - header_h, x1 - x0, header_h, stroke=1, fill=0)
c.drawCentredString(x0 + col1_w / 2, table_top - header_h + 4.5, "Paso")
c.drawCentredString(x0 + col1_w + col2_w / 2, table_top - header_h + 4.5, "Emboladas Acumuladas")
c.drawCentredString(x0 + col1_w + col2_w + col3_w / 2, table_top - header_h + 4.5, "Presion de Tuberia (psi)")

c.line(x0 + col1_w, table_top - header_h, x0 + col1_w, table_top)
c.line(x0 + col1_w + col2_w, table_top - header_h, x0 + col1_w + col2_w, table_top)

row_top = table_top - header_h
c.setLineWidth(0.5)
for i in range(n_rows):
    rb = row_top - row_h
    c.rect(x0, rb, x1 - x0, row_h, stroke=1, fill=0)
    c.line(x0 + col1_w, rb, x0 + col1_w, row_top)
    c.line(x0 + col1_w + col2_w, rb, x0 + col1_w + col2_w, row_top)
    c.setFont("Helvetica", 8)
    c.drawCentredString(x0 + col1_w / 2, rb + 4.5, str(i + 1))
    row_top = rb

y = row_top - 14

c.setLineWidth(0.6)
c.line(x0, y, x1, y)
y -= 11
c.setFont("Helvetica", 7)
c.drawString(x0, y, "Formulas: HP = 0.052 x MW x TVD   |   KMW = OMW + (SIDPP / (0.052 x TVD))   |   ICP = SPR + SIDPP   |   FCP = SPR x (KMW / OMW)")
y -= 10
c.drawString(x0, y, "Para la calculadora en vivo y las explicaciones completas, ver rigfloorhq.com/es/calculators/kill-sheet")

c.showPage()
c.save()
print("Wrote", OUT)
