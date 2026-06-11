import pdfplumber

pdfs = [
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Funny-Scenarios-for-kids-and-adults-Would-you-rather-by-Robert-B.-Grand-_z-lib.org_.pdf', 'Funny', 200),
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Would You Rather Book For Kids Funny Questions to Educate and Entertain Kids ages 6-12 (Jokes For Kids Book) by Johnny B. Good [Good, Johnny B.] (z-lib.org).pdf', 'Kids1', 200),
    (r"C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Would-You-Rather-for-Kids-200-Funny-and-Silly-'Would-You-Rather-Questions'-for-Long-Car-Rides-_Trave.pdf", 'Kids2', 200),
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Would-You-Rather-Sexting_-Sexy-Taboo-Adult-Edition_-Dirty-Talk-Sex-Games-for-Couples_-Men-and-Women-.pdf', 'Sexting', 100),
]

for path, label, maxpages in pdfs:
    print(f'=== {label} ===')
    try:
        with pdfplumber.open(path) as pdf:
            for i, page in enumerate(pdf.pages[:maxpages]):
                text = page.extract_text()
                if text:
                    print(text)
    except Exception as e:
        print(f'ERROR: {e}')
    print()
