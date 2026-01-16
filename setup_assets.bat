@echo off
echo Setting up documentation assets...

if not exist "docs\assets" mkdir "docs\assets"

copy "C:\Users\youse\.gemini\antigravity\brain\7071933b-5fa2-49b8-8491-1fb77dc7546d\uploaded_image_0_1768559854530.png" "docs\assets\dashboard.png"
copy "C:\Users\youse\.gemini\antigravity\brain\7071933b-5fa2-49b8-8491-1fb77dc7546d\uploaded_image_1_1768559854530.png" "docs\assets\modal.png"
copy "C:\Users\youse\.gemini\antigravity\brain\7071933b-5fa2-49b8-8491-1fb77dc7546d\nexterp_logo_1768559915042.png" "docs\assets\logo.png"

echo Assets copied successfully!
pause
