const fs = require('fs');

// Read the file
let content = fs.readFileSync('index.html', 'utf8');

// Replace the broken character and improve header
content = content.replace(
  /<div class="mb-12">\s*<h2 class="text-4xl font-black italic mb-3 uppercase">[^<]*Novidades do Sistema<\/h2>\s*<p[^>]*>Últimas atualizações e melhorias<\/p>\s*<\/div>/,
  `<div class="mb-8">
                        <div class="flex items-start justify-between mb-6">
                            <div>
                                <h1 class="text-4xl font-black italic uppercase mb-2">Novidades do Sistema</h1>
                                <p class="text-sm opacity-60 font-bold uppercase tracking-widest">Últimas atualizações e melhorias | Impacto mede risco/benefício para usuários finais</p>
                            </div>
                            <div class="text-4xl opacity-20">📰</div>
                        </div>
                    </div>`
);

// Write back
fs.writeFileSync('index.html', content, 'utf8');
console.log('✓ Headers fixed successfully!');
