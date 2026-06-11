import pdfplumber, re, sys

pdfs = [
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Pick_Your_Poison.pdf', 'PYP', 30),
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\PyP_PrintAndPlay_NSFW.pdf', 'NSFW', 20),
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Funny-Scenarios-for-kids-and-adults-Would-you-rather-by-Robert-B.-Grand-_z-lib.org_.pdf', 'Funny', 40),
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Would You Rather Book For Kids Funny Questions to Educate and Entertain Kids ages 6-12 (Jokes For Kids Book) by Johnny B. Good [Good, Johnny B.] (z-lib.org).pdf', 'Kids1', 40),
    (r"C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Would-You-Rather-for-Kids-200-Funny-and-Silly-'Would-You-Rather-Questions'-for-Long-Car-Rides-_Trave.pdf", 'Kids2', 40),
    (r'C:\Users\Barros Moreira\Desktop\Jogos\Would You Rather\Would-You-Rather-Sexting_-Sexy-Taboo-Adult-Edition_-Dirty-Talk-Sex-Games-for-Couples_-Men-and-Women-.pdf', 'Sexting', 30),
]

for path, label, maxpages in pdfs:
    print(f'=== {label} ===')
    try:
        with pdfplumber.open(path) as pdf:
            all_text = []
            for i, page in enumerate(pdf.pages[:maxpages]):
                text = page.extract_text()
                if text:
                    all_text.append(text)
            print('\n'.join(all_text[:10]))  # print first 10 pages worth
    except Exception as e:
        print(f'ERROR: {e}')
    print()
