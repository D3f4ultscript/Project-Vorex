import PyInstaller.__main__
import os

PyInstaller.__main__.run([
    'main.py',
    '--onefile',
    '--name=ProjectVorex',
    '--console',
    '--add-data=config.py;.',
    '--hidden-import=discord',
    '--hidden-import=asyncio'
])
