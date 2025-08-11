const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Iniciando build do EPL...');

// Instala dependências se necessário
if (!fs.existsSync('node_modules')) {
    console.log('📦 Instalando dependências...');
    execSync('npm install', { stdio: 'inherit' });
}

// Cria estrutura de diretórios
const releaseDir = 'release/EPL';
if (fs.existsSync('release')) {
    fs.rmSync('release', { recursive: true, force: true });
}
fs.mkdirSync('release/EPL/lib', { recursive: true });
fs.mkdirSync('release/EPL/plugins', { recursive: true });

console.log('📁 Copiando arquivos principais...');

// Função para copiar diretório recursivamente
function copyDir(src, dest) {
    if (!fs.existsSync(src)) {
        console.log(`⚠️  ${src} não encontrado, pulando...`);
        return;
    }
    
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copia arquivos principais
if (fs.existsSync('EPL-config.toml')) {
    fs.copyFileSync('EPL-config.toml', 'release/EPL/EPL-config.toml');
}
if (fs.existsSync('init.js')) {
    fs.copyFileSync('init.js', 'release/EPL/init.js');
}

// Copia core-js do node_modules
console.log('📚 Copiando core-js...');
copyDir('node_modules/core-js', 'release/EPL/lib/core-js');

// Copia outras bibliotecas customizadas
console.log('📚 Copiando bibliotecas customizadas...');
copyDir('lib/_smol-toml', 'release/EPL/lib/_smol-toml');
copyDir('lib/smol-toml', 'release/EPL/lib/smol-toml');

// Copia pasta plugins
console.log('🔌 Copiando plugins...');
copyDir('plugins', 'release/EPL/plugins');

// Cria README para o release
const readmeContent = `# EPL - External Plugin Loader para RPG Maker MV

Este é um build completo do EPL com todas as dependências incluídas.

## Instalação

1. Extraia este arquivo na pasta raiz do seu projeto RPG Maker MV
2. Configure o \`EPL-config.toml\` conforme necessário
3. Execute o \`init.js\` no seu projeto

## Estrutura

- \`EPL-config.toml\` - Arquivo de configuração principal
- \`init.js\` - Script de inicialização
- \`lib/\` - Bibliotecas necessárias (core-js, smol-toml, etc.)
- \`plugins/\` - Plugins externos

## Suporte

Para suporte e documentação, visite: https://github.com/SEU_USUARIO/RPG-Maker-Plugins
`;

fs.writeFileSync('release/EPL/README.md', readmeContent);

console.log('✅ Build concluído! Arquivos estão em release/EPL/');
console.log('📦 Para criar um arquivo ZIP, execute: npm run release');