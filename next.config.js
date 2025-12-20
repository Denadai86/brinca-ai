/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Atenção: Isso permite que o build passe mesmo com avisos de lint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Isso ignora erros de tipagem no build se necessário (use com cautela)
    ignoreBuildErrors: true,
  },
  // Configuração específica do React Compiler se quiser desativar a trava
};
export default nextConfig;