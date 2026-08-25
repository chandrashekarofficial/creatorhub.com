from pathlib import Path

path = Path("src/main/resources/static/js/app.js")
text = path.read_text(encoding="utf-8")

# Replace the currently corrupted symbols with JavaScript Unicode escapes.
text = text.replace('"â€”"', '"\\u2014"')
text = text.replace('" â€“ $"', '" \\u2013 $"')
text = text.replace('" Â· "', '" \\u00B7 "')
text = text.replace('Watch video â†—', 'Watch video \\u2197')
text = text.replace('"âœ“"', '"\\u2713"')
text = text.replace('"â—‹"', '"\\u25CB"')
text = text.replace('"â˜€ï¸"', '"\\u2600\\uFE0F"')
text = text.replace('"â˜¾"', '"\\u263E"')

# Remaining heavily corrupted fallback strings.
# Replace only strings that are still obviously mojibake.
lines = text.splitlines()

for i, line in enumerate(lines):
    if 'return "' in line and ('Ãƒ' in line or 'Ã†' in line):
        lines[i] = '        return "\\u2014";'

    if ': "' in line and ('Ãƒ' in line or 'Ã†' in line):
        # Only repair the country/unavailable fallback.
        if '?' in ''.join(lines[max(0, i-3):i+1]):
            lines[i] = '            : "\\u2014";'

    if '${done ?' in line and ('Ãƒ' in line or 'Ã†' in line):
        lines[i] = '                        ${done ? "\\u2713" : "\\u25CB"}'

    if 'themeToggle' in line and ('Ãƒ' in line or 'Ã†' in line):
        if '=' in line:
            lines[i] = '        $("themeToggle").textContent = "\\u263E";'

text = "\n".join(lines) + "\n"
path.write_text(text, encoding="utf-8")

print("DONE - replaced corrupted UI characters with Unicode escapes")
