const { execSync } = require('child_process');
const fs = require('fs');

try {
    console.log('Iniciando compactação do projeto...');
    // Compacta tudo exceto node_modules e pastas de cache
    execSync('tar -czvf projeto_completo.tar.gz --exclude=node_modules --exclude=.cache --exclude=.deps_cache --exclude=projeto_completo.tar.gz .');
    console.log('Projeto compactado com sucesso: projeto_completo.tar.gz');
    
    // Mantém o processo vivo por um tempo para garantir que o arquivo apareça no painel
    console.log('O arquivo está pronto. Você pode baixá-lo na aba Files.');
    console.log('Este script ficará ativo por 5 minutos antes de encerrar.');
    setTimeout(() => {
        console.log('Encerrando script de backup.');
        process.exit(0);
    }, 300000); 
} catch (error) {
    console.error('Erro ao compactar projeto:', error.message);
    process.exit(1);
}
