import os
from pypdf import PdfReader, PdfWriter
from pypdf.generic import FloatObject, RectangleObject

def remove_pdf_header(input_pdf_path, output_pdf_path):
    print(f"Processing {input_pdf_path}...")
    reader = PdfReader(input_pdf_path)
    writer = PdfWriter()

    for idx, page in enumerate(reader.pages):
        if idx == 0:
            # Set CropBox and MediaBox to [0, 0, 595.44, 395]
            # This crops out the top header (Y=395 to Y=841.68) completely
            box = RectangleObject([FloatObject(0), FloatObject(0), FloatObject(595.44), FloatObject(395)])
            page.cropbox = box
            page.mediabox = box
        writer.add_page(page)

    with open(output_pdf_path, "wb") as f:
        writer.write(f)
    print(f"Successfully saved clean PDF to {output_pdf_path}")

if __name__ == "__main__":
    src = "assignemet1.pdf"
    dst = "assignemet1_no_header.pdf"
    if os.path.exists(src):
        remove_pdf_header(src, dst)
    else:
        print(f"Error: {src} not found.")
