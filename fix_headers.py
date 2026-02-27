#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Fix the broken header character in index.html

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the broken diamond character from news header
content = content.replace('◆ Novidades', 'Novidades')
content = content.replace('◆Novidades', 'Novidades')

# Improve the news section header
old_news_header = '''<div class="mb-12">
                        <h2 class="text-4xl font-black italic mb-3 uppercase">Novidades do Sistema</h2>
                        <p class="text-sm opacity-60 font-bold uppercase tracking-widest">Últimas atualizações e melhorias</p>
                    </div>'''

new_news_header = '''<div class="mb-8">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                <h1 id="news-h1" class="text-4xl font-black italic uppercase mb-2">Novidades do Sistema</h1>
                                <p class="text-sm opacity-60 font-bold uppercase tracking-widest">Últimas atualizações e melhorias | Impacto mede risco/benefício para usuários finais</p>
                            </div>
                            <div class="text-4xl opacity-20">📰</div>
                        </div>
                    </div>'''

content = content.replace(old_news_header, new_news_header)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Headers fixed successfully!")
