import os

src_dir = '/home/vishalsharma/Vishal/cryptus-compiance/cryptus-compliance-frontend/src'

replacements = {
    "max-w-6xl": "max-w-5xl",
    "max-w-7xl": "max-w-5xl",
    '"linear-gradient(135deg,#6366f1,#3b82f6)"': '"#155DFC"',
    '"linear-gradient(135deg,#6366f1 0%,#3b82f6 60%,#8b5cf6 100%)"': '"#155DFC"',
    '"linear-gradient(135deg,#6366f1,#3b82f6 60%,#8b5cf6)"': '"#155DFC"',
    "bg-gradient-to-r from-[#3b1ee8] to-[#2952ff]": "bg-[#155DFC]",
    "bg-gradient-to-br from-[#3b1ee8] via-[#2952ff] to-[#b7c9ff]": "bg-[#155DFC]",
    "from-indigo-600 to-blue-500": "from-[#155DFC] to-[#155DFC]",
    "from-violet-600 to-indigo-500": "from-[#155DFC] to-[#155DFC]",
    "from-blue-600 to-cyan-500": "from-[#155DFC] to-[#155DFC]",
    "via-indigo-300/60": "via-[#155DFC]/60",
    "#e7e5e4": "#155DFC",
    "linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #8b5cf6 100%)": "#155DFC"
}

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.jsx', '.css')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {path}")
